import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';
import 'consultations.dart';
import 'records.dart';
import 'shop.dart';

class HomeController extends LoadController<Map<String, dynamic>> {
  final _api = Get.find<ApiClient>();

  @override
  void onInit() {
    super.onInit();
    Get.find<SocketService>().connect();
    primeUnreadCount();
  }

  @override
  Future<Map<String, dynamic>> fetch() async {
    final upcoming = asMap(await _api.get('/booking/consultations', query: {'limit': 3, 'status': 'scheduled,ongoing,pending'}, cache: true));
    final articles = asMap(await _api.get('/health-articles', query: {'limit': 3}, cache: true));
    return {'upcoming': asList(upcoming['data']), 'articles': asList(articles['data'])};
  }
}

class PatientShell extends StatefulWidget {
  const PatientShell({super.key});

  @override
  State<PatientShell> createState() => _PatientShellState();
}

class _PatientShellState extends State<PatientShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final titles = ['Beranda', 'Konsultasi', 'Obat', 'Riwayat', 'Profil'];
    return Scaffold(
      appBar: AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell()]),
      body: IndexedStack(index: _index, children: [
        const _HomeTab(),
        const ConsultationsTab(),
        const _PharmacyTab(),
        const _RecordsHub(),
        const ProfileTab(),
      ]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: 'Beranda'.tr),
          NavigationDestination(icon: const Icon(Icons.chat_bubble_outline), selectedIcon: const Icon(Icons.chat_bubble), label: 'Konsultasi'.tr),
          NavigationDestination(icon: const Icon(Icons.local_pharmacy_outlined), selectedIcon: const Icon(Icons.local_pharmacy), label: 'Obat'.tr),
          NavigationDestination(icon: const Icon(Icons.folder_outlined), selectedIcon: const Icon(Icons.folder), label: 'Riwayat'.tr),
          NavigationDestination(icon: const Icon(Icons.person_outline), selectedIcon: const Icon(Icons.person), label: 'Profil'.tr),
        ],
      ),
    );
  }
}

class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    final c = Get.put(HomeController());
    final actions = [
      (Icons.search, 'Cari dokter'.tr, () => Get.toNamed(AppRoutes.doctors)),
      (Icons.smart_toy_outlined, 'Asisten AI'.tr, () => Get.toNamed(AppRoutes.aiChat)),
      (Icons.local_pharmacy_outlined, 'Toko obat', () => Get.toNamed(AppRoutes.shop)),
      (Icons.alarm, 'Pengingat', () => Get.toNamed(AppRoutes.reminders)),
    ];
    return RefreshIndicator(
      onRefresh: c.load,
      child: ListView(children: [
        Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 4), child: Text(greeting(), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold))),
        const Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text('Bagaimana kesehatan Anda hari ini?', style: TextStyle(color: Colors.grey))),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(children: [
            for (final a in actions)
              Expanded(
                child: InkWell(
                  onTap: a.$3,
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(children: [
                      CircleAvatar(radius: 26, backgroundColor: Theme.of(context).colorScheme.primary.withValues(alpha: 0.12), child: Icon(a.$1, color: Theme.of(context).colorScheme.primary)),
                      const SizedBox(height: 6),
                      Text(a.$2, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
                    ]),
                  ),
                ),
              ),
          ]),
        ),
        const SectionTitle('Jadwal konsultasi'),
        Obx(() {
          if (c.loading.value) return const Padding(padding: EdgeInsets.all(24), child: Center(child: CircularProgressIndicator()));
          final upcoming = asList(c.data.value?['upcoming']);
          if (upcoming.isEmpty) {
            return Card(margin: const EdgeInsets.symmetric(horizontal: 16), child: ListTile(leading: const Icon(Icons.event_available_outlined), title: const Text('Belum ada jadwal'), subtitle: const Text('Temukan dokter dan buat janji'), trailing: const Icon(Icons.chevron_right), onTap: () => Get.toNamed(AppRoutes.doctors)));
          }
          return Column(children: [
            for (final x in upcoming)
              Card(
                margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: ListTile(
                  leading: Avatar(name: asMap(x['dokter_id']).s('nama')),
                  title: Text(asMap(x['dokter_id']).s('nama')),
                  subtitle: Text(fmtDateTime(x['tanggal'])),
                  trailing: StatusChip(x.s('status')),
                  onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
                ),
              ),
          ]);
        }),
        SectionTitle('Artikel kesehatan'.tr, action: 'Lihat semua', onAction: () => Get.toNamed(AppRoutes.articles)),
        Obx(() {
          final articles = asList(c.data.value?['articles']);
          return Column(children: [
            for (final a in articles)
              Card(
                margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: ListTile(leading: const Icon(Icons.article_outlined), title: Text(a.s('judul')), subtitle: Text(fmtDate(a['createdAt'])), onTap: () => Get.toNamed(AppRoutes.articleDetail, arguments: a.s('slug'))),
              ),
          ]);
        }),
        const SizedBox(height: 24),
      ]),
    );
  }
}

class _PharmacyTab extends StatelessWidget {
  const _PharmacyTab();

  @override
  Widget build(BuildContext context) => DefaultTabController(
        length: 2,
        child: Column(children: [
          const TabBar(tabs: [Tab(text: 'Katalog'), Tab(text: 'Pesanan Saya')]),
          const Expanded(child: TabBarView(children: [ShopView(embedded: true), OrdersTab()])),
        ]),
      );
}

class _RecordsHub extends StatelessWidget {
  const _RecordsHub();

  @override
  Widget build(BuildContext context) => const RecordsTab();
}
