import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';
import '../patient/consultations.dart';
import '../patient/patient_shell.dart' show greetingPart;

class DoctorHomeController extends LoadController<Map<String, dynamic>> {
  final _api = Get.find<ApiClient>();

  @override
  void onInit() {
    super.onInit();
    Get.find<SocketService>().connect();
    primeUnreadCount();
  }

  @override
  Future<Map<String, dynamic>> fetch() async => asMap(await _api.get('/booking/my/summary', cache: true));
}

class DoctorShell extends StatefulWidget {
  const DoctorShell({super.key});

  @override
  State<DoctorShell> createState() => _DoctorShellState();
}

class _DoctorShellState extends State<DoctorShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final titles = ['Beranda', 'Konsultasi', 'Jadwal', 'Profil'];
    return Scaffold(
      appBar: _index == 0 ? null : AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell(), SizedBox(width: 8)]),
      body: Column(children: [const OfflineBanner(), Expanded(child: IndexedStack(index: _index, children: const [_DoctorHome(), ConsultationsTab(), ScheduleTab(), ProfileTab()]))]),
      bottomNavigationBar: FloatingNavBar(
        index: _index,
        onChanged: (i) => setState(() => _index = i),
        items: [
          NavItem(Icons.dashboard_outlined, Icons.dashboard_rounded, 'Beranda'.tr),
          NavItem(Icons.chat_bubble_outline, Icons.chat_bubble_rounded, 'Konsultasi'.tr),
          NavItem(Icons.calendar_month_outlined, Icons.calendar_month_rounded, 'Jadwal'.tr),
          NavItem(Icons.person_outline, Icons.person_rounded, 'Profil'.tr),
        ],
      ),
    );
  }
}

class _DoctorHome extends StatelessWidget {
  const _DoctorHome();

  @override
  Widget build(BuildContext context) {
    final c = Get.put(DoctorHomeController());
    final session = Get.find<SessionService>();
    Widget stat(String label, String value, IconData icon, Tone tone, int variant) => SoftCard(
          tone: tone,
          variant: variant,
          radius: 26,
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(icon, color: toneOf(context, tone).ink, size: 26),
            const SizedBox(height: 14),
            Text(value, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: toneOf(context, tone).ink, letterSpacing: -0.5)),
            const SizedBox(height: 2),
            Text(label.tr, style: TextStyle(color: toneOf(context, tone).ink.withValues(alpha: 0.8), fontSize: 12.5, fontWeight: FontWeight.w600)),
          ]),
        );
    return SafeArea(
      bottom: false,
      child: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: c.data.value == null,
            onRetry: c.load,
            builder: () {
              final d = c.data.value!;
              final today = asList(d['today']);
              return RefreshIndicator(
                onRefresh: c.load,
                child: ListView(padding: const EdgeInsets.only(bottom: 24), children: [
                  BigGreeting(lead: greetingPart(), title: session.displayName, trailing: const NotificationBell()),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 1.35,
                      children: [
                        stat('Akan datang', '${d.n('upcoming').toInt()}', Icons.event_rounded, Tone.sky, 0),
                        stat('Selesai', '${d.n('completed').toInt()}', Icons.task_alt_rounded, Tone.mint, 1),
                        stat('Rating', d.n('rating') == 0 ? '-' : d.n('rating').toStringAsFixed(1), Icons.star_rounded, Tone.butter, 2),
                        stat('Pendapatan', rupiah(d.n('pendapatan')), Icons.payments_rounded, Tone.lilac, 0),
                      ],
                    ),
                  ),
                  const SectionTitle('Antrean hari ini'),
                  if (today.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: SoftCard(tone: Tone.slate, blobs: false, radius: 24, padding: const EdgeInsets.all(20), child: Row(children: [Icon(Icons.free_breakfast_rounded, color: toneOf(context, Tone.slate).ink), const SizedBox(width: 12), Expanded(child: Text('Tidak ada konsultasi hari ini.'.tr, style: TextStyle(color: toneOf(context, Tone.slate).ink, fontWeight: FontWeight.w600)))])),
                    ),
                  for (final x in today)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
                      child: SoftCard(
                        radius: 24,
                        padding: const EdgeInsets.all(14),
                        onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
                        child: Row(children: [
                          Avatar(name: asMap(x['pasien_id']).s('nama')),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(asMap(x['pasien_id']).s('nama'), style: const TextStyle(fontWeight: FontWeight.w800)),
                              const SizedBox(height: 2),
                              Text('${fmtTime(x['tanggal'])} ${'WIB'} • ${x.s('keluhan')}', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary)),
                            ]),
                          ),
                          StatusChip(x.s('status')),
                        ]),
                      ),
                    ),
                ]),
              );
            },
          )),
    );
  }
}

