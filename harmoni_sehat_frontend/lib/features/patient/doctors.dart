import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../../app/routes/app_routes.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/ui.dart';

class DoctorListController extends GetxController {
  final _api = Get.find<ApiClient>();
  final doctors = <Map<String, dynamic>>[].obs;
  final specs = <Map<String, dynamic>>[].obs;
  final loading = true.obs;
  final loadingMore = false.obs;
  final error = RxnString();
  final selectedSpec = RxnString();
  final sort = 'rating'.obs;
  final search = TextEditingController();
  final scroll = ScrollController();
  int _page = 1;
  int _total = 0;
  Timer? _debounce;

  @override
  void onInit() {
    super.onInit();
    scroll.addListener(() {
      if (scroll.position.pixels > scroll.position.maxScrollExtent - 300) loadMore();
    });
    _api.get('/specializations', cache: true).then((v) => specs.assignAll(asList(v))).catchError((_) {});
    load();
  }

  void onSearch(String _) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), load);
  }

  Map<String, dynamic> get _query => {
        'page': _page,
        'limit': 10,
        'sort': sort.value,
        if (search.text.trim().isNotEmpty) 'search': search.text.trim(),
        if (selectedSpec.value != null) 'spesialisasi': selectedSpec.value,
      };

  Future<void> load() async {
    loading.value = true;
    error.value = null;
    _page = 1;
    try {
      final r = asMap(await _api.get('/booking/doctors', query: _query, cache: true));
      doctors.assignAll(asList(r['data']));
      _total = (r['total'] as num?)?.toInt() ?? 0;
    } catch (e) {
      error.value = e is ApiException ? e.message : 'Gagal memuat dokter';
    } finally {
      loading.value = false;
    }
  }

  Future<void> loadMore() async {
    if (loadingMore.value || loading.value || doctors.length >= _total) return;
    loadingMore.value = true;
    _page++;
    try {
      final r = asMap(await _api.get('/booking/doctors', query: _query));
      doctors.addAll(asList(r['data']));
    } catch (_) {
      _page--;
    } finally {
      loadingMore.value = false;
    }
  }

  @override
  void onClose() {
    _debounce?.cancel();
    search.dispose();
    scroll.dispose();
    super.onClose();
  }
}

class DoctorListView extends StatelessWidget {
  const DoctorListView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(DoctorListController());
    return Scaffold(
      appBar: AppBar(title: Text('Cari dokter'.tr)),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
          child: TextField(
            controller: c.search,
            onChanged: c.onSearch,
            decoration: InputDecoration(
              hintText: 'Cari nama dokter',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: PopupMenuButton<String>(
                icon: const Icon(Icons.sort),
                onSelected: (v) {
                  c.sort.value = v;
                  c.load();
                },
                itemBuilder: (_) => const [
                  PopupMenuItem(value: 'rating', child: Text('Rating tertinggi')),
                  PopupMenuItem(value: 'fee_asc', child: Text('Biaya terendah')),
                  PopupMenuItem(value: 'fee_desc', child: Text('Biaya tertinggi')),
                  PopupMenuItem(value: 'name', child: Text('Nama A–Z')),
                ],
              ),
            ),
          ),
        ),
        SizedBox(
          height: 52,
          child: Obx(() => ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), children: [
                Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: const Text('Semua'), selected: c.selectedSpec.value == null, onSelected: (_) { c.selectedSpec.value = null; c.load(); })),
                for (final s in c.specs)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(label: Text('${s['nama']}'), selected: c.selectedSpec.value == s['_id'], onSelected: (_) { c.selectedSpec.value = s['_id'].toString(); c.load(); }),
                  ),
              ])),
        ),
        Expanded(
          child: Obx(() => AsyncBody(
                loading: c.loading.value,
                error: c.error.value,
                isEmpty: c.doctors.isEmpty,
                emptyText: 'Dokter tidak ditemukan',
                emptyIcon: Icons.person_search_outlined,
                onRetry: c.load,
                child: RefreshIndicator(
                  onRefresh: c.load,
                  child: ListView.builder(
                    controller: c.scroll,
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                    itemCount: c.doctors.length + (c.loadingMore.value ? 1 : 0),
                    itemBuilder: (_, i) => i >= c.doctors.length ? const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator())) : DoctorCard(d: c.doctors[i]),
                  ),
                ),
              )),
        ),
      ]),
    );
  }
}

