import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/routes/app_routes.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/ui.dart';

class ConsultationListController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  final filter = 'all'.obs;

  @override
  Future<List<Map<String, dynamic>>> fetch() async {
    final status = switch (filter.value) { 'upcoming' => 'pending,scheduled,ongoing', 'done' => 'completed,cancelled', _ => null };
    final r = asMap(await _api.get('/booking/consultations', query: {'limit': 50, if (status != null) 'status': status}, cache: true));
    return asList(r['data']);
  }
}

/// Consultation list — used as a tab by both patients and doctors.
class ConsultationsTab extends StatelessWidget {
  const ConsultationsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(ConsultationListController());
    final isDoctor = Get.find<SessionService>().role == 'dokter';
    return Column(children: [
      Padding(
        padding: const EdgeInsets.all(12),
        child: Obx(() => SegmentedButton<String>(
              segments: const [ButtonSegment(value: 'all', label: Text('Semua')), ButtonSegment(value: 'upcoming', label: Text('Aktif')), ButtonSegment(value: 'done', label: Text('Selesai'))],
              selected: {c.filter.value},
              onSelectionChanged: (s) {
                c.filter.value = s.first;
                c.load();
              },
            )),
      ),
      Expanded(
        child: Obx(() => AsyncBody(
              loading: c.loading.value,
              error: c.error.value,
              isEmpty: (c.data.value ?? []).isEmpty,
              emptyText: 'Belum ada konsultasi',
              emptyIcon: Icons.event_busy_outlined,
              onRetry: c.load,
              child: RefreshIndicator(
                onRefresh: c.load,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                  itemCount: c.data.value!.length,
                  itemBuilder: (_, i) {
                    final x = c.data.value![i];
                    final other = asMap(isDoctor ? x['pasien_id'] : x['dokter_id']);
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ListTile(
                        leading: Avatar(name: other.s('nama'), url: other['foto']?.toString()),
                        title: Text(other.s('nama', 'Pengguna'), style: const TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Text('${fmtDateTime(x['tanggal'])}\n${x.s('keluhan')}', maxLines: 2, overflow: TextOverflow.ellipsis),
                        isThreeLine: true,
                        trailing: StatusChip(x.s('status')),
                        onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString())?.then((_) => c.load(silent: true)),
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

class ConsultationDetailController extends LoadController<Map<String, dynamic>> {
  ConsultationDetailController(this.id);
  final String id;
  final _api = Get.find<ApiClient>();
  final busy = false.obs;

  @override
  Future<Map<String, dynamic>> fetch() async => asMap(await _api.get('/booking/consultations/$id'));

  Future<void> _run(Future<void> Function() fn) async {
    busy.value = true;
    try {
      await fn();
      await load(silent: true);
    } catch (e) {
      showError(e);
    } finally {
      busy.value = false;
    }
  }

  Future<void> cancel() async {
    if (!await confirm('Batalkan konsultasi', 'Pembatalan konsultasi berbayar hanya dapat dilakukan lebih dari 2 jam sebelum jadwal.', ok: 'Batalkan')) return;
    await _run(() async {
      await _api.post('/booking/consultations/$id/cancel', data: {});
      showSuccess('Konsultasi dibatalkan');
    });
  }

  Future<void> start() => _run(() async => _api.post('/booking/consultations/$id/start'));

  Future<void> review() async {
    var rating = 5;
    final comment = TextEditingController();
    final ok = await Get.dialog<bool>(StatefulBuilder(
      builder: (_, setState) => AlertDialog(
        title: const Text('Beri ulasan'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            for (var i = 1; i <= 5; i++) IconButton(onPressed: () => setState(() => rating = i), icon: Icon(i <= rating ? Icons.star : Icons.star_border, color: Colors.amber, size: 32)),
          ]),
          TextField(controller: comment, maxLines: 3, decoration: const InputDecoration(labelText: 'Komentar (opsional)')),
        ]),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(onPressed: () => Get.back(result: true), child: const Text('Kirim'))],
      ),
    ));
    if (ok != true) return;
    await _run(() async {
      await _api.post('/booking/consultations/$id/review', data: {'rating': rating, if (comment.text.trim().isNotEmpty) 'komentar': comment.text.trim()});
      showSuccess('Terima kasih atas ulasan Anda');
    });
  }
}

class ConsultationDetailView extends StatelessWidget {
  const ConsultationDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    final id = Get.arguments as String;
    final c = Get.put(ConsultationDetailController(id), tag: id);
    final role = Get.find<SessionService>().role;
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Konsultasi')),
      body: Obx(() => AsyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            child: RefreshIndicator(onRefresh: c.load, child: _body(context, c, role ?? '')),
          )),
    );
  }

  Widget _body(BuildContext context, ConsultationDetailController c, String role) {
    final x = c.data.value!;
    final isDoctor = role == 'dokter';
    final other = asMap(isDoctor ? x['pasien_id'] : x['dokter_id']);
    final status = x.s('status');
    final tx = asMap(x['transaksi']);
    final resep = x['resep'] is Map ? asMap(x['resep']) : null;
    final chatActive = status == 'scheduled' || status == 'ongoing';
    final chatArgs = {'id': x['_id'].toString(), 'title': other.s('nama', 'Konsultasi'), 'video': x['video_call_url']};

    return ListView(padding: const EdgeInsets.all(16), children: [
      Row(children: [
        Avatar(name: other.s('nama'), url: other['foto']?.toString(), radius: 28),
        const SizedBox(width: 12),
        Expanded(child: Text(other.s('nama'), style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold))),
        StatusChip(status),
      ]),
      const SizedBox(height: 16),
      _row(Icons.event, 'Jadwal', '${fmtDateTime(x['tanggal'])} WIB'),
      _row(Icons.sick_outlined, 'Keluhan', x.s('keluhan')),
      if (x.n('biaya') > 0) _row(Icons.payments_outlined, 'Biaya', rupiah(x.n('biaya'))),
      if (tx.isNotEmpty) _row(Icons.receipt_long_outlined, 'Pembayaran', tx.s('status')),
      if (x.s('cancel_reason').isNotEmpty) _row(Icons.info_outline, 'Alasan batal', x.s('cancel_reason')),
      if (x.s('diagnosa').isNotEmpty) _row(Icons.medical_information_outlined, 'Diagnosa', x.s('diagnosa')),
      if (x.s('catatan_dokter').isNotEmpty) _row(Icons.notes, 'Catatan dokter', x.s('catatan_dokter')),
      const SizedBox(height: 16),
      if (status == 'pending' && !isDoctor && tx['status'] == 'pending')
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.payment, arguments: {'order_id': tx['order_id'], 'next': 'consultation', 'next_id': c.id}), icon: const Icon(Icons.payment), label: const Text('Bayar sekarang'), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (chatActive) ...[
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.chat, arguments: chatArgs), icon: const Icon(Icons.chat_bubble_outline), label: const Text('Buka obrolan'), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 8),
        if (x['video_call_url'] != null)
          OutlinedButton.icon(onPressed: () => launchUrl(Uri.parse(x['video_call_url'].toString()), mode: LaunchMode.externalApplication), icon: const Icon(Icons.videocam_outlined), label: const Text('Video call'), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 8),
      ],
      if (isDoctor && status == 'scheduled') ...[
        OutlinedButton.icon(onPressed: c.busy.value ? null : c.start, icon: const Icon(Icons.play_arrow), label: const Text('Mulai konsultasi'), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 8),
      ],
      if (isDoctor && (status == 'scheduled' || status == 'ongoing'))
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.completeConsultation, arguments: c.id)?.then((_) => c.load(silent: true)), icon: const Icon(Icons.task_alt), label: const Text('Selesaikan & tulis resep'), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50), backgroundColor: Colors.green)),
      if (status == 'pending' || status == 'scheduled')
        TextButton.icon(onPressed: c.busy.value ? null : c.cancel, icon: const Icon(Icons.cancel_outlined, color: Colors.red), label: const Text('Batalkan', style: TextStyle(color: Colors.red))),
      if (status == 'completed' && !isDoctor) ...[
        OutlinedButton.icon(onPressed: c.review, icon: const Icon(Icons.star_outline), label: const Text('Beri ulasan'), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      ],
      if (status == 'completed' || (x['status'] == 'cancelled' && false))
        OutlinedButton.icon(onPressed: () => Get.toNamed(AppRoutes.chat, arguments: chatArgs), icon: const Icon(Icons.history), label: const Text('Lihat riwayat obrolan'), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (resep != null) ...[
        const SizedBox(height: 16),
        Text('Resep dokter', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
        for (final o in asList(resep['obat']))
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.medication_outlined),
            title: Text(asMap(o['obat_id']).s('nama', 'Obat')),
            subtitle: Text('${o.s('dosis')} • ${o.n('jumlah').toInt()} unit • ${o.s('aturan_pakai')}'),
          ),
        if (!isDoctor)
          FilledButton.icon(
            onPressed: () => Get.toNamed(AppRoutes.cart, arguments: {'resep_id': resep['_id']}),
            icon: const Icon(Icons.local_pharmacy_outlined),
            label: const Text('Tebus resep di apotek'),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50)),
          ),
      ],
    ]);
  }

  Widget _row(IconData icon, String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, size: 20, color: Colors.grey),
          const SizedBox(width: 12),
          SizedBox(width: 96, child: Text(label, style: const TextStyle(color: Colors.grey))),
          Expanded(child: Text(value)),
        ]),
      );
}

