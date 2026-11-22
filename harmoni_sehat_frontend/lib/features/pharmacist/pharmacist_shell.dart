import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';

class PharmacistOrdersController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  final filter = 'processing'.obs;

  @override
  void onInit() {
    super.onInit();
    Get.find<SocketService>().connect();
    primeUnreadCount();
    ever(Get.find<SocketService>().unread, (_) => load(silent: true));
  }

  @override
  Future<List<Map<String, dynamic>>> fetch() async =>
      asList(asMap(await _api.get('/shop/orders', query: {'status': filter.value, 'limit': 50}, cache: true))['data']);
}

class PharmacistShell extends StatefulWidget {
  const PharmacistShell({super.key});

  @override
  State<PharmacistShell> createState() => _PharmacistShellState();
}

class _PharmacistShellState extends State<PharmacistShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final titles = ['Pesanan', 'Stok Obat', 'Profil'];
    return Scaffold(
      appBar: AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell(), SizedBox(width: 8)]),
      body: Column(children: [const OfflineBanner(), Expanded(child: IndexedStack(index: _index, children: const [_OrdersQueue(), StockTab(), ProfileTab()]))]),
      bottomNavigationBar: FloatingNavBar(
        index: _index,
        onChanged: (i) => setState(() => _index = i),
        items: [
          NavItem(Icons.receipt_long_outlined, Icons.receipt_long_rounded, 'Pesanan'.tr),
          NavItem(Icons.inventory_2_outlined, Icons.inventory_2_rounded, 'Stok'.tr),
          NavItem(Icons.person_outline, Icons.person_rounded, 'Profil'.tr),
        ],
      ),
    );
  }
}

class _OrdersQueue extends StatelessWidget {
  const _OrdersQueue();

  @override
  Widget build(BuildContext context) {
    final c = Get.put(PharmacistOrdersController());
    return Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 10),
        child: Obx(() => SizedBox(width: double.infinity, child: SegmentedButton<String>(
              showSelectedIcon: false,
              segments: [ButtonSegment(value: 'processing', label: Text('Diproses'.tr)), ButtonSegment(value: 'shipped', label: Text('Dikirim'.tr)), ButtonSegment(value: 'delivered,cancelled', label: Text('Selesai'.tr))],
              selected: {c.filter.value},
              onSelectionChanged: (s) {
                c.filter.value = s.first;
                c.load();
              },
            ))),
      ),
      Expanded(
        child: Obx(() => asyncBody(
              loading: c.loading.value,
              error: c.error.value,
              isEmpty: (c.data.value ?? []).isEmpty,
              emptyText: 'Tidak ada pesanan',
              emptyIcon: Icons.inbox_outlined,
              onRetry: c.load,
              builder: () => RefreshIndicator(
                onRefresh: c.load,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  itemCount: c.data.value!.length,
                  itemBuilder: (_, i) {
                    final o = c.data.value![i];
                    final tone = switch (o.s('status')) { 'processing' => Tone.sky, 'shipped' => Tone.lilac, 'delivered' => Tone.mint, 'cancelled' => Tone.rose, _ => Tone.butter };
                    final ink = toneOf(context, tone).ink;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SoftCard(
                        tone: tone,
                        variant: i,
                        radius: 26,
                        padding: const EdgeInsets.all(16),
                        onTap: () => Get.toNamed(AppRoutes.orderDetail, arguments: o['_id'].toString())?.then((_) => c.load(silent: true)),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            ToneIcon(Icons.receipt_long_rounded, tone: tone, size: 44),
                            const SizedBox(width: 12),
                            Expanded(child: Text(o.s('kode_pesanan'), style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15.5, color: ink))),
                            StatusChip(o.s('status')),
                          ]),
                          const SizedBox(height: 12),
                          Row(children: [
                            Icon(Icons.person_rounded, size: 16, color: ink),
                            const SizedBox(width: 6),
                            Expanded(child: Text(asMap(o['pasien_id']).s('nama'), style: TextStyle(color: ink, fontWeight: FontWeight.w600))),
                            Text(rupiah(o.n('total_harga')), style: TextStyle(color: ink, fontWeight: FontWeight.w800)),
                          ]),
                          const SizedBox(height: 4),
                          Text(fmtDateTime(o['createdAt']), style: TextStyle(color: ink.withValues(alpha: 0.75), fontSize: 12)),
                        ]),
                      ),
                    );
                  },
                ),
              ),
            )),
      ),
    ]);
  }
}