class DoctorCard extends StatelessWidget {
  const DoctorCard({super.key, required this.d});
  final Map<String, dynamic> d;

  @override
  Widget build(BuildContext context) {
    final spec = asMap(d['spesialisasi_id']);
    final rating = (d['rating'] as num?)?.toDouble() ?? 0;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => Get.toNamed(AppRoutes.doctorDetail, arguments: d['_id'].toString()),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(children: [
            Avatar(name: d['nama']?.toString() ?? '', url: d['foto']?.toString(), radius: 30),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(d['nama']?.toString() ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text(spec['nama']?.toString() ?? 'Dokter', style: const TextStyle(color: Colors.grey)),
                const SizedBox(height: 6),
                Row(children: [
                  const Icon(Icons.star, color: Colors.amber, size: 16),
                  Text(' ${rating == 0 ? 'Baru' : rating.toStringAsFixed(1)}${(d['jumlah_ulasan'] ?? 0) > 0 ? ' (${d['jumlah_ulasan']})' : ''}'),
                  const Spacer(),
                  Text(rupiah(d['biaya_konsultasi'] as num?), style: const TextStyle(fontWeight: FontWeight.bold)),
                ]),
              ]),
            ),
          ]),
        ),
      ),
    );
  }
}

class DoctorDetailController extends LoadController<Map<String, dynamic>> {
  DoctorDetailController(this.id);
  final String id;
  final _api = Get.find<ApiClient>();

  final selectedDate = DateTime.now().add(const Duration(days: 1)).obs;
  final slots = <Map<String, dynamic>>[].obs;
  final slotsLoading = false.obs;
  final selectedSlot = Rxn<Map<String, dynamic>>();
  final complaint = TextEditingController();
  final booking = false.obs;

  @override
  Future<Map<String, dynamic>> fetch() async {
    final d = asMap(await _api.get('/booking/doctors/$id'));
    loadSlots();
    return d;
  }

  Future<void> loadSlots() async {
    slotsLoading.value = true;
    selectedSlot.value = null;
    try {
      final date = DateFormat('yyyy-MM-dd').format(selectedDate.value);
      slots.assignAll(asList(await _api.get('/booking/doctors/$id/slots', query: {'date': date})));
    } catch (e) {
      slots.clear();
      showError(e);
    } finally {
      slotsLoading.value = false;
    }
  }

  void pickDate(DateTime d) {
    selectedDate.value = d;
    loadSlots();
  }

  Future<void> book() async {
    final slot = selectedSlot.value;
    if (slot == null) return showError('Pilih jam konsultasi terlebih dahulu');
    if (complaint.text.trim().length < 3) return showError('Tuliskan keluhan Anda');
    booking.value = true;
    try {
      final r = asMap(await _api.post('/booking/consultations', data: {
        'dokter_id': id,
        'jadwal_id': slot['jadwal_id'],
        'start': slot['start'],
        'keluhan': complaint.text.trim(),
      }));
      final consultation = asMap(r['consultation']);
      final tx = r['transaction'];
      if (tx == null) {
        showSuccess('Konsultasi terjadwal');
        Get.offNamed(AppRoutes.consultation, arguments: consultation['_id'].toString());
      } else {
        Get.offNamed(AppRoutes.payment, arguments: {'order_id': asMap(tx)['order_id'], 'next': 'consultation', 'next_id': consultation['_id'].toString()});
      }
    } catch (e) {
      showError(e);
      loadSlots();
    } finally {
      booking.value = false;
    }
  }

  @override
  void onClose() {
    complaint.dispose();
    super.onClose();
  }
}

