import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';
import '../../shared/widgets/kit.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';
import 'consultations.dart';
import 'records.dart';
import 'shop.dart';

class HomeController extends GetxController {
  final _api = Get.find<ApiClient>();
  final loading = true.obs;
  final error = RxnString();
  final upcoming = <Map<String, dynamic>>[].obs;
  final reminders = <Map<String, dynamic>>[].obs;
  final articles = <Map<String, dynamic>>[].obs;
  final lastRecord = Rxn<Map<String, dynamic>>();
  final selectedDay = WeekStrip.dayOnly(DateTime.now()).obs;
  final done = <String>{}.obs; // "reminderId|HH:mm" taken today

  String get _doneKey => 'reminders_done_${selectedDay.value.toIso8601String().substring(0, 10)}';

  @override
  void onInit() {
    super.onInit();
    Get.find<SocketService>().connect();
    primeUnreadCount();
    load();
  }

  Future<T?> _try<T>(Future<T> Function() f) async {
    try {
      return await f();
    } catch (_) {
      return null;
    }
  }

  Future<void> load() async {
    loading.value = upcoming.isEmpty && articles.isEmpty;
    error.value = null;
    final results = await Future.wait<dynamic>([
      _try(() => _api.get('/booking/consultations', query: {'limit': 20, 'status': 'scheduled,ongoing,pending'}, cache: true)),
      _try(() => _api.get('/health-articles', query: {'limit': 6}, cache: true)),
      _try(() => _api.get('/me/reminders', cache: true)),
      _try(() => _api.get('/me/medical-timeline', cache: true)),
    ]);
    if (results.every((r) => r == null)) error.value = 'Tidak dapat terhubung ke server.';
    upcoming.assignAll(asList(asMap(results[0])['data']));
    articles.assignAll(asList(asMap(results[1])['data']));
    reminders.assignAll(asList(results[2]));
    final records = asList(results[3]);
    lastRecord.value = records.isEmpty ? null : records.first;
    try {
      final stored = GetStorage().read(_doneKey);
      done.assignAll(stored is List ? stored.map((e) => e.toString()) : <String>[]);
    } catch (_) {}
    loading.value = false;
  }

  Set<DateTime> get markedDays => upcoming.map((c) => parseDate(c['tanggal'])).whereType<DateTime>().map(WeekStrip.dayOnly).toSet();

  List<Map<String, dynamic>> get dayConsultations => upcoming.where((c) {
        final d = parseDate(c['tanggal']);
        return d != null && WeekStrip.dayOnly(d) == selectedDay.value;
      }).toList();

  Map<String, dynamic>? get next {
    final now = DateTime.now().subtract(const Duration(hours: 1));
    final list = upcoming.where((c) => (parseDate(c['tanggal']) ?? now).isAfter(now) && c['status'] != 'cancelled').toList()
      ..sort((a, b) => '${a['tanggal']}'.compareTo('${b['tanggal']}'));
    return list.isEmpty ? null : list.first;
  }

  /// Reminders due on the selected day, expanded per time of day.
  List<({Map<String, dynamic> r, String time})> get plan {
    final out = <({Map<String, dynamic> r, String time})>[];
    for (final r in reminders) {
      if (r['is_active'] != true) continue;
      for (final t in (r['jam'] as List? ?? [])) {
        out.add((r: r, time: t.toString()));
      }
    }
    out.sort((a, b) => a.time.compareTo(b.time));
    return out;
  }

