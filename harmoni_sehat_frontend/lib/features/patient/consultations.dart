import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
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

Tone _toneForStatus(String s) => switch (s) {
      'scheduled' => Tone.sky,
      'ongoing' => Tone.mint,
      'completed' => Tone.slate,
      'pending' => Tone.butter,
      'cancelled' => Tone.rose,
      _ => Tone.slate,
    };

/// Consultation list — used as a tab by both patients and doctors.
class ConsultationsTab extends StatelessWidget {
  const ConsultationsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(ConsultationListController());
    final isDoctor = Get.find<SessionService>().role == 'dokter';
    return Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 10),
        child: Obx(() => SizedBox(width: double.infinity, child: SegmentedButton<String>(
              showSelectedIcon: false,
              segments: [ButtonSegment(value: 'all', label: Text('Semua'.tr)), ButtonSegment(value: 'upcoming', label: Text('Aktif'.tr)), ButtonSegment(value: 'done', label: Text('Selesai'.tr))],
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
              emptyText: 'Belum ada konsultasi',
              emptyIcon: Icons.event_busy_rounded,
              onRetry: c.load,
              builder: () => RefreshIndicator(
                onRefresh: c.load,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
                  itemCount: c.data.value!.length,
                  itemBuilder: (_, i) {
                    final x = c.data.value![i];
                    final other = asMap(isDoctor ? x['pasien_id'] : x['dokter_id']);
                    final tone = _toneForStatus(x.s('status'));
                    final ink = toneOf(context, tone).ink;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SoftCard(
                        tone: tone,
                        variant: i,
                        radius: 26,
                        padding: const EdgeInsets.all(16),
                        onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString())?.then((_) => c.load(silent: true)),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Avatar(name: other.s('nama'), url: other['foto']?.toString(), radius: 24),
                            const SizedBox(width: 12),
                            Expanded(child: Text(other.s('nama', 'Pengguna'), maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: ink, letterSpacing: -0.3))),
                            StatusChip(x.s('status')),
                          ]),
                          const SizedBox(height: 12),
                          Row(children: [
                            Icon(Icons.schedule_rounded, size: 16, color: ink),
                            const SizedBox(width: 6),
                            Expanded(child: Text(fmtDateTime(x['tanggal']), style: TextStyle(color: ink, fontWeight: FontWeight.w700, fontSize: 13))),
                          ]),
                          const SizedBox(height: 6),
                          Text(x.s('keluhan'), maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(color: ink.withValues(alpha: 0.8), height: 1.3)),
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
        title: Text('Beri ulasan'.tr),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            for (var i = 1; i <= 5; i++) IconButton(onPressed: () => setState(() => rating = i), icon: Icon(i <= rating ? Icons.star : Icons.star_border, color: Colors.amber, size: 32)),
          ]),
          TextField(controller: comment, maxLines: 3, decoration: InputDecoration(labelText: 'Komentar (opsional)'.tr)),
        ]),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Kirim'.tr))],
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
      appBar: AppBar(title: Text('Detail Konsultasi'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            builder: () => RefreshIndicator(onRefresh: c.load, child: _body(context, c, role ?? '')),
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
    final chatArgs = {'id': x['_id'].toString(), 'title': other.s('nama', 'Konsultasi'), 'canCall': chatActive};

    final tone = _toneForStatus(status);
    final ink = toneOf(context, tone).ink;
    return ListView(padding: const EdgeInsets.fromLTRB(20, 4, 20, 28), children: [
      SoftCard(
        tone: tone,
        radius: 32,
        padding: const EdgeInsets.all(22),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [Expanded(child: Text(isDoctor ? 'Pasien'.tr : 'Dokter'.tr, style: TextStyle(color: ink.withValues(alpha: 0.75), fontWeight: FontWeight.w600))), StatusChip(status)]),
          const SizedBox(height: 14),
          Row(children: [
            Avatar(name: other.s('nama'), url: other['foto']?.toString(), radius: 34),
            const SizedBox(width: 14),
            Expanded(child: Text(other.s('nama'), style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: ink, letterSpacing: -0.4))),
          ]),
          const SizedBox(height: 18),
          Row(children: [Icon(Icons.event_rounded, size: 18, color: ink), const SizedBox(width: 8), Expanded(child: Text('${fmtDateTime(x['tanggal'])} WIB', style: TextStyle(color: ink, fontWeight: FontWeight.w700)))]),
        ]),
      ),
      if (status == 'pending' && x['expires_at'] != null && !isDoctor)
        Padding(
          padding: const EdgeInsets.only(top: 12),
          child: SoftCard(tone: Tone.butter, blobs: false, radius: 20, padding: const EdgeInsets.all(14), child: Row(children: [Icon(Icons.timer_rounded, color: toneOf(context, Tone.butter).ink), const SizedBox(width: 10), Expanded(child: Text('${'Selesaikan pembayaran sebelum'.tr} ${fmtTime(x['expires_at'])}', style: TextStyle(fontWeight: FontWeight.w700, color: toneOf(context, Tone.butter).ink)))])),
        ),
      const SizedBox(height: 14),
      SoftCard(
        radius: 24,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Column(children: [
          _row(context, Icons.sick_rounded, Tone.rose, 'Keluhan', x.s('keluhan')),
          if (x.n('biaya') > 0) _row(context, Icons.payments_rounded, Tone.mint, 'Biaya', rupiah(x.n('biaya'))),
          if (tx.isNotEmpty) _row(context, Icons.receipt_long_rounded, Tone.sky, 'Pembayaran', tx.s('status').tr),
          if (x.s('cancel_reason').isNotEmpty) _row(context, Icons.info_rounded, Tone.butter, 'Alasan batal', x.s('cancel_reason')),
          if (x.s('diagnosa').isNotEmpty) _row(context, Icons.medical_information_rounded, Tone.lilac, 'Diagnosa', x.s('diagnosa')),
          if (x.s('catatan_dokter').isNotEmpty) _row(context, Icons.notes_rounded, Tone.slate, 'Catatan dokter', x.s('catatan_dokter')),
        ]),
      ),
      const SizedBox(height: 18),
      if (status == 'pending' && !isDoctor && tx['status'] == 'pending')
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.payment, arguments: {'order_id': tx['order_id'], 'next': 'consultation', 'next_id': c.id}), icon: const Icon(Icons.payment), label: Text('Bayar sekarang'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (chatActive) ...[
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.chat, arguments: chatArgs), icon: const Icon(Icons.chat_bubble_outline), label: Text('Buka obrolan'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: OutlinedButton.icon(onPressed: () => Get.toNamed(AppRoutes.call, arguments: {'id': c.id, 'video': false}), icon: const Icon(Icons.call_outlined), label: Text('Panggilan suara'.tr), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50)))),
          const SizedBox(width: 8),
          Expanded(child: OutlinedButton.icon(onPressed: () => Get.toNamed(AppRoutes.call, arguments: {'id': c.id, 'video': true}), icon: const Icon(Icons.videocam_outlined), label: Text('Video call'.tr), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50)))),
        ]),
        const SizedBox(height: 8),
      ],
      if (isDoctor && status == 'scheduled') ...[
        OutlinedButton.icon(onPressed: c.busy.value ? null : c.start, icon: const Icon(Icons.play_arrow), label: Text('Mulai konsultasi'.tr), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 8),
      ],
      if (isDoctor && (status == 'scheduled' || status == 'ongoing'))
        FilledButton.icon(onPressed: () => Get.toNamed(AppRoutes.completeConsultation, arguments: c.id)?.then((_) => c.load(silent: true)), icon: const Icon(Icons.task_alt), label: Text('Selesaikan & tulis resep'.tr), style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50), backgroundColor: Colors.green)),
      if (status == 'pending' || status == 'scheduled')
        TextButton.icon(onPressed: c.busy.value ? null : c.cancel, icon: const Icon(Icons.cancel_outlined, color: Colors.red), label: Text('Batalkan'.tr, style: TextStyle(color: Colors.red))),
      if (status == 'completed' && !isDoctor) ...[
        OutlinedButton.icon(onPressed: c.review, icon: const Icon(Icons.star_outline), label: Text('Beri ulasan'.tr), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      ],
      if (status == 'completed' || (x['status'] == 'cancelled' && false))
        OutlinedButton.icon(onPressed: () => Get.toNamed(AppRoutes.chat, arguments: chatArgs), icon: const Icon(Icons.history), label: Text('Lihat riwayat obrolan'.tr), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50))),
      if (resep != null) ...[
        SectionHeading('Resep dokter'.tr, padding: const EdgeInsets.fromLTRB(2, 18, 2, 10)),
        for (final o in asList(resep['obat']))
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: SoftCard(
              tone: Tone.peach,
              variant: 1,
              radius: 22,
              padding: const EdgeInsets.all(14),
              child: Row(children: [
                const ToneIcon(Icons.medication_rounded, tone: Tone.peach, size: 44),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(asMap(o['obat_id']).s('nama', 'Obat'), style: const TextStyle(fontWeight: FontWeight.w800)),
                    Text('${o.s('dosis')} • ${o.n('jumlah').toInt()} ${'unit'.tr} • ${o.s('aturan_pakai')}', style: const TextStyle(fontSize: 12.5, height: 1.3)),
                  ]),
                ),
              ]),
            ),
          ),
        if (!isDoctor)
          FilledButton.icon(
            onPressed: () => Get.toNamed(AppRoutes.cart, arguments: {'resep_id': resep['_id']}),
            icon: const Icon(Icons.local_pharmacy_outlined),
            label: Text('Tebus resep di apotek'.tr),
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50)),
          ),
      ],
    ]);
  }

  Widget _row(BuildContext context, IconData icon, Tone tone, String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ToneIcon(icon, tone: tone, size: 38),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label.tr, style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
              const SizedBox(height: 1),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w600, height: 1.3)),
            ]),
          ),
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
      showError('${'Pembayaran'.tr} ${status.toString().tr}');
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
      appBar: AppBar(title: Text('Pembayaran'.tr)),
      body: Obx(() {
        if (c.loading.value) return const Center(child: CircularProgressIndicator());
        final t = c.tx.value;
        if (t == null) return Center(child: Text('Transaksi tidak ditemukan'.tr));
        final isMock = (t['payment_url']?.toString() ?? '').contains('/simulate');
        final ink = toneOf(context, Tone.mint).ink;
        return SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            SoftCard(
              tone: Tone.mint,
              radius: 32,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
              child: Column(children: [
                GlowAvatar(size: 84, child: Icon(Icons.account_balance_wallet_rounded, size: 40, color: ink)),
                const SizedBox(height: 18),
                Text(rupiah(t.n('total_biaya')), textAlign: TextAlign.center, style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800, color: ink, letterSpacing: -1)),
                const SizedBox(height: 8),
                Pill('No. ${t.s('order_id')}', tone: Tone.slate),
                const SizedBox(height: 14),
                StatusChip(t.s('status')),
              ]),
            ),
            const SizedBox(height: 22),
            if (isMock) ...[
              SoftCard(tone: Tone.sky, blobs: false, radius: 20, padding: const EdgeInsets.all(14), child: Row(children: [
                Icon(Icons.science_rounded, color: toneOf(context, Tone.sky).ink),
                const SizedBox(width: 12),
                Expanded(child: Text('Mode sandbox: belum ada gateway pembayaran yang terhubung. Simulasikan hasil pembayaran:'.tr, style: TextStyle(fontSize: 13, height: 1.4, color: toneOf(context, Tone.sky).ink))),
              ])),
              const SizedBox(height: 16),
              FilledButton(onPressed: c.busy.value ? null : () => c.simulate(true), child: Text('Simulasikan pembayaran berhasil'.tr)),
              const SizedBox(height: 10),
              OutlinedButton(onPressed: c.busy.value ? null : () => c.simulate(false), child: Text('Simulasikan gagal'.tr)),
            ] else ...[
              FilledButton.icon(onPressed: c.openGateway, icon: const Icon(Icons.open_in_new_rounded), label: Text('Buka halaman pembayaran'.tr)),
              const SizedBox(height: 14),
              Text('Setelah membayar, kembali ke aplikasi. Status akan diperbarui otomatis.'.tr, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5, height: 1.4)),
            ],
          ]),
        );
      }),
    );
  }
}
