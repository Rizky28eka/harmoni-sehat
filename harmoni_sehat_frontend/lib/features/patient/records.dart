import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/api_client.dart';
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
    return Obx(() => AsyncBody(
          loading: c.loading.value,
          error: c.error.value,
          isEmpty: (c.data.value ?? []).isEmpty,
          emptyText: 'Belum ada rekam medis.\nRekam medis dibuat dokter setelah konsultasi.',
          emptyIcon: Icons.folder_open_outlined,
          onRetry: c.load,
          child: RefreshIndicator(
            onRefresh: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final r = c.data.value![i];
                final dokter = asMap(r['dokter_id']);
                final vitals = [
                  if (r['tekanan_darah'] != null) 'TD ${r['tekanan_darah']}',
                  if (r['suhu_tubuh'] != null) '${r['suhu_tubuh']}°C',
                  if (r['berat_badan'] != null) '${r['berat_badan']} kg',
                ].join(' • ');
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Expanded(child: Text(r.s('diagnosis'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16))),
                        IconButton(tooltip: 'Ekspor PDF', icon: const Icon(Icons.picture_as_pdf_outlined), onPressed: () => c.exportPdf(r['_id'].toString())),
                      ]),
                      Text('${fmtDate(r['tanggal_rekam_medis'])}${dokter.isNotEmpty ? ' • ${dokter.s('nama')}' : ''}', style: const TextStyle(color: Colors.grey)),
                      if (vitals.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Text(vitals)),
                      if (r.s('catatan_dokter').isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Text(r.s('catatan_dokter'))),
                      if ((r['alergi'] as List?)?.isNotEmpty ?? false) Padding(padding: const EdgeInsets.only(top: 6), child: Text('Alergi: ${(r['alergi'] as List).join(', ')}', style: const TextStyle(color: Colors.red))),
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
  Future<List<Map<String, dynamic>>> fetch() async => asList(await _api.get('/me/reminders', cache: true));

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
        title: const Text('Pengingat obat'),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: name, decoration: const InputDecoration(labelText: 'Nama obat')),
            const SizedBox(height: 8),
            TextField(controller: dose, decoration: const InputDecoration(labelText: 'Dosis (opsional)')),
            const SizedBox(height: 12),
            Wrap(spacing: 8, children: [
              for (final t in times) InputChip(label: Text(t.format(ctx)), onDeleted: times.length > 1 ? () => setState(() => times.remove(t)) : null),
              ActionChip(
                avatar: const Icon(Icons.add_alarm, size: 18),
                label: const Text('Tambah jam'),
                onPressed: () async {
                  final t = await showTimePicker(context: ctx, initialTime: const TimeOfDay(hour: 12, minute: 0));
                  if (t != null) setState(() => times.add(t));
                },
              ),
            ]),
          ]),
        ),
        actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(onPressed: () => Get.back(result: true), child: const Text('Simpan'))],
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
      appBar: AppBar(title: const Text('Pengingat Obat')),
      floatingActionButton: FloatingActionButton.extended(onPressed: () => c.add(context), icon: const Icon(Icons.add), label: const Text('Tambah')),
      body: Obx(() => AsyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada pengingat',
            emptyIcon: Icons.alarm_off_outlined,
            onRetry: c.load,
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 90),
              itemCount: c.data.value!.length,
              itemBuilder: (_, i) {
                final r = c.data.value![i];
                return Dismissible(
                  key: ValueKey(r['_id']),
                  direction: DismissDirection.endToStart,
                  background: Container(color: Colors.red, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.delete, color: Colors.white)),
                  onDismissed: (_) => c.remove(r['_id'].toString()),
                  child: Card(
                    child: SwitchListTile(
                      title: Text('${r.s('nama_obat')}${r.s('dosis').isNotEmpty ? ' • ${r.s('dosis')}' : ''}'),
                      subtitle: Text((r['jam'] as List? ?? []).join('  ·  ')),
                      value: r['is_active'] == true,
                      onChanged: (v) => c.toggle(r, v),
                    ),
                  ),
                );
              },
            ),
          )),
    );
  }
}