  void toggleDone(String key) {
    done.contains(key) ? done.remove(key) : done.add(key);
    try {
      GetStorage().write(_doneKey, done.toList());
    } catch (_) {}
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
    final titles = ['Beranda', 'Konsultasi', 'Obat', 'Profil'];
    return Scaffold(
      appBar: _index == 0 ? null : AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell(), SizedBox(width: 8)]),
      body: IndexedStack(index: _index, children: const [_HomeTab(), ConsultationsTab(), _PharmacyTab(), ProfileTab()]),
      bottomNavigationBar: FloatingNavBar(
        index: _index,
        onChanged: (i) => setState(() => _index = i),
        centerIcon: Icons.add_rounded,
        centerTooltip: 'Cari dokter'.tr,
        onCenter: () => Get.toNamed(AppRoutes.doctors),
        items: [
          NavItem(Icons.home_outlined, Icons.home_rounded, 'Beranda'.tr),
          NavItem(Icons.chat_bubble_outline, Icons.chat_bubble_rounded, 'Konsultasi'.tr),
          NavItem(Icons.local_pharmacy_outlined, Icons.local_pharmacy_rounded, 'Obat'.tr),
          NavItem(Icons.person_outline, Icons.person_rounded, 'Profil'.tr),
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
    final session = Get.find<SessionService>();
    final first = session.displayName.trim().split(' ').firstWhere((w) => !w.toLowerCase().startsWith('dr'), orElse: () => session.displayName);
    return SafeArea(
      bottom: false,
      child: RefreshIndicator(
        onRefresh: c.load,
        child: ListView(padding: const EdgeInsets.only(bottom: 24), children: [
          BigGreeting(lead: greetingPart(), title: first, trailing: const NotificationBell()),
          // Search entry
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
            child: SoftCard(
              tone: Tone.slate,
              blobs: false,
              radius: 22,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              onTap: () => Get.toNamed(AppRoutes.doctors),
              child: Row(children: [
                Icon(Icons.search_rounded, color: AppColors.textMuted),
                const SizedBox(width: 12),
                Expanded(child: Text('Cari dokter, obat, artikel…'.tr, style: const TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w500))),
                Icon(Icons.tune_rounded, color: AppColors.textMuted, size: 20),
              ]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Obx(() => WeekStrip(selected: c.selectedDay.value, marked: c.markedDays, onSelect: (d) => c.selectedDay.value = d)),
          ),
          Obx(() {
            if (c.loading.value) return const Padding(padding: EdgeInsets.fromLTRB(20, 20, 20, 0), child: Skeleton(height: 170, radius: 28));
            final dayList = c.dayConsultations;
            final today = WeekStrip.dayOnly(DateTime.now());
            final showingToday = c.selectedDay.value == today;
            final hero = showingToday || dayList.isEmpty ? c.next : dayList.first;
            return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              SectionHeading(c.selectedDay.value == today ? 'Konsultasi berikutnya'.tr : DateFormatX.dayLabel(c.selectedDay.value)),
              if (hero == null) const _EmptyHero() else _NextConsultation(x: hero),
              if (dayList.length > 1)
                for (final x in dayList.skip(1)) Padding(padding: const EdgeInsets.fromLTRB(20, 10, 20, 0), child: _ConsultationRow(x: x)),
            ]);
          }),
          SectionHeading('Layanan'.tr),
          const _ServiceGrid(),
          Obx(() {
            final plan = c.plan;
            if (plan.isEmpty) return const SizedBox.shrink();
            return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              SectionHeading('Pengingat obat hari ini'.tr, action: 'Kelola'.tr, onAction: () => Get.toNamed(AppRoutes.reminders)),
              for (final p in plan.take(4)) Padding(padding: const EdgeInsets.fromLTRB(20, 0, 20, 10), child: _ReminderRow(c: c, r: p.r, time: p.time)),
            ]);
          }),
          Obx(() {
            final rec = c.lastRecord.value;
            if (rec == null) return const SizedBox.shrink();
            return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              SectionHeading('Rekam medis terakhir'.tr, action: 'Lihat semua'.tr, onAction: () => Get.toNamed(AppRoutes.medicalRecords)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 20), child: _LastRecord(rec: rec)),
            ]);
          }),
          Obx(() {
            if (c.articles.isEmpty) return const SizedBox.shrink();
            return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              SectionHeading('Artikel kesehatan'.tr, action: 'Lihat semua'.tr, onAction: () => Get.toNamed(AppRoutes.articles)),
              SizedBox(
                height: 168,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: c.articles.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (_, i) {
                    final a = c.articles[i];
                    const tones = [Tone.butter, Tone.sky, Tone.rose, Tone.lilac];
                    return SizedBox(
                      width: 220,
                      child: SoftCard(
                        tone: tones[i % tones.length],
                        variant: i,
                        onTap: () => Get.toNamed(AppRoutes.articleDetail, arguments: a.s('slug')),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          ToneIcon(Icons.menu_book_rounded, tone: tones[i % tones.length], size: 38),
                          const Spacer(),
                          Text(a.s('judul'), maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, height: 1.25)),
                          const SizedBox(height: 4),
                          Text(fmtDate(a['createdAt']), style: TextStyle(fontSize: 11, color: toneOf(context, tones[i % tones.length]).ink.withValues(alpha: 0.8))),
                        ]),
                      ),
                    );
                  },
                ),
              ),
            ]);
          }),
        ]),
      ),
    );
  }
}

