import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
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
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 4),
        child: TextField(controller: c.search, onChanged: c.onSearch, decoration: InputDecoration(hintText: 'Cari obat'.tr, prefixIcon: const Icon(Icons.search_rounded))),
      ),
      SizedBox(
        height: 50,
        child: Obx(() => ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6), children: [
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
              emptyIcon: Icons.medication_rounded,
              onRetry: c.load,
              builder: () => RefreshIndicator(
                onRefresh: () async { await c.load(); await c.refreshCart(); },
                child: GridView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 6, 20, 100),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, mainAxisExtent: 224),
                  itemCount: c.drugs.length,
                  itemBuilder: (_, i) => _DrugTile(drug: c.drugs[i], c: c, index: i),
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
  const _DrugTile({required this.drug, required this.c, this.index = 0});
  final Map<String, dynamic> drug;
  final ShopController c;
  final int index;

  static const _tones = [Tone.mint, Tone.peach, Tone.sky, Tone.lilac, Tone.butter, Tone.rose];

  @override
  Widget build(BuildContext context) {
    final id = drug['_id'].toString();
    final tone = _tones[drug.s('kategori').codeUnits.fold<int>(0, (a, b) => a + b) % _tones.length];
    final ink = toneOf(context, tone).ink;
    return SoftCard(
      tone: tone,
      variant: index,
      radius: 26,
      padding: const EdgeInsets.all(14),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.medication_rounded, color: ink, size: 30),
          const Spacer(),
          if (drug['butuh_resep'] == true) Pill('Resep'.tr, tone: Tone.rose, dense: true),
        ]),
        const Spacer(),
        Text(drug.s('nama'), maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5, color: ink, height: 1.2)),
        const SizedBox(height: 2),
        Text('${drug.s('kategori')} • ${'per'.tr} ${drug.s('satuan')}', maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: ink.withValues(alpha: 0.75), fontSize: 11.5)),
        if (drug.n('stok') < 10) Text('${'Sisa'.tr} ${drug.n('stok').toInt()}', style: TextStyle(color: ink, fontSize: 11, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: Text(rupiah(drug.n('harga')), style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: ink))),
          Obx(() {
            c.cartQty.length; // subscribes this Obx: RxMap's [] operator alone does not
            final q = c.cartQty[id] ?? 0;
            if (q == 0) return IconButton.filled(visualDensity: VisualDensity.compact, style: IconButton.styleFrom(backgroundColor: ink, foregroundColor: Colors.white), onPressed: () => c.setQty(drug, 1), icon: const Icon(Icons.add_shopping_cart, size: 18));
            return Row(mainAxisSize: MainAxisSize.min, children: [
              GestureDetector(onTap: () => c.setQty(drug, q - 1), child: Icon(Icons.remove_circle_outline, color: ink)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 6), child: Text('$q', style: TextStyle(fontWeight: FontWeight.w800, color: ink))),
              GestureDetector(onTap: q >= drug.n('stok') ? null : () => c.setQty(drug, q + 1), child: Icon(Icons.add_circle_outline, color: ink)),
            ]);
          }),
        ]),
      ]),
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
              child: ListView(padding: const EdgeInsets.fromLTRB(20, 8, 20, 20), children: [
                if (resepId != null)
                  Padding(padding: const EdgeInsets.only(bottom: 12), child: SoftCard(tone: Tone.sky, blobs: false, radius: 22, padding: const EdgeInsets.all(14), child: Row(children: [Icon(Icons.verified_rounded, color: toneOf(context, Tone.sky).ink), const SizedBox(width: 12), Expanded(child: Text('Pesanan ini akan ditebus menggunakan resep dokter. Obat resep hanya dapat dibeli sesuai jumlah pada resep.'.tr, style: TextStyle(color: toneOf(context, Tone.sky).ink, height: 1.35)))]))),
                for (final i in items)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: SoftCard(
                      radius: 24,
                      padding: const EdgeInsets.all(12),
                      child: Row(children: [
                        const ToneIcon(Icons.medication_rounded, tone: Tone.peach, size: 48),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(asMap(i['obat']).s('nama'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5)),
                            const SizedBox(height: 2),
                            Text('${rupiah(asMap(i['obat']).n('harga'))} × ${i.n('jumlah').toInt()}${i['tersedia'] == false ? '\n⚠ ${'Stok tidak mencukupi'.tr}' : ''}', style: TextStyle(color: i['tersedia'] == false ? AppColors.errorColor : AppColors.textSecondary, fontSize: 12)),
                          ]),
                        ),
                        Row(mainAxisSize: MainAxisSize.min, children: [
                          IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: () => c.setQty(asMap(i['obat'])['_id'].toString(), i.n('jumlah').toInt() - 1)),
                          Text('${i.n('jumlah').toInt()}', style: const TextStyle(fontWeight: FontWeight.w800)),
                          IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () => c.setQty(asMap(i['obat'])['_id'].toString(), i.n('jumlah').toInt() + 1)),
                        ]),
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
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  border: Border(top: BorderSide(color: Theme.of(context).colorScheme.outline, width: 1)),
                ),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Row(children: [
                    Text('Total'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                    const Spacer(),
                    Text(rupiah(c.data.value?['total'] as num?), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppColors.primaryColor)),
                  ]),
                  const SizedBox(height: 12),
                  FilledButton(onPressed: c.placing.value || items.isEmpty ? null : c.checkout, style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)), child: c.placing.value ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : Text('Checkout'.tr)),
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
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final o = c.data.value![i];
                final tone = switch (o.s('status')) { 'processing' => Tone.sky, 'shipped' => Tone.lilac, 'delivered' => Tone.mint, 'cancelled' => Tone.rose, _ => Tone.butter };
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SoftCard(
                    tone: tone,
                    variant: i,
                    radius: 24,
                    padding: const EdgeInsets.all(16),
                    onTap: () => Get.toNamed(AppRoutes.orderDetail, arguments: o['_id'].toString())?.then((_) => c.load(silent: true)),
                    child: Row(children: [
                      ToneIcon(Icons.receipt_long_rounded, tone: tone, size: 46),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(o.s('kode_pesanan'), style: TextStyle(fontWeight: FontWeight.w800, color: toneOf(context, tone).ink)),
                          const SizedBox(height: 2),
                          Text('${fmtDate(o['createdAt'])} • ${rupiah(o.n('total_harga'))}', style: TextStyle(fontSize: 12.5, color: toneOf(context, tone).ink.withValues(alpha: 0.8))),
                        ]),
                      ),
                      StatusChip(o.s('status')),
                    ]),
                  ),
                );
              },
            ),
          ),
        ));
  }
}

