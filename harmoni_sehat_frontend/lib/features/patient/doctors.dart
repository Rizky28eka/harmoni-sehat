import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
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
          padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
          child: TextField(
            controller: c.search,
            onChanged: c.onSearch,
            decoration: InputDecoration(
              hintText: 'Cari nama dokter'.tr,
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: PopupMenuButton<String>(
                icon: const Icon(Icons.tune_rounded),
                onSelected: (v) {
                  c.sort.value = v;
                  c.load();
                },
                itemBuilder: (_) => [
                  PopupMenuItem(value: 'rating', child: Text('Rating tertinggi'.tr)),
                  PopupMenuItem(value: 'fee_asc', child: Text('Biaya terendah'.tr)),
                  PopupMenuItem(value: 'fee_desc', child: Text('Biaya tertinggi'.tr)),
                  PopupMenuItem(value: 'name', child: Text('Nama A–Z'.tr)),
                ],
              ),
            ),
          ),
        ),
        SizedBox(
          height: 50,
          child: Obx(() => ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6), children: [
                Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: Text('Semua'.tr), selected: c.selectedSpec.value == null, onSelected: (_) { c.selectedSpec.value = null; c.load(); })),
                for (final s in c.specs)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(label: Text('${s['nama']}'), selected: c.selectedSpec.value == s['_id'], onSelected: (_) { c.selectedSpec.value = s['_id'].toString(); c.load(); }),
                  ),
              ])),
        ),
        Expanded(
          child: Obx(() => asyncBody(
                loading: c.loading.value,
                error: c.error.value,
                isEmpty: c.doctors.isEmpty,
                emptyText: 'Dokter tidak ditemukan',
                emptyIcon: Icons.person_search_rounded,
                onRetry: c.load,
                builder: () => RefreshIndicator(
                  onRefresh: c.load,
                  child: ListView.builder(
                    controller: c.scroll,
                    padding: const EdgeInsets.fromLTRB(20, 6, 20, 28),
                    itemCount: c.doctors.length + (c.loadingMore.value ? 1 : 0),
                    itemBuilder: (_, i) => i >= c.doctors.length ? const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator())) : DoctorCard(d: c.doctors[i], index: i),
                  ),
                ),
              )),
        ),
      ]),
    );
  }
}

class DoctorCard extends StatelessWidget {
  const DoctorCard({super.key, required this.d, this.index = 0});
  final Map<String, dynamic> d;
  final int index;

  static const _tones = [Tone.mint, Tone.sky, Tone.peach, Tone.lilac, Tone.rose, Tone.butter];