/// Date label helpers for headings.
class DateFormatX {
  static String dayLabel(DateTime d) => fmtDate(d.toIso8601String());
}

String greetingPart() {
  final h = DateTime.now().hour;
  return (h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam').tr;
}

class _NextConsultation extends StatelessWidget {
  const _NextConsultation({required this.x});
  final Map<String, dynamic> x;

  @override
  Widget build(BuildContext context) {
    final dokter = asMap(x['dokter_id']);
    final status = x.s('status');
    final c = toneOf(context, Tone.mint);
    final live = status == 'scheduled' || status == 'ongoing';
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: SoftCard(
        tone: Tone.mint,
        radius: 30,
        padding: const EdgeInsets.all(20),
        onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Pill(status == 'ongoing' ? 'Berlangsung'.tr : status == 'pending' ? 'Menunggu pembayaran'.tr : 'Terjadwal'.tr, tone: status == 'pending' ? Tone.butter : Tone.mint, icon: Icons.circle, dense: true),
            const Spacer(),
            Icon(Icons.arrow_forward_rounded, color: c.ink),
          ]),
          const SizedBox(height: 18),
          Row(children: [
            Avatar(name: dokter.s('nama'), url: dokter['foto']?.toString(), radius: 30),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(dokter.s('nama', 'Dokter'), maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: c.ink, letterSpacing: -0.3)),
                const SizedBox(height: 3),
                Text(x.s('keluhan'), maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.ink.withValues(alpha: 0.75))),
              ]),
            ),
          ]),
          const SizedBox(height: 18),
          Row(children: [
            Icon(Icons.schedule_rounded, size: 18, color: c.ink),
            const SizedBox(width: 6),
            Expanded(child: Text(fmtDateTime(x['tanggal']), style: TextStyle(color: c.ink, fontWeight: FontWeight.w700))),
            if (live)
              FilledButton.icon(
                onPressed: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
                style: FilledButton.styleFrom(backgroundColor: c.ink, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10), minimumSize: const Size(0, 40)),
                icon: const Icon(Icons.videocam_rounded, size: 18),
                label: Text('Buka'.tr),
              ),
          ]),
        ]),
      ),
    );
  }
}

class _EmptyHero extends StatelessWidget {
  const _EmptyHero();

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, Tone.peach);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: SoftCard(
        tone: Tone.peach,
        radius: 30,
        variant: 1,
        padding: const EdgeInsets.all(22),
        onTap: () => Get.toNamed(AppRoutes.doctors),
        child: Row(children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Belum ada jadwal'.tr, style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: c.ink, letterSpacing: -0.3)),
              const SizedBox(height: 6),
              Text('Temukan dokter dan buat janji'.tr, style: TextStyle(color: c.ink.withValues(alpha: 0.8), height: 1.3)),
              const SizedBox(height: 14),
              FilledButton(onPressed: () => Get.toNamed(AppRoutes.doctors), style: FilledButton.styleFrom(backgroundColor: c.ink, padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10), minimumSize: const Size(0, 40)), child: Text('Cari dokter'.tr)),
            ]),
          ),
          const SizedBox(width: 8),
          Icon(Icons.medical_services_rounded, size: 72, color: c.ink.withValues(alpha: 0.35)),
        ]),
      ),
    );
  }
}

class _ConsultationRow extends StatelessWidget {
  const _ConsultationRow({required this.x});
  final Map<String, dynamic> x;

  @override
  Widget build(BuildContext context) {
    final dokter = asMap(x['dokter_id']);
    return SoftCard(
      padding: const EdgeInsets.all(14),
      radius: 22,
      onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
      child: Row(children: [
        Avatar(name: dokter.s('nama'), url: dokter['foto']?.toString()),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(dokter.s('nama'), style: const TextStyle(fontWeight: FontWeight.w700)), Text(fmtDateTime(x['tanggal']), style: const TextStyle(color: AppColors.textSecondary, fontSize: 12))])),
        StatusChip(x.s('status')),
      ]),
    );
  }
}

class _ServiceGrid extends StatelessWidget {
  const _ServiceGrid();

