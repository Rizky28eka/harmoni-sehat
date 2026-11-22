import 'package:flutter/material.dart';
import 'package:get/get.dart';

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
    try {
      await _api.post('/admins/manage/verify/$kind/$id', data: {'approve': approve});
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
      appBar: AppBar(title: Text(['Statistik', 'Verifikasi', 'Profil'][_index]), actions: const [NotificationBell()]),
      body: IndexedStack(index: _index, children: [_Stats(c), _Verifications(c), const ProfileTab()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          const NavigationDestination(icon: Icon(Icons.insights_outlined), selectedIcon: Icon(Icons.insights), label: 'Statistik'),
          NavigationDestination(icon: Obx(() => Badge(isLabelVisible: c.doctors.length + c.pharmacists.length > 0, label: Text('${c.doctors.length + c.pharmacists.length}'), child: const Icon(Icons.verified_user_outlined))), label: 'Verifikasi'),
          NavigationDestination(icon: const Icon(Icons.person_outline), selectedIcon: const Icon(Icons.person), label: 'Profil'.tr),
        ],
      ),
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
          child: ListView(padding: const EdgeInsets.all(16), children: [
            Wrap(spacing: 12, runSpacing: 12, children: [
              _tile(context, 'Pasien', '${c.stats.value!.n('pasien').toInt()}', Icons.people_outline),
              _tile(context, 'Dokter aktif', '${c.stats.value!.n('dokter').toInt()}', Icons.medical_services_outlined),
              _tile(context, 'Apoteker aktif', '${c.stats.value!.n('apoteker').toInt()}', Icons.local_pharmacy_outlined),
              _tile(context, 'Pendapatan', rupiah(c.stats.value!.n('pendapatan')), Icons.payments_outlined),
            ]),
            const SectionTitle('Konsultasi'),
            _breakdown(c.stats.value!.m('konsultasi')),
            const SectionTitle('Pesanan obat'),
            _breakdown(c.stats.value!.m('pesanan')),
          ]),
        ),
      ));

  Widget _tile(BuildContext context, String label, String value, IconData icon) => SizedBox(
        width: (MediaQuery.of(context).size.width - 44) / 2,
        child: Card(child: Padding(padding: const EdgeInsets.all(14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(icon, color: Theme.of(context).colorScheme.primary), const SizedBox(height: 8), Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)), Text(label, style: const TextStyle(color: Colors.grey))]))),
      );

  Widget _breakdown(Map<String, dynamic> m) => m.isEmpty
      ? Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text('Belum ada data'.tr, style: TextStyle(color: Colors.grey)))
      : Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Wrap(spacing: 8, runSpacing: 8, children: [for (final e in m.entries) Chip(avatar: StatusChip(e.key), label: Text('${e.value}'))]));
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
          emptyIcon: Icons.verified_outlined,
          onRetry: c.load,
          builder: () => RefreshIndicator(
            onRefresh: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (_, i) {
                final (kind, p, license) = items[i];
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [Avatar(name: p.s('nama')), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(p.s('nama'), style: const TextStyle(fontWeight: FontWeight.bold)), Text(kind == 'dokter' ? '${'Dokter'.tr} • $license' : '${'Apoteker'.tr} • $license'), Text(asMap(p['user_id']).s('email'), style: const TextStyle(color: Colors.grey, fontSize: 12))]))]),
                      const SizedBox(height: 8),
                      Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                        TextButton(onPressed: () => c.verify(kind, p['_id'].toString(), false), child: Text('Tolak'.tr, style: TextStyle(color: Colors.red))),
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