class DoctorDetailView extends StatelessWidget {
  const DoctorDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final id = Get.arguments as String;
    final c = Get.put(DoctorDetailController(id), tag: id);
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Dokter')),
      body: Obx(() => AsyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            child: _content(context, c),
          )),
    );
  }

  Widget _content(BuildContext context, DoctorDetailController c) {
    final d = c.data.value!;
    final spec = asMap(d['spesialisasi_id']);
    final reviews = asList(d['ulasan']);
    final days = List.generate(14, (i) => DateTime.now().add(Duration(days: i + (DateTime.now().hour >= 20 ? 1 : 0))));
    return ListView(padding: const EdgeInsets.all(16), children: [
      Row(children: [
        Avatar(name: d.s('nama'), url: d['foto']?.toString(), radius: 40),
        const SizedBox(width: 16),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(d.s('nama'), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            Text(spec['nama']?.toString() ?? 'Dokter', style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 6),
            Row(children: [
              const Icon(Icons.star, color: Colors.amber, size: 18),
              Text(' ${d.n('rating') == 0 ? 'Baru' : d.n('rating').toStringAsFixed(1)} • ${d.n('jumlah_ulasan').toInt()} ulasan'),
            ]),
          ]),
        ),
      ]),
      if (d.s('bio').isNotEmpty) ...[const SizedBox(height: 16), Text(d.s('bio'))],
      const SizedBox(height: 8),
      ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.payments_outlined), title: const Text('Biaya konsultasi'), trailing: Text(rupiah(d.n('biaya_konsultasi')), style: const TextStyle(fontWeight: FontWeight.bold))),
      const Divider(),
      Text('Pilih tanggal', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      SizedBox(
        height: 72,
        child: Obx(() => ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: days.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final day = days[i];
                final sel = DateUtils.isSameDay(day, c.selectedDate.value);
                return GestureDetector(
                  onTap: () => c.pickDate(day),
                  child: Container(
                    width: 56,
                    decoration: BoxDecoration(color: sel ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(12)),
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text(DateFormat('E', 'id_ID').format(day), style: TextStyle(color: sel ? Colors.white : null, fontSize: 12)),
                      Text('${day.day}', style: TextStyle(color: sel ? Colors.white : null, fontWeight: FontWeight.bold, fontSize: 18)),
                    ]),
                  ),
                );
              },
            )),
      ),
      const SizedBox(height: 16),
      Text('Pilih jam (WIB)', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      Obx(() {
        if (c.slotsLoading.value) return const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator()));
        if (c.slots.isEmpty) return const Padding(padding: EdgeInsets.all(12), child: Text('Tidak ada jadwal praktik pada tanggal ini.', style: TextStyle(color: Colors.grey)));
        return Wrap(spacing: 8, runSpacing: 8, children: [
          for (final s in c.slots)
            ChoiceChip(
              label: Text(DateFormat('HH:mm').format(DateTime.parse(s['start'] as String).toUtc().add(const Duration(hours: 7)))),
              selected: c.selectedSlot.value == s,
              onSelected: s['available'] == true ? (_) => c.selectedSlot.value = s : null,
            ),
        ]);
      }),
      const SizedBox(height: 16),
      TextField(controller: c.complaint, maxLines: 3, decoration: const InputDecoration(labelText: 'Keluhan Anda', alignLabelWithHint: true)),
      const SizedBox(height: 16),
      Obx(() => FilledButton.icon(
            onPressed: c.booking.value ? null : c.book,
            icon: c.booking.value ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.event_available),
            label: Text(d.n('biaya_konsultasi') > 0 ? 'Pesan & Bayar ${rupiah(d.n('biaya_konsultasi'))}' : 'Pesan Konsultasi'),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
          )),
      if (reviews.isNotEmpty) ...[
        const SizedBox(height: 24),
        Text('Ulasan pasien', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
        for (final r in reviews)
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Row(children: [for (var i = 0; i < 5; i++) Icon(i < (r['rating'] as num) ? Icons.star : Icons.star_border, color: Colors.amber, size: 16)]),
            subtitle: Text('${r['komentar'] ?? ''}${r['balasan'] != null ? '\n↳ Dokter: ${r['balasan']}' : ''}'),
          ),
      ],
    ]);
  }
}
