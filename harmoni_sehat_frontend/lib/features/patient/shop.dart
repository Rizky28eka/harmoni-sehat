import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/ui.dart';

class ShopController extends GetxController {
  final _api = Get.find<ApiClient>();
  final drugs = <Map<String, dynamic>>[].obs;
  final categories = <String>[].obs;
  final category = RxnString();
  final loading = true.obs;
  final error = RxnString();
  final cartCount = 0.obs;
  final cartQty = <String, int>{}.obs;
  final search = TextEditingController();
  Timer? _debounce;

  @override
  void onInit() {
    super.onInit();
    load();
    refreshCart();
  }

  void onSearch(String _) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), load);
  }

  Future<void> load() async {
    loading.value = true;
    error.value = null;
    try {
      final r = asMap(await _api.get('/shop/drugs', query: {'limit': 50, if (search.text.trim().isNotEmpty) 'search': search.text.trim(), if (category.value != null) 'kategori': category.value}, cache: true));
      drugs.assignAll(asList(r['data']));
      categories.assignAll((r['kategori'] as List? ?? []).map((e) => e.toString()));
    } catch (e) {
      error.value = e is ApiException ? e.message : 'Gagal memuat obat';
    } finally {
      loading.value = false;
    }
  }

  Future<void> refreshCart() async {
    try {
      final cart = asMap(await _api.get('/shop/cart'));
      final items = asList(cart['items']);
      cartQty.assignAll({for (final i in items) asMap(i['obat'])['_id'].toString(): (i['jumlah'] as num).toInt()});
      cartCount.value = items.fold<int>(0, (s, i) => s + (i['jumlah'] as num).toInt());
    } catch (_) {}
  }

  Future<void> setQty(Map<String, dynamic> drug, int qty) async {
    try {
      await _api.put('/shop/cart/items', data: {'obat_id': drug['_id'], 'jumlah': qty});
      await refreshCart();
    } catch (e) {
      showError(e);
    }
  }

  @override
  void onClose() {
    _debounce?.cancel();
    search.dispose();
    super.onClose();
  }
}

class ShopView extends StatelessWidget {
  const ShopView({super.key, this.embedded = false});
  final bool embedded;

  @override
  Widget build(BuildContext context) {
    final c = Get.isRegistered<ShopController>() ? Get.find<ShopController>() : Get.put(ShopController());
    final body = Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
        child: TextField(controller: c.search, onChanged: c.onSearch, decoration: InputDecoration(hintText: 'Cari obat'.tr, prefixIcon: Icon(Icons.search))),
      ),
      SizedBox(
        height: 52,
        child: Obx(() => ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), children: [
              Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: Text('Semua'.tr), selected: c.category.value == null, onSelected: (_) { c.category.value = null; c.load(); })),
              for (final k in c.categories) Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: Text(k), selected: c.category.value == k, onSelected: (_) { c.category.value = k; c.load(); })),
            ])),
      ),
      Expanded(
        child: Obx(() => asyncBody(
              loading: c.loading.value,
              error: c.error.value,
              isEmpty: c.drugs.isEmpty,
              emptyText: 'Obat tidak ditemukan',
              emptyIcon: Icons.medication_outlined,
              onRetry: c.load,
              builder: () => RefreshIndicator(
                onRefresh: () async { await c.load(); await c.refreshCart(); },
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 90),
                  itemCount: c.drugs.length,
                  itemBuilder: (_, i) => _DrugTile(drug: c.drugs[i], c: c),
                ),
              ),
            )),
      ),
    ]);
    final fab = Obx(() => c.cartCount.value == 0
        ? const SizedBox.shrink()
        : FloatingActionButton.extended(
            onPressed: () => Get.toNamed(AppRoutes.cart)?.then((_) { c.refreshCart(); c.load(); }),
            icon: Badge(label: Text('${c.cartCount.value}'), child: const Icon(Icons.shopping_cart_outlined)),
            label: Text('Keranjang'.tr),
          ));
    if (embedded) return Stack(children: [body, Positioned(right: 16, bottom: 16, child: fab)]);
    return Scaffold(appBar: AppBar(title: Text('Apotek'.tr)), body: body, floatingActionButton: fab);
  }
}