class ScheduleController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();

  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(await _api.get('/booking/my/schedules', cache: true));

  Future<void> toggle(Map<String, dynamic> s, bool on) async {
    try {
      await _api.put('/booking/my/schedules/${s['_id']}', data: {'is_active': on});
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }

  Future<void> remove(String id) async {
    try {
      await _api.delete('/booking/my/schedules/$id');
      await load(silent: true);
    } catch (e) {
      showError(e);
      await load(silent: true);
    }
  }

  Future<void> add(BuildContext context) async {
    List<Map<String, dynamic>> clinics = [];
    try {
      clinics = asList(await _api.get('/clinics', cache: true));
    } catch (e) {
      return showError(e);
    }
    if (clinics.isEmpty) return showError('Belum ada klinik terdaftar. Hubungi admin.');
    String? clinic = clinics.first['_id'].toString();
    var day = 'Senin';
    var start = const TimeOfDay(hour: 9, minute: 0);
    var end = const TimeOfDay(hour: 12, minute: 0);
    var duration = 30;
    String hhmm(TimeOfDay t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
    final ok = await Get.dialog<bool>(StatefulBuilder(
      builder: (ctx, setState) => AlertDialog(
        title: Text('Tambah jadwal praktik'.tr),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            DropdownButtonFormField<String>(initialValue: clinic, decoration: InputDecoration(labelText: 'Klinik'.tr), items: [for (final k in clinics) DropdownMenuItem(value: k['_id'].toString(), child: Text('${k['nama']}'))], onChanged: (v) => clinic = v),
            DropdownButtonFormField<String>(initialValue: day, decoration: InputDecoration(labelText: 'Hari'.tr), items: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(), onChanged: (v) => day = v ?? day),
            ListTile(contentPadding: EdgeInsets.zero, title: Text('Mulai'.tr), trailing: Text(start.format(ctx)), onTap: () async { final t = await showTimePicker(context: ctx, initialTime: start); if (t != null) setState(() => start = t); }),
            ListTile(contentPadding: EdgeInsets.zero, title: Text('Selesai'.tr), trailing: Text(end.format(ctx)), onTap: () async { final t = await showTimePicker(context: ctx, initialTime: end); if (t != null) setState(() => end = t); }),
            DropdownButtonFormField<int>(initialValue: duration, decoration: InputDecoration(labelText: 'Durasi per sesi'.tr), items: [15, 20, 30, 45, 60].map((d) => DropdownMenuItem(value: d, child: Text('$d menit'))).toList(), onChanged: (v) => duration = v ?? 30),
          ]),
        ),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Simpan'.tr))],
      ),
    ));
    if (ok != true) return;
    try {
      await _api.post('/booking/my/schedules', data: {'klinik_id': clinic, 'hari': day, 'jam_mulai': hhmm(start), 'jam_selesai': hhmm(end), 'durasi_menit': duration});
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }
}

class ScheduleTab extends StatelessWidget {
  const ScheduleTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(ScheduleController());
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.add(context), icon: const Icon(Icons.add), label: Text('Tambah jadwal'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada jadwal praktik.\nTambahkan agar pasien dapat memesan.',
            emptyIcon: Icons.calendar_today_outlined,
            onRetry: c.load,
            builder: () => ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final s = c.data.value![i];
                final active = s['is_active'] == true;
                return Dismissible(
                  key: ValueKey(s['_id']),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (_) => confirm('Hapus jadwal', 'Jadwal ini akan dihapus.', ok: 'Hapus'),
                  background: Container(margin: const EdgeInsets.only(bottom: 12), decoration: BoxDecoration(color: AppColors.errorColor, borderRadius: BorderRadius.circular(26)), alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 24), child: const Icon(Icons.delete_rounded, color: Colors.white)),
                  onDismissed: (_) => c.remove(s['_id'].toString()),
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: SoftCard(
                      tone: active ? Tone.sky : Tone.slate,
                      variant: i,
                      radius: 26,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(children: [
                        ToneIcon(Icons.calendar_month_rounded, tone: active ? Tone.sky : Tone.slate, size: 46),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('${s.s('hari')} • ${s.s('jam_mulai')}–${s.s('jam_selesai')}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15.5)),
                            const SizedBox(height: 3),
                            Text('${asMap(s['klinik_id']).s('nama')} • ${s.n('durasi_menit', 30).toInt()} ${'menit/sesi'.tr}', style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary)),
                          ]),
                        ),
                        Switch(value: active, onChanged: (v) => c.toggle(s, v)),
                      ]),
                    ),
                  ),
                );
              },
            ),
          )),
    );
  }
}