/// Full-screen order history (opened from the profile).
class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('Pesanan obat'.tr)), body: const OrdersTab());
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
    final tone = switch (status) { 'processing' => Tone.sky, 'shipped' => Tone.lilac, 'delivered' => Tone.mint, 'cancelled' => Tone.rose, _ => Tone.butter };
    final ink = toneOf(context, tone).ink;
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    final reached = status == 'cancelled' ? -1 : steps.indexOf(status);
    const labels = ['Menunggu', 'Diproses', 'Dikirim', 'Diterima'];
    return ListView(padding: const EdgeInsets.fromLTRB(20, 4, 20, 28), children: [
      SoftCard(
        tone: tone,
        radius: 30,
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [Expanded(child: Text(o.s('kode_pesanan'), style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: ink, letterSpacing: -0.4))), StatusChip(status)]),
          const SizedBox(height: 4),
          Text(fmtDateTime(o['createdAt']), style: TextStyle(color: ink.withValues(alpha: 0.8), fontSize: 12.5)),
          if (status != 'cancelled') ...[
            const SizedBox(height: 18),
            Row(children: [
              for (var i = 0; i < steps.length; i++) ...[
                Column(children: [
                  Container(width: 26, height: 26, decoration: BoxDecoration(shape: BoxShape.circle, color: i <= reached ? ink : Colors.white.withValues(alpha: 0.6)), child: Icon(i <= reached ? Icons.check_rounded : Icons.circle, size: i <= reached ? 16 : 6, color: i <= reached ? Colors.white : ink.withValues(alpha: 0.4))),
                  const SizedBox(height: 4),
                  Text(labels[i].tr, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: i <= reached ? ink : ink.withValues(alpha: 0.5))),
                ]),
                if (i < steps.length - 1) Expanded(child: Container(height: 3, margin: const EdgeInsets.only(bottom: 18), decoration: BoxDecoration(color: i < reached ? ink : Colors.white.withValues(alpha: 0.6), borderRadius: BorderRadius.circular(3)))),
              ],
            ]),
          ],
        ]),
      ),
      const SizedBox(height: 14),
      SoftCard(
        radius: 26,
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          for (final d in asList(o['detail']))
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(children: [
                const ToneIcon(Icons.medication_rounded, tone: Tone.peach, size: 40),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(asMap(d['obat_id']).s('nama'), style: const TextStyle(fontWeight: FontWeight.w700)),
                    Text('${d.n('jumlah').toInt()} × ${rupiah(d.n('harga_satuan'))}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ]),
                ),
                Text(rupiah(d.n('subtotal')), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
              ]),
            ),
          const Divider(height: 24),
          Row(children: [Text('Total'.tr, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)), const Spacer(), Text(rupiah(o.n('total_harga')), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: AppColors.primaryColor))]),
        ]),
      ),
      const SizedBox(height: 14),
      SoftCard(
        radius: 26,
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const ToneIcon(Icons.location_on_rounded, tone: Tone.sky, size: 40),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(o.s('alamat_pengiriman'), style: const TextStyle(fontWeight: FontWeight.w600, height: 1.3)),
                const SizedBox(height: 2),
                Text(isPharmacist && pasien.isNotEmpty ? '${pasien.s('nama')} • ${pasien.s('no_telepon')}' : o.s('catatan_pengiriman'), style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary)),
              ]),
            ),
          ]),
          if (o.s('no_resi').isNotEmpty) ...[
            const Divider(height: 24),
            Row(children: [const ToneIcon(Icons.local_shipping_rounded, tone: Tone.lilac, size: 40), const SizedBox(width: 12), Expanded(child: Text('${'Resi'.tr}: ${o.s('no_resi')}', style: const TextStyle(fontWeight: FontWeight.w800)))]),
          ],
        ]),
      ),
      const SizedBox(height: 18),
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