class _DrugTile extends StatelessWidget {
  const _DrugTile({required this.drug, required this.c});
  final Map<String, dynamic> drug;
  final ShopController c;

  @override
  Widget build(BuildContext context) {
    final id = drug['_id'].toString();
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.medication, color: AppColors.primaryColor, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(drug.s('nama'), style: const TextStyle(fontWeight: FontWeight.w600)),
              Text('${drug.s('kategori')} • ${'per'.tr} ${drug.s('satuan')}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              const SizedBox(height: 4),
              Row(children: [
                Text(rupiah(drug.n('harga')), style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primaryColor)),
                if (drug['butuh_resep'] == true) ...[const SizedBox(width: 8), Chip(label: Text('Resep'.tr, style: const TextStyle(fontSize: 10)), visualDensity: VisualDensity.compact, padding: EdgeInsets.zero)],
              ]),
              if (drug.n('stok') < 10) Text('${'Sisa'.tr} ${drug.n('stok').toInt()}', style: const TextStyle(color: Colors.orange, fontSize: 11)),
            ]),
          ),
          Obx(() {
            c.cartQty.length; // subscribes this Obx: RxMap's [] operator alone does not
            final q = c.cartQty[id] ?? 0;
            if (q == 0) return IconButton.filledTonal(onPressed: () => c.setQty(drug, 1), icon: const Icon(Icons.add_shopping_cart));
            return Row(mainAxisSize: MainAxisSize.min, children: [
              IconButton(onPressed: () => c.setQty(drug, q - 1), icon: const Icon(Icons.remove_circle_outline)),
              Text('$q', style: const TextStyle(fontWeight: FontWeight.bold)),
              IconButton(onPressed: q >= drug.n('stok') ? null : () => c.setQty(drug, q + 1), icon: const Icon(Icons.add_circle_outline)),
            ]);
          }),
        ]),
      ),
    );
  }
}

class CartController extends LoadController<Map<String, dynamic>> {
  CartController(this.resepId);
  final String? resepId;
  final _api = Get.find<ApiClient>();
  final address = TextEditingController();
  final note = TextEditingController();
  final placing = false.obs;

  @override
  void onInit() {
    super.onInit();
    address.text = Get.find<SessionService>().profile.value?['alamat']?.toString() ?? '';
  }

  @override
  Future<Map<String, dynamic>> fetch() async => asMap(await _api.get('/shop/cart'));

  Future<void> setQty(String drugId, int qty) async {
    try {
      await _api.put('/shop/cart/items', data: {'obat_id': drugId, 'jumlah': qty});
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }

  Future<void> checkout() async {
    if (address.text.trim().length < 5) return showError('Isi alamat pengiriman');
    placing.value = true;
    try {
      final body = {'alamat_pengiriman': address.text.trim(), if (note.text.trim().isNotEmpty) 'catatan_pengiriman': note.text.trim(), if (resepId != null) 'resep_id': resepId};
      final r = asMap(await _api.post('/shop/checkout', data: body));
      Get.offNamed(AppRoutes.payment, arguments: {'order_id': asMap(r['transaction'])['order_id'], 'next': 'order', 'next_id': asMap(r['order'])['_id'].toString()});
    } catch (e) {
      showError(e);
    } finally {
      placing.value = false;
    }
  }

  @override
  void onClose() {
    address.dispose();
    note.dispose();
    super.onClose();
  }
}

class CartView extends StatelessWidget {
  const CartView({super.key});