class CompleteConsultationController extends GetxController {
  CompleteConsultationController(this.id);
  final String id;
  final _api = Get.find<ApiClient>();

  final diagnosis = TextEditingController();
  final action = TextEditingController();
  final notes = TextEditingController();
  final bp = TextEditingController();
  final temp = TextEditingController();
  final height = TextEditingController();
  final weight = TextEditingController();
  final allergies = TextEditingController();
  final prescriptionNote = TextEditingController();
  final items = <Map<String, dynamic>>[].obs;
  final saving = false.obs;

  Future<void> addDrug() async {
    final search = TextEditingController();
    final results = <Map<String, dynamic>>[].obs;
    Future<void> doSearch() async {
      try {
        results.assignAll(asList(asMap(await _api.get('/shop/drugs', query: {'search': search.text.trim(), 'limit': 15}))['data']));
      } catch (_) {}
    }

    await doSearch();
    final picked = await Get.dialog<Map<String, dynamic>>(AlertDialog(
      title: Text('Pilih obat'.tr),
      content: SizedBox(
        width: double.maxFinite,
        height: 360,
        child: Column(children: [
          TextField(controller: search, onChanged: (_) => doSearch(), decoration: InputDecoration(prefixIcon: Icon(Icons.search), hintText: 'Cari obat'.tr)),
          Expanded(child: Obx(() => ListView(children: [for (final d in results) ListTile(title: Text(d.s('nama')), subtitle: Text('${d.s('kategori')}${d['butuh_resep'] == true ? ' • Resep' : ''}'), onTap: () => Get.back(result: d))]))),
        ]),
      ),
    ));
    if (picked == null) return;
    final dose = TextEditingController(text: '1 tablet');
    final qty = TextEditingController(text: '10');
    final rule = TextEditingController(text: '3x sehari sesudah makan');
    final ok = await Get.dialog<bool>(AlertDialog(
      title: Text(picked.s('nama')),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        TextField(controller: dose, decoration: InputDecoration(labelText: 'Dosis'.tr)),
        TextField(controller: qty, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: '${'Jumlah'.tr} (${picked.s('satuan')})')),
        TextField(controller: rule, decoration: InputDecoration(labelText: 'Aturan pakai'.tr)),
      ]),
      actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Tambah'.tr))],
    ));
    if (ok != true) return;
    items.add({'obat_id': picked['_id'].toString(), 'nama': picked.s('nama'), 'dosis': dose.text.trim(), 'jumlah': int.tryParse(qty.text) ?? 1, 'aturan_pakai': rule.text.trim()});
  }

  /// The five most recently used diagnoses, offered as one-tap chips on the next form.
  static const _recentKey = 'recent_diagnoses';
  List<String> get recentDiagnoses {
    try {
      final v = GetStorage().read(_recentKey);
      return v is List ? v.map((e) => e.toString()).toList() : <String>[];
    } catch (_) {
      return <String>[];
    }
  }

  void _rememberDiagnosis(String d) {
    if (d.isEmpty) return;
    try {
      GetStorage().write(_recentKey, [d, ...recentDiagnoses.where((x) => x != d)].take(5).toList());
    } catch (_) {}
  }

  Future<void> submit() async {
    if (diagnosis.text.trim().length < 2) return showError('Diagnosa wajib diisi');
    saving.value = true;
    try {
      final body = <String, dynamic>{
        'diagnosa': diagnosis.text.trim(),
        if (action.text.trim().isNotEmpty) 'tindakan': action.text.trim(),
        if (notes.text.trim().isNotEmpty) 'catatan_dokter': notes.text.trim(),
        if (bp.text.trim().isNotEmpty) 'tekanan_darah': bp.text.trim(),
        if (num.tryParse(temp.text) != null) 'suhu_tubuh': num.parse(temp.text),
        if (num.tryParse(height.text) != null) 'tinggi_badan': num.parse(height.text),
        if (num.tryParse(weight.text) != null) 'berat_badan': num.parse(weight.text),
        if (allergies.text.trim().isNotEmpty) 'alergi': allergies.text.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList(),
        if (items.isNotEmpty)
          'resep': {
            if (prescriptionNote.text.trim().isNotEmpty) 'catatan': prescriptionNote.text.trim(),
            'obat': items.map((e) => {'obat_id': e['obat_id'], 'dosis': e['dosis'], 'jumlah': e['jumlah'], 'aturan_pakai': e['aturan_pakai']}).toList(),
          },
      };
      await _api.post('/booking/consultations/$id/complete', data: body);
      _rememberDiagnosis(diagnosis.text.trim());
      showSuccess('Konsultasi selesai. Rekam medis tersimpan.');
      Get.back();
    } catch (e) {
      showError(e);
    } finally {
      saving.value = false;
    }
  }

  @override
  void onClose() {
    for (final c in [diagnosis, action, notes, bp, temp, height, weight, allergies, prescriptionNote]) {
      c.dispose();
    }
    super.onClose();
  }
}