  @override
  Widget build(BuildContext context) {
    final spec = asMap(d['spesialisasi_id']);
    final rating = (d['rating'] as num?)?.toDouble() ?? 0;
    final tone = _tones[index % _tones.length];
    final ink = toneOf(context, tone).ink;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: SoftCard(
        tone: tone,
        variant: index,
        radius: 28,
        padding: const EdgeInsets.all(16),
        onTap: () => Get.toNamed(AppRoutes.doctorDetail, arguments: d['_id'].toString()),
        child: Row(children: [
          Avatar(name: d['nama']?.toString() ?? '', url: d['foto']?.toString(), radius: 34),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(d['nama']?.toString() ?? '', maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16.5, color: ink, letterSpacing: -0.3)),
              const SizedBox(height: 2),
              Text(spec['nama']?.toString() ?? 'Dokter', style: TextStyle(color: ink.withValues(alpha: 0.8), fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 10),
              Row(children: [
                Flexible(child: Pill(' ${rating == 0 ? 'Baru'.tr : rating.toStringAsFixed(1)}${(d['jumlah_ulasan'] ?? 0) > 0 ? ' (${d['jumlah_ulasan']})' : ''}', tone: Tone.butter, icon: Icons.star_rounded, dense: true)),
                const SizedBox(width: 8),
                Expanded(child: Align(alignment: Alignment.centerRight, child: FittedBox(fit: BoxFit.scaleDown, child: Text(rupiah(d['biaya_konsultasi'] as num?), style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5, color: ink))))),
              ]),
            ]),
          ),
        ]),
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
      appBar: AppBar(title: Text('Detail Dokter'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            builder: () => _content(context, c),
          )),
      bottomNavigationBar: Obx(() {
        final d = c.data.value;
        if (d == null) return const SizedBox.shrink();
        final fee = d.n('biaya_konsultasi');
        return SafeArea(
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
            decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, border: Border(top: BorderSide(color: Theme.of(context).colorScheme.outline))),
            child: Row(children: [
              Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Biaya konsultasi'.tr, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                Text(fee > 0 ? rupiah(fee) : 'Gratis'.tr, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              ]),
              const SizedBox(width: 18),
              Expanded(
                child: FilledButton.icon(
                  onPressed: c.booking.value ? null : c.book,
                  icon: c.booking.value ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.event_available_rounded),
                  label: Text(fee > 0 ? '${'Pesan & Bayar'.tr} ${rupiah(fee)}' : 'Pesan Konsultasi'.tr, overflow: TextOverflow.ellipsis),
                ),
              ),
            ]),
          ),
        );
      }),
    );
  }

  Widget _content(BuildContext context, DoctorDetailController c) {
    final d = c.data.value!;
    final spec = asMap(d['spesialisasi_id']);
    final reviews = asList(d['ulasan']);
    final days = List.generate(14, (i) => DateTime.now().add(Duration(days: i + (DateTime.now().hour >= 20 ? 1 : 0))));
    final mint = toneOf(context, Tone.mint);
    return ListView(padding: const EdgeInsets.only(bottom: 24), children: [
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: SoftCard(
          tone: Tone.mint,
          radius: 32,
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
          child: Column(children: [
            Avatar(name: d.s('nama'), url: d['foto']?.toString(), radius: 46),
            const SizedBox(height: 14),
            Text(d.s('nama'), textAlign: TextAlign.center, style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: mint.ink, letterSpacing: -0.4)),
            const SizedBox(height: 4),
            Text(spec['nama']?.toString() ?? 'Dokter', style: TextStyle(color: mint.ink.withValues(alpha: 0.8), fontWeight: FontWeight.w500)),
            const SizedBox(height: 18),
            Row(children: [
              _stat(context, Icons.star_rounded, d.n('rating') == 0 ? 'Baru'.tr : d.n('rating').toStringAsFixed(1), 'Rating'.tr),
              _stat(context, Icons.chat_rounded, '${d.n('jumlah_ulasan').toInt()}', 'ulasan'.tr),
              _stat(context, Icons.payments_rounded, rupiah(d.n('biaya_konsultasi')).replaceAll('Rp ', ''), 'Biaya konsultasi'.tr),
            ]),
          ]),
        ),
      ),
      if (d.s('bio').isNotEmpty) Padding(padding: const EdgeInsets.fromLTRB(24, 18, 24, 0), child: Text(d.s('bio'), style: const TextStyle(height: 1.5, color: AppColors.textSecondary))),
      SectionHeading('Pilih tanggal'.tr),
      SizedBox(
        height: 84,
        child: Obx(() {
          final selectedDay = c.selectedDate.value; // read here: item builders run outside this Obx's scope
          return ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: days.length,
            separatorBuilder: (_, __) => const SizedBox(width: 10),
            itemBuilder: (_, i) {
              final day = days[i];
              final sel = DateUtils.isSameDay(day, selectedDay);
              return GestureDetector(
                onTap: () => c.pickDate(day),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  width: 58,
                  decoration: BoxDecoration(
                    color: sel ? AppColors.primaryColor : Theme.of(context).colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: sel ? [BoxShadow(color: AppColors.primaryColor.withValues(alpha: 0.35), blurRadius: 14, offset: const Offset(0, 6))] : null,
                  ),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text(DateFormat('E', Get.locale?.languageCode == 'en' ? 'en_US' : 'id_ID').format(day), style: TextStyle(color: sel ? Colors.white70 : AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('${day.day}', style: TextStyle(color: sel ? Colors.white : null, fontWeight: FontWeight.w800, fontSize: 20)),
                  ]),
                ),
              );
            },
          );
        }),
      ),
      SectionHeading('Pilih jam (WIB)'.tr),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Obx(() {
          if (c.slotsLoading.value) return const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator()));
          if (c.slots.isEmpty) return SoftCard(tone: Tone.slate, blobs: false, radius: 20, child: Text('Tidak ada jadwal praktik pada tanggal ini.'.tr, style: const TextStyle(color: AppColors.textSecondary)));
          return Wrap(spacing: 10, runSpacing: 10, children: [
            for (final s in c.slots)
              ChoiceChip(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                label: Text(DateFormat('HH:mm').format(DateTime.parse(s['start'] as String).toUtc().add(const Duration(hours: 7)))),
                selected: c.selectedSlot.value == s,
                onSelected: s['available'] == true ? (_) => c.selectedSlot.value = s : null,
              ),
          ]);
        }),
      ),
      const SizedBox(height: 18),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: TextField(controller: c.complaint, maxLines: 3, decoration: InputDecoration(labelText: 'Keluhan Anda'.tr, alignLabelWithHint: true)),
      ),
      if (reviews.isNotEmpty) ...[
        SectionHeading('Ulasan pasien'.tr),
        for (final r in reviews)
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
            child: SoftCard(
              radius: 22,
              padding: const EdgeInsets.all(14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [for (var i = 0; i < 5; i++) Icon(i < (r['rating'] as num) ? Icons.star_rounded : Icons.star_border_rounded, color: AppColors.accentAmber, size: 18)]),
                if ((r['komentar'] ?? '').toString().isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Text('${r['komentar']}')),
                if (r['balasan'] != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text('↳ ${'Dokter'.tr}: ${r['balasan']}', style: const TextStyle(color: AppColors.textSecondary))),
              ]),
            ),
          ),
      ],
    ]);
  }

  Widget _stat(BuildContext context, IconData icon, String value, String label) {
    final ink = toneOf(context, Tone.mint).ink;
    return Expanded(
      child: Column(children: [
        Icon(icon, color: ink, size: 22),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: ink)),
        Text(label, style: TextStyle(fontSize: 11, color: ink.withValues(alpha: 0.75))),
      ]),
    );
  }
}