/// Shows payment status and drives the (sandbox or real) payment, then continues to [next].
class PaymentController extends GetxController {
  PaymentController(this.args);
  final Map<String, dynamic> args;
  final _api = Get.find<ApiClient>();
  final tx = Rxn<Map<String, dynamic>>();
  final loading = true.obs;
  final busy = false.obs;
  Timer? _poll;

  String get orderId => args['order_id'].toString();

  @override
  void onInit() {
    super.onInit();
    refreshStatus();
    _poll = Timer.periodic(const Duration(seconds: 4), (_) => refreshStatus());
  }

  Future<void> refreshStatus() async {
    try {
      final raw = await _api.get('/payments/$orderId');
      tx.value = asMap(raw);
      loading.value = false;
      if (tx.value!['status'] != 'pending') {
        _poll?.cancel();
        _finish();
      }
    } catch (e) {
      loading.value = false;
    }
  }

  Future<void> simulate(bool success) async {
    busy.value = true;
    try {
      await _api.post('/payments/$orderId/simulate', data: {'outcome': success ? 'success' : 'failed'});
      await refreshStatus();
    } catch (e) {
      showError(e);
    } finally {
      busy.value = false;
    }
  }

  Future<void> openGateway() async {
    final url = tx.value?['payment_url']?.toString();
    if (url != null) await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  void _finish() {
    final status = tx.value?['status'];
    if (status == 'completed') {
      showSuccess('Pembayaran berhasil');
    } else {
      showError('Pembayaran $status');
    }
    final next = args['next'];
    final id = args['next_id']?.toString();
    if (next == 'consultation' && id != null) {
      Get.offNamed(AppRoutes.consultation, arguments: id);
    } else if (next == 'order' && id != null) {
      Get.offNamed(AppRoutes.orderDetail, arguments: id);
    } else {
      Get.back();
    }
  }

  @override
  void onClose() {
    _poll?.cancel();
    super.onClose();
  }
}

class PaymentView extends StatelessWidget {
  const PaymentView({super.key});