class CompleteConsultationView extends StatelessWidget {
  const CompleteConsultationView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(CompleteConsultationController(Get.arguments as String));
    Widget f(TextEditingController t, String label, {int lines = 1, TextInputType? type}) => Padding(padding: const EdgeInsets.only(bottom: 12), child: TextField(controller: t, maxLines: lines, keyboardType: type, decoration: InputDecoration(labelText: label, alignLabelWithHint: true)));
    Widget section(String title, IconData icon, Tone tone, List<Widget> children) => Padding(
          padding: const EdgeInsets.only(bottom: 14),
          child: SoftCard(
            radius: 28,
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 6),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [ToneIcon(icon, tone: tone, size: 38), const SizedBox(width: 10), Text(title.tr, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16))]),
              const SizedBox(height: 14),
              ...children,
            ]),
          ),
        );
    return Scaffold(
      appBar: AppBar(title: Text('Selesaikan Konsultasi'.tr)),
      body: ListView(padding: const EdgeInsets.fromLTRB(20, 4, 20, 28), children: [
        section('Diagnosa', Icons.medical_information_rounded, Tone.lilac, [
          if (c.recentDiagnoses.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 10), child: Wrap(spacing: 8, runSpacing: 6, children: [for (final d in c.recentDiagnoses) ActionChip(label: Text(d), onPressed: () => c.diagnosis.text = d)])),
          f(c.diagnosis, 'Diagnosa *', lines: 2), f(c.action, 'Tindakan'), f(c.notes, 'Catatan dokter', lines: 3)]),
        section('Tanda vital', Icons.monitor_heart_rounded, Tone.rose, [
          Row(children: [Expanded(child: f(c.bp, 'Tekanan darah')), const SizedBox(width: 12), Expanded(child: f(c.temp, 'Suhu (°C)', type: TextInputType.number))]),
          Row(children: [Expanded(child: f(c.height, 'Tinggi (cm)', type: TextInputType.number)), const SizedBox(width: 12), Expanded(child: f(c.weight, 'Berat (kg)', type: TextInputType.number))]),
          f(c.allergies, 'Alergi (pisahkan dengan koma)'),
        ]),
        section('Resep', Icons.medication_rounded, Tone.peach, [
          Obx(() => Column(children: [
                for (var i = 0; i < c.items.length; i++)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: SoftCard(
                      tone: Tone.peach,
                      blobs: false,
                      radius: 20,
                      padding: const EdgeInsets.fromLTRB(14, 10, 4, 10),
                      child: Row(children: [
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(c.items[i]['nama'].toString(), style: const TextStyle(fontWeight: FontWeight.w800)),
                            Text('${c.items[i]['dosis']} • ${c.items[i]['jumlah']} ${'unit'.tr} • ${c.items[i]['aturan_pakai']}', style: const TextStyle(fontSize: 12.5)),
                          ]),
                        ),
                        IconButton(icon: const Icon(Icons.delete_outline_rounded), onPressed: () => c.items.removeAt(i)),
                      ]),
                    ),
                  ),
              ])),
          Padding(padding: const EdgeInsets.only(bottom: 12), child: OutlinedButton.icon(onPressed: c.addDrug, icon: const Icon(Icons.add_rounded), label: Text('Tambah obat'.tr))),
          f(c.prescriptionNote, 'Catatan resep (opsional)'),
        ]),
        Obx(() => FilledButton(onPressed: c.saving.value ? null : c.submit, child: c.saving.value ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white)) : Text('Simpan & selesai'.tr))),
      ]),
    );
  }
}