class StockController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  final query = ''.obs;
  final lowOnly = false.obs;

  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(await _api.get('/drugs', cache: true));

  List<Map<String, dynamic>> get filtered {
    final q = query.value.toLowerCase();
    final all = (data.value ?? []).where((d) => !lowOnly.value || d.n('stok') < 10).toList();
    return q.isEmpty ? all : all.where((d) => d.s('nama').toLowerCase().contains(q)).toList();
  }

  Future<void> edit(BuildContext context, [Map<String, dynamic>? drug]) async {
    final isNew = drug == null;
    final name = TextEditingController(text: drug?.s('nama'));
    final category = TextEditingController(text: drug?.s('kategori'));
    final unit = TextEditingController(text: drug?.s('satuan', 'strip'));
    final price = TextEditingController(text: drug == null ? '' : drug.n('harga').toInt().toString());
    final stock = TextEditingController(text: drug == null ? '' : drug.n('stok').toInt().toString());
    final code = TextEditingController(text: drug?.s('kode_obat'));
    final expiry = TextEditingController(text: drug == null ? '' : drug.s('tgl_kadaluarsa').split('T').first);
    var needsRx = drug?['butuh_resep'] == true;
    final ok = await Get.dialog<bool>(StatefulBuilder(
      builder: (ctx, setState) => AlertDialog(
        title: Text(isNew ? 'Obat baru' : 'Ubah obat'),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: name, decoration: InputDecoration(labelText: 'Nama'.tr)),
            TextField(controller: category, decoration: InputDecoration(labelText: 'Kategori'.tr)),
            TextField(controller: code, decoration: InputDecoration(labelText: 'Kode obat'.tr)),
            Row(children: [Expanded(child: TextField(controller: unit, decoration: InputDecoration(labelText: 'Satuan'.tr))), const SizedBox(width: 8), Expanded(child: TextField(controller: price, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Harga'.tr)))]),
            TextField(controller: stock, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Stok'.tr)),
            TextField(controller: expiry, readOnly: true, decoration: InputDecoration(labelText: 'Kedaluwarsa (YYYY-MM-DD)'.tr), onTap: () async {
              final d = await showDatePicker(context: ctx, initialDate: DateTime.now().add(const Duration(days: 365)), firstDate: DateTime.now(), lastDate: DateTime(2100));
              if (d != null) expiry.text = d.toIso8601String().split('T').first;
            }),
            SwitchListTile(contentPadding: EdgeInsets.zero, title: Text('Wajib resep'.tr), value: needsRx, onChanged: (v) => setState(() => needsRx = v)),
          ]),
        ),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Simpan'.tr))],
      ),
    ));
    if (ok != true) return;
    final body = {
      'nama': name.text.trim(),
      'kategori': category.text.trim(),
      'kode_obat': code.text.trim(),
      'satuan': unit.text.trim(),
      'harga': num.tryParse(price.text) ?? 0,
      'stok': num.tryParse(stock.text) ?? 0,
      'tgl_kadaluarsa': expiry.text,
      'butuh_resep': needsRx,
    };
    try {
      isNew ? await _api.post('/drugs', data: body) : await _api.put('/drugs/${drug['_id']}', data: body);
      showSuccess('Obat disimpan');
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }
}

class StockTab extends StatelessWidget {
  const StockTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(StockController());
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.edit(context), icon: const Icon(Icons.add), label: Text('Tambah obat'.tr)),
      body: Column(children: [
        Padding(padding: const EdgeInsets.fromLTRB(20, 8, 20, 6), child: TextField(onChanged: (v) => c.query.value = v, decoration: InputDecoration(hintText: 'Cari obat'.tr, prefixIcon: const Icon(Icons.search_rounded)))),
        Obx(() {
          final low = (c.data.value ?? []).where((d) => d.n('stok') < 10).length;
          if (low == 0) return const SizedBox.shrink();
          return Padding(
            padding: const EdgeInsets.fromLTRB(20, 2, 20, 8),
            child: SoftCard(
              tone: Tone.rose,
              blobs: false,
              radius: 20,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              onTap: () => c.lowOnly.toggle(),
              child: Row(children: [
                Icon(Icons.warning_amber_rounded, color: toneOf(context, Tone.rose).ink),
                const SizedBox(width: 10),
                Expanded(child: Text('$low ${'obat stok menipis'.tr}', style: TextStyle(fontWeight: FontWeight.w700, color: toneOf(context, Tone.rose).ink))),
                Text((c.lowOnly.value ? 'Semua' : 'Tampilkan').tr, style: TextStyle(fontWeight: FontWeight.w800, color: toneOf(context, Tone.rose).ink, fontSize: 12.5)),
              ]),
            ),
          );
        }),
        Expanded(
          child: Obx(() {
            c.query.value;
            c.lowOnly.value;
            final list = c.filtered;
            return asyncBody(
              loading: c.loading.value,
              error: c.error.value,
              isEmpty: list.isEmpty,
              emptyText: 'Tidak ada obat',
              onRetry: c.load,
              builder: () => RefreshIndicator(
                onRefresh: c.load,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
                  itemCount: list.length,
                  itemBuilder: (_, i) {
                    final d = list[i];
                    final low = d.n('stok') < 10;
                    final expired = (parseDate(d['tgl_kadaluarsa'])?.isBefore(DateTime.now()) ?? false);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SoftCard(
                        tone: low ? Tone.rose : Tone.mint,
                        variant: i,
                        radius: 26,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        onTap: () => c.edit(context, d),
                        child: Row(children: [
                          ToneIcon(Icons.medication_liquid_rounded, tone: low ? Tone.rose : Tone.mint, size: 46),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(d.s('nama'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                              const SizedBox(height: 2),
                              Text('${rupiah(d.n('harga'))} • ${'Kedaluwarsa'.tr} ${fmtDate(d['tgl_kadaluarsa'])}${expired ? ' ⚠' : ''}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            ]),
                          ),
                          Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [
                            Text('${d.n('stok').toInt()}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: low ? Colors.red : null)),
                            Text(d.s('satuan'), style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ]),
                        ]),
                      ),
                    );
                  },
                ),
              ),
            );
          }),
        ),
      ]),
    );
  }
}