  @override
  Widget build(BuildContext context) {
    final args = asMap(Get.arguments);
    final resepId = args['resep_id']?.toString();
    final c = Get.put(CartController(resepId));
    return Scaffold(
      appBar: AppBar(title: Text('Keranjang'.tr)),
      body: Obx(() {
        final items = asList(c.data.value?['items']);
        return asyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: items.isEmpty && resepId == null,
          emptyText: 'Keranjang kosong',
          emptyIcon: Icons.shopping_cart_outlined,
          onRetry: c.load,
          builder: () => Column(children: [
            Expanded(
              child: ListView(padding: const EdgeInsets.all(16), children: [
                if (resepId != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.blue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                    child: Text('Pesanan ini akan ditebus menggunakan resep dokter. Obat resep hanya dapat dibeli sesuai jumlah pada resep.'.tr),
                  ),
                for (final i in items)
                  Card(
                    child: ListTile(
                      title: Text(asMap(i['obat']).s('nama')),
                      subtitle: Text('${rupiah(asMap(i['obat']).n('harga'))} × ${i.n('jumlah').toInt()}${i['tersedia'] == false ? '\n⚠ ${'Stok tidak mencukupi'.tr}' : ''}'),
                      trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                        IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: () => c.setQty(asMap(i['obat'])['_id'].toString(), i.n('jumlah').toInt() - 1)),
                        Text('${i.n('jumlah').toInt()}'),
                        IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () => c.setQty(asMap(i['obat'])['_id'].toString(), i.n('jumlah').toInt() + 1)),
                      ]),
                    ),
                  ),
                const SizedBox(height: 12),
                TextField(controller: c.address, maxLines: 2, decoration: InputDecoration(labelText: 'Alamat pengiriman'.tr)),
                const SizedBox(height: 12),
                TextField(controller: c.note, decoration: InputDecoration(labelText: 'Catatan untuk kurir (opsional)'.tr)),
              ]),
            ),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Row(children: [Text('Total'.tr), const Spacer(), Text(rupiah(c.data.value?['total'] as num?), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18))]),
                  const SizedBox(height: 12),
                  FilledButton(onPressed: c.placing.value || items.isEmpty ? null : c.checkout, style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)), child: c.placing.value ? const CircularProgressIndicator() : Text('Checkout'.tr)),
                ]),
              ),
            ),
          ]),
        );
      }),
    );
  }
}

class OrdersController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(asMap(await _api.get('/shop/orders', query: {'limit': 50}, cache: true))['data']);
}

class OrdersTab extends StatelessWidget {
  const OrdersTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(OrdersController());
    return Obx(() => asyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: (c.data.value ?? []).isEmpty,
          emptyText: 'Belum ada pesanan',
          emptyIcon: Icons.receipt_long_outlined,
          onRetry: c.load,
          builder: () => RefreshIndicator(
            onRefresh: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final o = c.data.value![i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ListTile(
                    title: Text(o.s('kode_pesanan'), style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text('${fmtDate(o['createdAt'])} • ${rupiah(o.n('total_harga'))}'),
                    trailing: StatusChip(o.s('status')),
                    onTap: () => Get.toNamed(AppRoutes.orderDetail, arguments: o['_id'].toString())?.then((_) => c.load(silent: true)),
                  ),
                );
              },
            ),
          ),
        ));
  }
}

class OrderDetailController extends LoadController<Map<String, dynamic>> {
  OrderDetailController(this.id);
  final String id;
  final _api = Get.find<ApiClient>();
  final busy = false.obs;

  @override
  Future<Map<String, dynamic>> fetch() async => asMap(await _api.get('/shop/orders/$id'));

  Future<void> act(String action, {Map<String, dynamic>? body, String? successMsg}) async {
    busy.value = true;
    try {
      await _api.post('/shop/orders/$id/$action', data: body ?? {});
      if (successMsg != null) showSuccess(successMsg);
      await load(silent: true);
    } catch (e) {
      showError(e);
    } finally {
      busy.value = false;
    }
  }

  Future<void> ship() async {
    final resi = TextEditingController();
    final ok = await Get.dialog<bool>(AlertDialog(
      title: Text('Kirim pesanan'.tr),
      content: TextField(controller: resi, decoration: InputDecoration(labelText: 'Nomor resi (opsional)'.tr)),
      actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Kirim'.tr))],
    ));
    if (ok == true) await act('advance', body: {if (resi.text.trim().isNotEmpty) 'no_resi': resi.text.trim()}, successMsg: 'Pesanan dikirim');
  }
}

