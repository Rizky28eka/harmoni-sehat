import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/ui.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';

class AdminController extends GetxController {
  final _api = Get.find<ApiClient>();
  final loading = true.obs;
  final error = RxnString();
  final stats = Rxn<Map<String, dynamic>>();
  final doctors = <Map<String, dynamic>>[].obs;
  final pharmacists = <Map<String, dynamic>>[].obs;

  @override
  void onInit() {
    super.onInit();
    load();
  }

  Future<void> load() async {
    loading.value = true;
    error.value = null;
    try {
      stats.value = asMap(await _api.get('/admins/manage/stats'));
      final p = asMap(await _api.get('/admins/manage/pending-verifications'));
      doctors.assignAll(asList(p['dokter']));
      pharmacists.assignAll(asList(p['apoteker']));
    } catch (e) {
      error.value = e is ApiException ? e.message : 'Gagal memuat';
    } finally {
      loading.value = false;
    }
  }

  Future<void> verify(String kind, String id, bool approve) async {
    String? reason;
    if (!approve) {
      final ctl = TextEditingController();
      final ok = await Get.dialog<bool>(AlertDialog(
        title: Text('Tolak verifikasi'.tr),
        content: TextField(controller: ctl, maxLines: 3, maxLength: 300, decoration: InputDecoration(labelText: 'Alasan penolakan (dikirim ke pemohon)'.tr, alignLabelWithHint: true)),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Tolak'.tr))],
      ));
      if (ok != true) return;
      reason = ctl.text.trim();
    }
    try {
      await _api.post('/admins/manage/verify/$kind/$id', data: {'approve': approve, if (reason != null && reason.isNotEmpty) 'reason': reason});
      showSuccess(approve ? 'Disetujui' : 'Ditolak');
      await load();
    } catch (e) {
      showError(e);
    }
  }
}

class AdminShell extends StatefulWidget {
  const AdminShell({super.key});

  @override
  State<AdminShell> createState() => _AdminShellState();
}

class _AdminShellState extends State<AdminShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final c = Get.put(AdminController());
    return Scaffold(
      appBar: AppBar(title: Text(['Statistik', 'Verifikasi', 'Profil'][_index].tr), actions: const [NotificationBell(), SizedBox(width: 8)]),
      body: Column(children: [const OfflineBanner(), Expanded(child: IndexedStack(index: _index, children: [_Stats(c), _Verifications(c), const ProfileTab()]))]),
      bottomNavigationBar: Obx(() {
        final pending = c.doctors.length + c.pharmacists.length;
        return FloatingNavBar(
          index: _index,
          onChanged: (i) => setState(() => _index = i),
          items: [
            NavItem(Icons.insights_outlined, Icons.insights_rounded, 'Statistik'.tr),
            NavItem(Icons.verified_user_outlined, Icons.verified_user_rounded, 'Verifikasi'.tr, badge: pending),
            NavItem(Icons.person_outline, Icons.person_rounded, 'Profil'.tr),
          ],
        );
      }),
    );
  }
}

class _Stats extends StatelessWidget {
  const _Stats(this.c);
  final AdminController c;

  @override
  Widget build(BuildContext context) => Obx(() => asyncBody(
        loading: c.loading.value,
        error: c.error.value,
        isEmpty: c.stats.value == null,
        onRetry: c.load,
        builder: () => RefreshIndicator(
          onRefresh: c.load,
          child: ListView(padding: const EdgeInsets.fromLTRB(20, 4, 20, 24), children: [
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.3,
              children: [
                _tile(context, 'Pasien', '${c.stats.value!.n('pasien').toInt()}', Icons.people_rounded, Tone.sky, 0),
                _tile(context, 'Dokter aktif', '${c.stats.value!.n('dokter').toInt()}', Icons.medical_services_rounded, Tone.mint, 1),
                _tile(context, 'Apoteker aktif', '${c.stats.value!.n('apoteker').toInt()}', Icons.local_pharmacy_rounded, Tone.butter, 2),
                _tile(context, 'Pendapatan', rupiah(c.stats.value!.n('pendapatan')), Icons.payments_rounded, Tone.lilac, 0),
              ],
            ),
            const SectionTitle('Konsultasi'),
            _breakdown(c.stats.value!.m('konsultasi')),
            const SectionTitle('Pesanan obat'),
            _breakdown(c.stats.value!.m('pesanan')),
          ]),
        ),
      ));

  Widget _tile(BuildContext context, String label, String value, IconData icon, Tone tone, int variant) => SoftCard(
        tone: tone,
        variant: variant,
        radius: 26,
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: toneOf(context, tone).ink, size: 26),
          const Spacer(),
          Text(value, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: toneOf(context, tone).ink, letterSpacing: -0.5)),
          Text(label.tr, style: TextStyle(color: toneOf(context, tone).ink.withValues(alpha: 0.8), fontSize: 12.5, fontWeight: FontWeight.w600)),
        ]),
      );

  Widget _breakdown(Map<String, dynamic> m) => m.isEmpty
      ? Padding(padding: const EdgeInsets.symmetric(horizontal: 22), child: Text('Belum ada data'.tr, style: const TextStyle(color: AppColors.textMuted)))
      : Padding(padding: const EdgeInsets.symmetric(horizontal: 20), child: Wrap(spacing: 10, runSpacing: 10, children: [for (final e in m.entries) SoftCard(radius: 18, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), child: Row(mainAxisSize: MainAxisSize.min, children: [StatusChip(e.key), const SizedBox(width: 8), Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.w800))]))]));
}

class _Verifications extends StatelessWidget {
  const _Verifications(this.c);
  final AdminController c;

  @override
  Widget build(BuildContext context) => Obx(() {
        final items = [
          for (final d in c.doctors) ('dokter', d, 'STR ${d.s('nomor_str')}'),
          for (final a in c.pharmacists) ('farmasi', a, 'SIPA ${a.s('nomor_sipa')}'),
        ];
        return asyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: items.isEmpty,
          emptyText: 'Tidak ada permintaan verifikasi',
          emptyIcon: Icons.verified_rounded,
          onRetry: c.load,
          builder: () => RefreshIndicator(
            onRefresh: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
              itemCount: items.length,
              itemBuilder: (_, i) {
                final (kind, p, license) = items[i];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SoftCard(
                    tone: kind == 'dokter' ? Tone.mint : Tone.peach,
                    variant: i,
                    radius: 28,
                    padding: const EdgeInsets.all(16),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Avatar(name: p.s('nama'), radius: 26),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(p.s('nama'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                            const SizedBox(height: 2),
                            Text(kind == 'dokter' ? '${'Dokter'.tr} • $license' : '${'Apoteker'.tr} • $license', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            Text(asMap(p['user_id']).s('email'), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          ]),
                        ),
                      ]),
                      const SizedBox(height: 12),
                      Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                        TextButton(onPressed: () => c.verify(kind, p['_id'].toString(), false), style: TextButton.styleFrom(foregroundColor: AppColors.errorColor), child: Text('Tolak'.tr)),
                        const SizedBox(width: 8),
                        FilledButton(onPressed: () => c.verify(kind, p['_id'].toString(), true), child: Text('Setujui'.tr)),
                      ]),
                    ]),
                  ),
                );
              },
            ),
          ),
        );
      });
}
