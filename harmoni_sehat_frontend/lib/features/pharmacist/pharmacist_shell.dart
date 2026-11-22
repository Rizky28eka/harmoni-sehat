import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
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
      appBar: AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell()]),
      body: IndexedStack(index: _index, children: const [_OrdersQueue(), StockTab(), ProfileTab()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.receipt_long_outlined), selectedIcon: const Icon(Icons.receipt_long), label: 'Pesanan'.tr),
          const NavigationDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: 'Stok'),
          NavigationDestination(icon: const Icon(Icons.person_outline), selectedIcon: const Icon(Icons.person), label: 'Profil'.tr),
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
        padding: const EdgeInsets.all(12),
        child: Obx(() => SegmentedButton<String>(
              segments: [ButtonSegment(value: 'processing', label: Text('Diproses'.tr)), ButtonSegment(value: 'shipped', label: Text('Dikirim'.tr)), ButtonSegment(value: 'delivered,cancelled', label: Text('Selesai'.tr))],
              selected: {c.filter.value},
              onSelectionChanged: (s) {
                c.filter.value = s.first;
                c.load();
              },
            )),
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
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                  itemCount: c.data.value!.length,
                  itemBuilder: (_, i) {
                    final o = c.data.value![i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ListTile(
                        title: Text(o.s('kode_pesanan'), style: const TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Text('${asMap(o['pasien_id']).s('nama')}\n${fmtDateTime(o['createdAt'])} • ${rupiah(o.n('total_harga'))}'),
                        isThreeLine: true,
                        trailing: StatusChip(o.s('status')),
                        onTap: () => Get.toNamed(AppRoutes.orderDetail, arguments: o['_id'].toString())?.then((_) => c.load(silent: true)),
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

  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(await _api.get('/drugs', cache: true));

  List<Map<String, dynamic>> get filtered {
    final q = query.value.toLowerCase();
    final all = data.value ?? [];
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
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.edit(context), icon: const Icon(Icons.add), label: Text('Obat'.tr)),
      body: Column(children: [
        Padding(padding: const EdgeInsets.fromLTRB(16, 12, 16, 4), child: TextField(onChanged: (v) => c.query.value = v, decoration: InputDecoration(hintText: 'Cari obat'.tr, prefixIcon: Icon(Icons.search)))),
        Expanded(
          child: Obx(() {
            c.query.value;
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
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 90),
                  itemCount: list.length,
                  itemBuilder: (_, i) {
                    final d = list[i];
                    final low = d.n('stok') < 10;
                    final expired = (parseDate(d['tgl_kadaluarsa'])?.isBefore(DateTime.now()) ?? false);
                    return Card(
                      child: ListTile(
                        title: Text(d.s('nama')),
                        subtitle: Text('${rupiah(d.n('harga'))} • ${'Kedaluwarsa'.tr} ${fmtDate(d['tgl_kadaluarsa'])}${expired ? ' ⚠' : ''}'),
                        trailing: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [Text('${d.n('stok').toInt()}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: low ? Colors.red : null)), Text(d.s('satuan'), style: const TextStyle(fontSize: 11, color: Colors.grey))]),
                        onTap: () => c.edit(context, d),
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
