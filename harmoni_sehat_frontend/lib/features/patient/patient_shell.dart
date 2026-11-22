import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
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
      (Icons.search, 'Cari dokter'.tr, () => Get.toNamed(AppRoutes.doctors), AppColors.primaryColor, AppColors.primaryLight),
      (Icons.smart_toy_outlined, 'Asisten AI'.tr, () => Get.toNamed(AppRoutes.aiChat), AppColors.accentIndigo, AppColors.accentIndigoLight),
      (Icons.local_pharmacy_outlined, 'Toko obat', () => Get.toNamed(AppRoutes.shop), AppColors.accentAmber, AppColors.accentAmberLight),
      (Icons.alarm, 'Pengingat', () => Get.toNamed(AppRoutes.reminders), AppColors.secondaryColor, AppColors.secondaryLight),
    ];
    return RefreshIndicator(
      onRefresh: c.load,
      child: ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 6),
            child: Text(
              greeting(),
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.3,
                  ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Bagaimana kesehatan Anda hari ini?'.tr,
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
          ),
          const SizedBox(height: 16),

          // AI Health Hero Card Banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: InkWell(
              onTap: () => Get.toNamed(AppRoutes.aiChat),
              borderRadius: BorderRadius.circular(18),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0E9F6E), Color(0xFF047857)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryColor.withValues(alpha: 0.25),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.smart_toy_outlined, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Asisten AI'.tr,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'Dapatkan saran medis dari dokter ahli kapan saja, di mana saja tanpa perlu antre.'.tr,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(color: Colors.white.withValues(alpha: 0.88), fontSize: 12, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 14),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Quick Action Cards
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                for (final a in actions)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: InkWell(
                        onTap: a.$3,
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.borderColor, width: 0.9),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: a.$5,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Icon(a.$1, color: a.$4, size: 24),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                a.$2,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, height: 1.2),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          const SectionTitle('Jadwal konsultasi'),
          Obx(() {
            if (c.loading.value) return const Padding(padding: EdgeInsets.all(24), child: Center(child: CircularProgressIndicator()));
            final upcoming = asList(c.data.value?['upcoming']);
            if (upcoming.isEmpty) {
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.event_available_outlined, color: AppColors.primaryColor),
                  ),
                  title: Text('Belum ada jadwal'.tr, style: const TextStyle(fontWeight: FontWeight.w700)),
                  subtitle: Text('Temukan dokter dan buat janji'.tr, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                  onTap: () => Get.toNamed(AppRoutes.doctors),
                ),
              );
            }
            return Column(
              children: [
                for (final x in upcoming)
                  Card(
                    margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      leading: Avatar(name: asMap(x['dokter_id']).s('nama'), radius: 24),
                      title: Text(asMap(x['dokter_id']).s('nama'), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(fmtDateTime(x['tanggal']), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ),
                      trailing: StatusChip(x.s('status')),
                      onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
                    ),
                  ),
              ],
            );
          }),

          SectionTitle('Artikel kesehatan'.tr, action: 'Lihat semua', onAction: () => Get.toNamed(AppRoutes.articles)),
          Obx(() {
            final articles = asList(c.data.value?['articles']);
            return Column(
              children: [
                for (final a in articles)
                  Card(
                    margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      leading: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.secondaryLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.article_outlined, color: AppColors.secondaryColor, size: 24),
                      ),
                      title: Text(
                        a.s('judul'),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(fmtDate(a['createdAt']), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ),
                      trailing: const Icon(Icons.chevron_right, size: 18, color: AppColors.textSecondary),
                      onTap: () => Get.toNamed(AppRoutes.articleDetail, arguments: a.s('slug')),
                    ),
                  ),
              ],
            );
          }),
        ],
      ),
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