  @override
  Widget build(BuildContext context) {
    final args = asMap(Get.arguments);
    final c = Get.put(PaymentController(args));
    return Scaffold(
      appBar: AppBar(title: const Text('Pembayaran')),
      body: Obx(() {
        if (c.loading.value) return const Center(child: CircularProgressIndicator());
        final t = c.tx.value;
        if (t == null) return const Center(child: Text('Transaksi tidak ditemukan'));
        final isMock = (t['payment_url']?.toString() ?? '').contains('/simulate');
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const SizedBox(height: 16),
            const Icon(Icons.account_balance_wallet_outlined, size: 64),
            const SizedBox(height: 16),
            Text(rupiah(t.n('total_biaya')), textAlign: TextAlign.center, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
            Text('No. ${t.s('order_id')}', textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 8),
            Center(child: StatusChip(t.s('status'))),
            const SizedBox(height: 32),
            if (isMock) ...[
              const Text('Mode sandbox: belum ada gateway pembayaran yang terhubung. Simulasikan hasil pembayaran:', textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton(onPressed: c.busy.value ? null : () => c.simulate(true), child: const Text('Simulasikan pembayaran berhasil')),
              const SizedBox(height: 8),
              OutlinedButton(onPressed: c.busy.value ? null : () => c.simulate(false), child: const Text('Simulasikan gagal')),
            ] else ...[
              FilledButton.icon(onPressed: c.openGateway, icon: const Icon(Icons.open_in_new), label: const Text('Buka halaman pembayaran'), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52))),
              const SizedBox(height: 12),
              const Text('Setelah membayar, kembali ke aplikasi. Status akan diperbarui otomatis.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
            ],
          ]),
        );
      }),
    );
  }
}
