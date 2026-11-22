import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';
import '../common/notifications_view.dart';
import '../common/settings_view.dart';
import '../patient/consultations.dart';

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
      appBar: AppBar(title: Text(titles[_index].tr), actions: const [NotificationBell()]),
      body: IndexedStack(index: _index, children: const [_DoctorHome(), ConsultationsTab(), ScheduleTab(), ProfileTab()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.dashboard_outlined), selectedIcon: const Icon(Icons.dashboard), label: 'Beranda'.tr),
          NavigationDestination(icon: const Icon(Icons.chat_bubble_outline), selectedIcon: const Icon(Icons.chat_bubble), label: 'Konsultasi'.tr),
          NavigationDestination(icon: const Icon(Icons.calendar_month_outlined), selectedIcon: const Icon(Icons.calendar_month), label: 'Jadwal'.tr),
          NavigationDestination(icon: const Icon(Icons.person_outline), selectedIcon: const Icon(Icons.person), label: 'Profil'.tr),
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
    Widget stat(String label, String value, IconData icon) => Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(icon, color: Theme.of(context).colorScheme.primary), const SizedBox(height: 8), Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)), Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12))]),
            ),
          ),
        );
    return Obx(() => AsyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: c.data.value == null,
          onRetry: c.load,
          child: RefreshIndicator(
            onRefresh: c.load,
            child: ListView(padding: const EdgeInsets.all(16), children: [
              Text(greeting(), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Row(children: [stat('Akan datang', '${c.data.value!.n('upcoming').toInt()}', Icons.event), stat('Selesai', '${c.data.value!.n('completed').toInt()}', Icons.task_alt)]),
              Row(children: [stat('Rating', c.data.value!.n('rating') == 0 ? '-' : c.data.value!.n('rating').toStringAsFixed(1), Icons.star_outline), stat('Pendapatan', rupiah(c.data.value!.n('pendapatan')), Icons.payments_outlined)]),
              const SectionTitle('Antrean hari ini'),
              if (asList(c.data.value!['today']).isEmpty) const Padding(padding: EdgeInsets.all(16), child: Text('Tidak ada konsultasi hari ini.', style: TextStyle(color: Colors.grey))),
              for (final x in asList(c.data.value!['today']))
                Card(
                  child: ListTile(
                    leading: Avatar(name: asMap(x['pasien_id']).s('nama')),
                    title: Text(asMap(x['pasien_id']).s('nama')),
                    subtitle: Text('${fmtTime(x['tanggal'])} WIB • ${x.s('keluhan')}', maxLines: 1, overflow: TextOverflow.ellipsis),
                    trailing: StatusChip(x.s('status')),
                    onTap: () => Get.toNamed(AppRoutes.consultation, arguments: x['_id'].toString()),
                  ),
                ),
            ]),
          ),
        ));
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
        title: const Text('Tambah jadwal praktik'),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            DropdownButtonFormField<String>(initialValue: clinic, decoration: const InputDecoration(labelText: 'Klinik'), items: [for (final k in clinics) DropdownMenuItem(value: k['_id'].toString(), child: Text('${k['nama']}'))], onChanged: (v) => clinic = v),
            DropdownButtonFormField<String>(initialValue: day, decoration: const InputDecoration(labelText: 'Hari'), items: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(), onChanged: (v) => day = v ?? day),
            ListTile(contentPadding: EdgeInsets.zero, title: const Text('Mulai'), trailing: Text(start.format(ctx)), onTap: () async { final t = await showTimePicker(context: ctx, initialTime: start); if (t != null) setState(() => start = t); }),
            ListTile(contentPadding: EdgeInsets.zero, title: const Text('Selesai'), trailing: Text(end.format(ctx)), onTap: () async { final t = await showTimePicker(context: ctx, initialTime: end); if (t != null) setState(() => end = t); }),
            DropdownButtonFormField<int>(initialValue: duration, decoration: const InputDecoration(labelText: 'Durasi per sesi'), items: [15, 20, 30, 45, 60].map((d) => DropdownMenuItem(value: d, child: Text('$d menit'))).toList(), onChanged: (v) => duration = v ?? 30),
          ]),
        ),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(onPressed: () => Get.back(result: true), child: const Text('Simpan'))],
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
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.add(context), icon: const Icon(Icons.add), label: const Text('Jadwal')),
      body: Obx(() => AsyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada jadwal praktik.\nTambahkan agar pasien dapat memesan.',
            emptyIcon: Icons.calendar_today_outlined,
            onRetry: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 90),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final s = c.data.value![i];
                return Dismissible(
                  key: ValueKey(s['_id']),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (_) => confirm('Hapus jadwal', 'Jadwal ini akan dihapus.', ok: 'Hapus'),
                  background: Container(color: Colors.red, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.delete, color: Colors.white)),
                  onDismissed: (_) => c.remove(s['_id'].toString()),
                  child: Card(
                    child: SwitchListTile(
                      title: Text('${s.s('hari')} • ${s.s('jam_mulai')}–${s.s('jam_selesai')}'),
                      subtitle: Text('${asMap(s['klinik_id']).s('nama')} • ${s.n('durasi_menit', 30).toInt()} menit/sesi'),
                      value: s['is_active'] == true,
                      onChanged: (v) => c.toggle(s, v),
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
      title: const Text('Pilih obat'),
      content: SizedBox(
        width: double.maxFinite,
        height: 360,
        child: Column(children: [
          TextField(controller: search, onChanged: (_) => doSearch(), decoration: const InputDecoration(prefixIcon: Icon(Icons.search), hintText: 'Cari obat')),
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
        TextField(controller: dose, decoration: const InputDecoration(labelText: 'Dosis')),
        TextField(controller: qty, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Jumlah (${picked.s('satuan')})')),
        TextField(controller: rule, decoration: const InputDecoration(labelText: 'Aturan pakai')),
      ]),
      actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(onPressed: () => Get.back(result: true), child: const Text('Tambah'))],
    ));
    if (ok != true) return;
    items.add({'obat_id': picked['_id'].toString(), 'nama': picked.s('nama'), 'dosis': dose.text.trim(), 'jumlah': int.tryParse(qty.text) ?? 1, 'aturan_pakai': rule.text.trim()});
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
    return Scaffold(
      appBar: AppBar(title: const Text('Selesaikan Konsultasi')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        f(c.diagnosis, 'Diagnosa *', lines: 2),
        f(c.action, 'Tindakan'),
        f(c.notes, 'Catatan dokter', lines: 3),
        Row(children: [Expanded(child: f(c.bp, 'Tekanan darah')), const SizedBox(width: 12), Expanded(child: f(c.temp, 'Suhu (°C)', type: TextInputType.number))]),
        Row(children: [Expanded(child: f(c.height, 'Tinggi (cm)', type: TextInputType.number)), const SizedBox(width: 12), Expanded(child: f(c.weight, 'Berat (kg)', type: TextInputType.number))]),
        f(c.allergies, 'Alergi (pisahkan dengan koma)'),
        const SectionTitle('Resep'),
        Obx(() => Column(children: [
              for (var i = 0; i < c.items.length; i++)
                Card(
                  child: ListTile(
                    title: Text(c.items[i]['nama'].toString()),
                    subtitle: Text('${c.items[i]['dosis']} • ${c.items[i]['jumlah']} unit • ${c.items[i]['aturan_pakai']}'),
                    trailing: IconButton(icon: const Icon(Icons.delete_outline), onPressed: () => c.items.removeAt(i)),
                  ),
                ),
            ])),
        OutlinedButton.icon(onPressed: c.addDrug, icon: const Icon(Icons.add), label: const Text('Tambah obat')),
        const SizedBox(height: 12),
        f(c.prescriptionNote, 'Catatan resep (opsional)'),
        const SizedBox(height: 8),
        Obx(() => FilledButton(onPressed: c.saving.value ? null : c.submit, style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)), child: c.saving.value ? const CircularProgressIndicator() : const Text('Simpan & selesai'))),
      ]),
    );
  }
}