  @override
  Widget build(BuildContext context) {
    final items = <(IconData, String, String, Tone, VoidCallback)>[
      (Icons.search_rounded, 'Cari dokter', 'Booking konsultasi', Tone.mint, () => Get.toNamed(AppRoutes.doctors)),
      (Icons.auto_awesome_rounded, 'Asisten AI', 'Tanya gejala Anda', Tone.lilac, () => Get.toNamed(AppRoutes.aiChat)),
      (Icons.local_pharmacy_rounded, 'Toko obat', 'Antar ke rumah', Tone.peach, () => Get.toNamed(AppRoutes.shop)),
      (Icons.folder_rounded, 'Rekam medis', 'Riwayat & resep', Tone.sky, () => Get.toNamed(AppRoutes.medicalRecords)),
      (Icons.alarm_rounded, 'Pengingat', 'Jadwal minum obat', Tone.butter, () => Get.toNamed(AppRoutes.reminders)),
      (Icons.menu_book_rounded, 'Artikel', 'Tips kesehatan', Tone.rose, () => Get.toNamed(AppRoutes.articles)),
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.55,
        children: [
          for (var i = 0; i < items.length; i++)
            SoftCard(
              tone: items[i].$4,
              variant: i,
              padding: const EdgeInsets.all(16),
              onTap: items[i].$5,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Icon(items[i].$1, color: toneOf(context, items[i].$4).ink, size: 28),
                const Spacer(),
                Text(items[i].$2.tr, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: toneOf(context, items[i].$4).ink)),
                Text(items[i].$3.tr, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 11.5, color: toneOf(context, items[i].$4).ink.withValues(alpha: 0.75))),
              ]),
            ),
        ],
      ),
    );
  }
}

class _ReminderRow extends StatelessWidget {
  const _ReminderRow({required this.c, required this.r, required this.time});
  final HomeController c;
  final Map<String, dynamic> r;
  final String time;

  @override
  Widget build(BuildContext context) {
    final key = '${r['_id']}|$time';
    return Obx(() {
      final done = c.done.contains(key);
      return SoftCard(
        tone: done ? Tone.slate : Tone.butter,
        blobs: !done,
        radius: 22,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(children: [
          Text(time, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: toneOf(context, done ? Tone.slate : Tone.butter).ink)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(r.s('nama_obat'), style: TextStyle(fontWeight: FontWeight.w700, decoration: done ? TextDecoration.lineThrough : null)),
              if (r.s('dosis').isNotEmpty) Text(r.s('dosis'), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            ]),
          ),
          GestureDetector(
            onTap: () => c.toggleDone(key),
            child: Pill(done ? 'Sudah'.tr : 'Tandai sudah'.tr, tone: done ? Tone.mint : Tone.slate, icon: Icons.check_rounded),
          ),
        ]),
      );
    });
  }
}

class _LastRecord extends StatelessWidget {
  const _LastRecord({required this.rec});
  final Map<String, dynamic> rec;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, Tone.sky);
    final vitals = [
      if (rec['tekanan_darah'] != null) ('TD', '${rec['tekanan_darah']}'),
      if (rec['suhu_tubuh'] != null) ('Suhu', '${rec['suhu_tubuh']}°'),
      if (rec['berat_badan'] != null) ('BB', '${rec['berat_badan']} kg'),
    ];
    return SoftCard(
      tone: Tone.sky,
      variant: 2,
      radius: 26,
      onTap: () => Get.toNamed(AppRoutes.medicalRecords),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Expanded(child: Text(rec.s('diagnosis'), style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: c.ink, letterSpacing: -0.3))),
          Text(fmtDate(rec['tanggal_rekam_medis']), style: TextStyle(color: c.ink.withValues(alpha: 0.75), fontSize: 12)),
        ]),
        if (vitals.isNotEmpty) ...[
          const SizedBox(height: 12),
          Wrap(spacing: 8, runSpacing: 6, children: [for (final v in vitals) Pill('${v.$1} ${v.$2}', tone: Tone.sky)]),
        ],
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
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
            child: Builder(builder: (ctx) {
              final tc = DefaultTabController.of(ctx);
              return AnimatedBuilder(
                animation: tc,
                builder: (_, __) => SizedBox(width: double.infinity, child: SegmentedButton<int>(
                  showSelectedIcon: false,
                  segments: [ButtonSegment(value: 0, label: Text('Katalog'.tr)), ButtonSegment(value: 1, label: Text('Pesanan Saya'.tr))],
                  selected: {tc.index},
                  onSelectionChanged: (s) => tc.animateTo(s.first),
                )),
              );
            }),
          ),
          const Expanded(child: TabBarView(children: [ShopView(embedded: true), OrdersTab()])),
        ]),
      );
}

/// Full-screen medical records (opened from the home grid).
class RecordsPage extends StatelessWidget {
  const RecordsPage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('Rekam medis'.tr)), body: const RecordsTab());
}
