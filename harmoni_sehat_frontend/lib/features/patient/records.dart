import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';

import '../../core/api_client.dart';
import '../../core/reminder_scheduler.dart';
import '../../core/format.dart';
import '../../core/ui.dart';

class RecordsController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  @override
  Future<List<Map<String, dynamic>>> fetch() async => asList(await _api.get('/me/medical-timeline', cache: true));

  Future<void> exportPdf(String id) async {
    try {
      final r = asMap(await _api.get('/me/medical-records/$id/pdf-link'));
      await launchUrl(Uri.parse(r['url'].toString()), mode: LaunchMode.externalApplication);
    } catch (e) {
      showError(e);
    }
  }
}

class RecordsTab extends StatelessWidget {
  const RecordsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(RecordsController());
    return Obx(() => asyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: (c.data.value ?? []).isEmpty,
          emptyText: 'Belum ada rekam medis.\nRekam medis dibuat dokter setelah konsultasi.',
          emptyIcon: Icons.folder_open_rounded,
          onRetry: c.load,
          builder: () => RefreshIndicator(
            onRefresh: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final r = c.data.value![i];
                final dokter = asMap(r['dokter_id']);
                final tone = const [Tone.sky, Tone.mint, Tone.lilac, Tone.peach][i % 4];
                final ink = toneOf(context, tone).ink;
                final vitalPills = [
                  if (r['tekanan_darah'] != null) 'TD ${r['tekanan_darah']}',
                  if (r['suhu_tubuh'] != null) '${r['suhu_tubuh']}°C',
                  if (r['berat_badan'] != null) '${r['berat_badan']} kg',
                ];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SoftCard(
                    tone: tone,
                    variant: i,
                    radius: 28,
                    padding: const EdgeInsets.all(18),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        ToneIcon(Icons.description_rounded, tone: tone, size: 44),
                        const SizedBox(width: 12),
                        Expanded(child: Text(r.s('diagnosis'), style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: ink, letterSpacing: -0.3))),
                        IconButton(tooltip: 'Ekspor PDF'.tr, icon: Icon(Icons.picture_as_pdf_rounded, color: ink), onPressed: () => c.exportPdf(r['_id'].toString())),
                      ]),
                      const SizedBox(height: 6),
                      Text('${fmtDate(r['tanggal_rekam_medis'])}${dokter.isNotEmpty ? ' • ${dokter.s('nama')}' : ''}', style: TextStyle(color: ink.withValues(alpha: 0.8), fontWeight: FontWeight.w500, fontSize: 13)),
                      if (vitalPills.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Wrap(spacing: 8, runSpacing: 6, children: [for (final v in vitalPills) Pill(v, tone: tone)])),
                      if (r.s('catatan_dokter').isNotEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Text(r.s('catatan_dokter'), style: TextStyle(color: ink.withValues(alpha: 0.9), height: 1.4))),
                      if ((r['alergi'] as List?)?.isNotEmpty ?? false)
                        Padding(padding: const EdgeInsets.only(top: 12), child: Pill('${'Alergi'.tr}: ${(r['alergi'] as List).join(', ')}', tone: Tone.rose, icon: Icons.warning_amber_rounded)),
                    ]),
                  ),
                );
              },
            ),
          ),
        ));
  }
}

class RemindersController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  @override
  Future<List<Map<String, dynamic>>> fetch() async {
    final list = asList(await _api.get('/me/reminders', cache: true));
    // Keep on-device alarms in step with the server list (also works from the offline cache).
    Get.find<ReminderScheduler>().sync(list).catchError((_) => 0);
    return list;
  }

  Future<void> enableAlarms() async {
    final ok = await Get.find<ReminderScheduler>().requestPermission();
    ok ? showSuccess('Alarm pengingat aktif') : showError('Izin notifikasi ditolak. Aktifkan di pengaturan perangkat.');
    await load(silent: true);
  }

  Future<void> toggle(Map<String, dynamic> r, bool on) async {
    try {
      await _api.put('/me/reminders/${r['_id']}', data: {'is_active': on});
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }

  Future<void> remove(String id) async {
    try {
      await _api.delete('/me/reminders/$id');
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }

  Future<void> add(BuildContext context) async {
    final name = TextEditingController();
    final dose = TextEditingController();
    final times = <TimeOfDay>[const TimeOfDay(hour: 8, minute: 0)];
    final ok = await Get.dialog<bool>(StatefulBuilder(
      builder: (ctx, setState) => AlertDialog(
        title: Text('Pengingat obat'.tr),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: name, decoration: InputDecoration(labelText: 'Nama obat'.tr)),
            const SizedBox(height: 8),
            TextField(controller: dose, decoration: InputDecoration(labelText: 'Dosis (opsional)'.tr)),
            const SizedBox(height: 12),
            Wrap(spacing: 8, children: [
              for (final t in times) InputChip(label: Text(t.format(ctx)), onDeleted: times.length > 1 ? () => setState(() => times.remove(t)) : null),
              ActionChip(
                avatar: const Icon(Icons.add_alarm, size: 18),
                label: Text('Tambah jam'.tr),
                onPressed: () async {
                  final t = await showTimePicker(context: ctx, initialTime: const TimeOfDay(hour: 12, minute: 0));
                  if (t != null) setState(() => times.add(t));
                },
              ),
            ]),
          ]),
        ),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)), FilledButton(onPressed: () => Get.back(result: true), child: Text('Simpan'.tr))],
      ),
    ));
    if (ok != true || name.text.trim().isEmpty) return;
    String hhmm(TimeOfDay t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
    try {
      await _api.post('/me/reminders', data: {'nama_obat': name.text.trim(), if (dose.text.trim().isNotEmpty) 'dosis': dose.text.trim(), 'jam': times.map(hhmm).toList()});
      await load(silent: true);
    } catch (e) {
      showError(e);
    }
  }
}

class RemindersView extends StatelessWidget {
  const RemindersView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(RemindersController());
    return Scaffold(
      appBar: AppBar(title: Text('Pengingat Obat'.tr), actions: [IconButton(tooltip: 'Aktifkan alarm'.tr, icon: const Icon(Icons.notifications_active_outlined), onPressed: c.enableAlarms)]),
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.add(context), icon: const Icon(Icons.add), label: Text('Tambah'.tr)),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada pengingat',
            emptyIcon: Icons.alarm_off_outlined,
            onRetry: c.load,
            builder: () => ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final r = c.data.value![i];
                final active = r['is_active'] == true;
                return Dismissible(
                  key: ValueKey(r['_id']),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(color: AppColors.errorColor, borderRadius: BorderRadius.circular(26)),
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 24),
                    child: const Icon(Icons.delete_rounded, color: Colors.white, size: 26),
                  ),
                  onDismissed: (_) => c.remove(r['_id'].toString()),
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: SoftCard(
                      tone: active ? Tone.butter : Tone.slate,
                      variant: i,
                      radius: 26,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(children: [
                        ToneIcon(Icons.alarm_rounded, tone: active ? Tone.butter : Tone.slate, size: 46),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('${r.s('nama_obat')}${r.s('dosis').isNotEmpty ? ' • ${r.s('dosis')}' : ''}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15.5)),
                            const SizedBox(height: 6),
                            Wrap(spacing: 6, runSpacing: 4, children: [for (final t in (r['jam'] as List? ?? [])) Pill('$t', tone: active ? Tone.peach : Tone.slate, dense: true)]),
                          ]),
                        ),
                        Switch(value: active, onChanged: (v) => c.toggle(r, v)),
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