class OrderDetailView extends StatelessWidget {
  const OrderDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final id = Get.arguments as String;
    final c = Get.put(OrderDetailController(id), tag: id);
    final role = Get.find<SessionService>().role;
    return Scaffold(
      appBar: AppBar(title: Text('Detail Pesanan'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            builder: () => RefreshIndicator(onRefresh: c.load, child: _body(context, c, role ?? '')),
          )),
    );
  }

  Widget _body(BuildContext context, OrderDetailController c, String role) {
    final o = c.data.value!;
    final status = o.s('status');
    final paid = o.s('payment_status') == 'paid';
    final tx = asMap(o['transaksi']);
    final pasien = asMap(o['pasien_id']);
    final isPharmacist = role == 'farmasi';
    return ListView(padding: const EdgeInsets.all(16), children: [
      Row(children: [Expanded(child: Text(o.s('kode_pesanan'), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold))), StatusChip(status)]),
      const SizedBox(height: 4),
      Text(fmtDateTime(o['createdAt']), style: const TextStyle(color: Colors.grey)),
      const Divider(height: 24),
      for (final d in asList(o['detail']))
        ListTile(contentPadding: EdgeInsets.zero, title: Text(asMap(d['obat_id']).s('nama')), subtitle: Text('${d.n('jumlah').toInt()} × ${rupiah(d.n('harga_satuan'))}'), trailing: Text(rupiah(d.n('subtotal')))),
      const Divider(),
      Row(children: [Text('Total'.tr, style: TextStyle(fontWeight: FontWeight.bold)), const Spacer(), Text(rupiah(o.n('total_harga')), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18))]),
      const SizedBox(height: 16),
      ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.location_on_outlined), title: Text(o.s('alamat_pengiriman')), subtitle: Text(isPharmacist && pasien.isNotEmpty ? '${pasien.s('nama')} • ${pasien.s('no_telepon')}' : o.s('catatan_pengiriman'))),
      if (o.s('no_resi').isNotEmpty) ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.local_shipping_outlined), title: Text('${'Resi'.tr}: ${o.s('no_resi')}')),
      const SizedBox(height: 16),
      if (!paid && status == 'pending' && tx['status'] == 'pending' && !isPharmacist)
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.payment, arguments: {'order_id': tx['order_id'], 'next': 'order', 'next_id': c.id}), icon: const Icon(Icons.payment), label: Text('Bayar sekarang'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (isPharmacist && status == 'processing') FilledButton.icon(onPressed: c.busy.value ? null : c.ship, icon: const Icon(Icons.local_shipping), label: Text('Kirim pesanan'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (isPharmacist && status == 'shipped') Text('Menunggu pasien mengonfirmasi penerimaan.'.tr, textAlign: TextAlign.center),
      if (!isPharmacist && status == 'shipped') FilledButton.icon(onPressed: c.busy.value ? null : () => c.act('advance', successMsg: 'Pesanan diterima'), icon: const Icon(Icons.check_circle_outline), label: Text('Pesanan diterima'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50), backgroundColor: Colors.green)),
      if ((status == 'pending' && !isPharmacist) || (isPharmacist && (status == 'processing' || status == 'pending')))
        TextButton.icon(
          onPressed: c.busy.value ? null : () async { if (await confirm('Batalkan pesanan', 'Stok akan dikembalikan.', ok: 'Batalkan')) c.act('cancel', body: {'reason': isPharmacist ? 'Dibatalkan apotek' : 'Dibatalkan pasien'}, successMsg: 'Pesanan dibatalkan'); },
          icon: const Icon(Icons.cancel_outlined, color: Colors.red),
          label: Text('Batalkan pesanan'.tr, style: TextStyle(color: Colors.red)),
        ),
    ]);
  }
}
