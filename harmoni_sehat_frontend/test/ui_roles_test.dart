import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import 'package:harmoni_sehat_frontend/features/doctor/doctor_shell.dart' show CompleteConsultationController;

import 'harness.dart';

void main() {
  group('doctor', () {
    testWidgets('home shows the day queue and stats', (tester) async {
      await bootApp(tester, role: 'dokter', setup: (api) {
        api.on('GET /booking/my/summary', (_, __) => {
              'today': [{'_id': 'c1', 'status': 'scheduled', 'tanggal': DateTime.now().toUtc().toIso8601String(), 'keluhan': 'Batuk berdahak', 'pasien_id': {'nama': 'Siti Aminah'}}],
              'upcoming': 4, 'completed': 12, 'rating': 4.8, 'pendapatan': 1500000,
            });
      });
      expect(find.text('Siti Aminah'), findsOneWidget);
      expect(find.text('4'), findsOneWidget);
      expect(find.text('12'), findsOneWidget);
      expect(find.text('4.8'), findsOneWidget);
      expect(find.textContaining('1.500.000'), findsOneWidget);
    });

    testWidgets('adds a practice schedule through the dialog', (tester) async {
      final env = await bootApp(tester, role: 'dokter');
      env.api.on('GET /clinics', (_, __) => [{'_id': 'k1', 'nama': 'Klinik Sehat'}]);
      env.api.on('POST /booking/my/schedules', (b, __) => {'_id': 's1'});
      await tester.tap(find.text('Jadwal').last);
      await tester.pumpAndSettle();
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();
      expect(find.text('Tambah jadwal praktik'), findsOneWidget);
      await tester.tap(find.text('Simpan'));
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /booking/my/schedules']!.single, {'klinik_id': 'k1', 'hari': 'Senin', 'jam_mulai': '09:00', 'jam_selesai': '12:00', 'durasi_menit': 30});
    });

    testWidgets('completing a consultation requires a diagnosis, then saves it', (tester) async {
      final env = await bootApp(tester, role: 'dokter');
      env.api.on('POST /booking/consultations/c1/complete', (b, __) => {});
      Get.toNamed('/doctor/complete', arguments: 'c1');
      await tester.pumpAndSettle();

      // The form is a lazy list of sections: bring a widget on screen by scrolling whichever way it is.
      Future<void> reveal(Finder f) async {
        final scroll = find.byType(Scrollable).first;
        for (final dy in [300.0, -300.0]) {
          try {
            await tester.scrollUntilVisible(f, dy, scrollable: scroll, maxScrolls: 20);
            await tester.ensureVisible(f); // fully on screen, not just barely visible
            await tester.pump();
            return;
          } catch (_) {}
        }
        fail('Could not reveal $f');
      }

      await reveal(find.text('Simpan & selesai'));
      await tester.tap(find.text('Simpan & selesai'));
      await tester.pump();
      expect(env.snackShown('Diagnosa wajib diisi'), isTrue);
      expect(env.api.calls.where((c) => c.contains('/complete')), isEmpty);

      for (final (label, text) in [('Diagnosa *', 'Demam viral'), ('Suhu (°C)', '38.5'), ('Alergi (pisahkan dengan koma)', 'Penisilin, Debu')]) {
        await reveal(find.widgetWithText(TextField, label));
        await tester.enterText(find.widgetWithText(TextField, label), text);
      }
      await reveal(find.text('Simpan & selesai'));
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -150)); // clear the bottom edge
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(FilledButton, 'Simpan & selesai'));
      await tester.pumpAndSettle();
      final body = env.api.bodies['POST /booking/consultations/c1/complete']!.single!;
      expect(body['diagnosa'], 'Demam viral');
      expect(body['suhu_tubuh'], 38.5);
      expect(body['alergi'], ['Penisilin', 'Debu']);
      expect(body.containsKey('resep'), isFalse);
    });
  });

  group('pharmacist', () {
    testWidgets('ships a paid order with a tracking number', (tester) async {
      final order = {
        '_id': 'o1', 'kode_pesanan': 'ORD-1', 'status': 'processing', 'payment_status': 'paid', 'total_harga': 20000, 'createdAt': DateTime.now().toIso8601String(),
        'alamat_pengiriman': 'Jl. Mawar 1', 'pasien_id': {'nama': 'Budi', 'no_telepon': '0812'},
        'detail': [{'obat_id': {'nama': 'Paracetamol'}, 'jumlah': 2, 'harga_satuan': 5000, 'subtotal': 10000}],
      };
      final env = await bootApp(tester, role: 'farmasi', setup: (api) => api.on('GET /shop/orders', (_, q) => {'data': [order]}));
      expect(find.text('ORD-1'), findsOneWidget);
      env.api.on('GET /shop/orders/o1', (_, __) => order);
      env.api.on('POST /shop/orders/o1/advance', (b, __) => {});
      await tester.tap(find.text('ORD-1'));
      await tester.pumpAndSettle();
      expect(find.text('Kirim pesanan'), findsOneWidget);
      await tester.tap(find.text('Kirim pesanan'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), 'JNE123');
      await tester.tap(find.widgetWithText(FilledButton, 'Kirim'));
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /shop/orders/o1/advance']!.single, {'no_resi': 'JNE123'});
    });

    testWidgets('stock tab flags low stock', (tester) async {
      await bootApp(tester, role: 'farmasi', setup: (api) => api.on('GET /drugs', (_, __) => [
            {'_id': 'a', 'nama': 'Amoxicillin', 'harga': 18000, 'stok': 4, 'satuan': 'strip', 'tgl_kadaluarsa': '2030-01-01T00:00:00.000Z'},
            {'_id': 'b', 'nama': 'Vitamin C', 'harga': 25000, 'stok': 80, 'satuan': 'botol', 'tgl_kadaluarsa': '2030-01-01T00:00:00.000Z'},
          ]));
      await tester.tap(find.text('Stok').last);
      await tester.pumpAndSettle();
      final low = tester.widget<Text>(find.text('4'));
      expect(low.style?.color, Colors.red);
      final ok = tester.widget<Text>(find.text('80'));
      expect(ok.style?.color, isNull);
    });
  });

  group('admin', () {
    testWidgets('approves and rejects verification requests', (tester) async {
      final pending = {'dokter': [{'_id': 'd1', 'nama': 'dr. Rina', 'nomor_str': 'STR-1', 'user_id': {'email': 'rina@x.co'}}], 'apoteker': [{'_id': 'a1', 'nama': 'Apt. Joko', 'nomor_sipa': 'SIPA-9', 'user_id': {'email': 'joko@x.co'}}]};
      final env = await bootApp(tester, role: 'admin', setup: (api) => api.on('GET /admins/manage/pending-verifications', (_, __) => pending));
      env.api.on('POST /admins/manage/verify/dokter/d1', (_, __) => {});
      env.api.on('POST /admins/manage/verify/farmasi/a1', (_, __) => {});
      await tester.tap(find.text('Verifikasi').last);
      await tester.pumpAndSettle();
      expect(find.text('dr. Rina'), findsOneWidget);
      expect(find.textContaining('SIPA-9'), findsOneWidget);

      await tester.tap(find.widgetWithText(FilledButton, 'Setujui').first);
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /admins/manage/verify/dokter/d1']!.single, {'approve': true});
      // Rejecting asks for a reason that is sent to the applicant.
      await tester.tap(find.widgetWithText(TextButton, 'Tolak').last);
      await tester.pumpAndSettle();
      expect(find.text('Tolak verifikasi'), findsOneWidget);
      await tester.enterText(find.byType(TextField).last, 'Nomor SIPA tidak terbaca');
      await tester.tap(find.widgetWithText(FilledButton, 'Tolak'));
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /admins/manage/verify/farmasi/a1']!.single, {'approve': false, 'reason': 'Nomor SIPA tidak terbaca'});
    });
  });

  group('ux improvements', () {
    testWidgets('shows an offline banner while the API is unreachable', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      expect(find.text('Anda sedang offline. Data mungkin tidak terbaru.'), findsNothing);
      env.api.offline.value = true;
      await tester.pumpAndSettle();
      expect(find.text('Anda sedang offline. Data mungkin tidak terbaru.'), findsOneWidget);
      env.api.offline.value = false;
      await tester.pumpAndSettle();
      expect(find.text('Anda sedang offline. Data mungkin tidak terbaru.'), findsNothing);
    });

    testWidgets('an existing reminder can be edited', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      env.api.on('GET /me/reminders', (_, __) => [{'_id': 'r1', 'nama_obat': 'Amoxicillin', 'dosis': '500mg', 'jam': ['08:00', '20:00'], 'is_active': true}]);
      env.api.on('PUT /me/reminders/r1', (b, __) => {});
      Get.toNamed('/reminders');
      await tester.pumpAndSettle();
      await tester.tap(find.text('Amoxicillin • 500mg'));
      await tester.pumpAndSettle();
      expect(find.text('Ubah pengingat'), findsOneWidget);
      expect(find.widgetWithText(TextField, 'Amoxicillin'), findsOneWidget); // prefilled
      await tester.enterText(find.widgetWithText(TextField, '500mg'), '250mg');
      await tester.tap(find.widgetWithText(FilledButton, 'Simpan'));
      await tester.pumpAndSettle();
      final body = env.api.bodies['PUT /me/reminders/r1']!.single!;
      expect(body['dosis'], '250mg');
      expect(body['jam'], ['08:00', '20:00']);
    });

    testWidgets('lists notifications under day headings and deletes by swiping', (tester) async {
      final now = DateTime.now();
      final env = await bootApp(tester, role: 'pasien', setup: (api) => api.on('GET /notifications', (_, __) => [
            {'_id': 'n1', 'judul': 'Pembayaran diterima', 'isi': 'ok', 'tipe': 'success', 'is_read': true, 'createdAt': now.toIso8601String()},
            {'_id': 'n2', 'judul': 'Konsultasi terjadwal', 'isi': 'ok', 'tipe': 'info', 'is_read': true, 'createdAt': now.subtract(const Duration(days: 1)).toIso8601String()},
          ]));
      env.api.on('DELETE /notifications/n1', (_, __) => {});
      Get.toNamed('/notifications');
      await tester.pumpAndSettle();
      expect(find.text('Hari ini'), findsOneWidget);
      expect(find.text('Kemarin'), findsOneWidget);
      await tester.drag(find.text('Pembayaran diterima'), const Offset(-600, 0));
      await tester.pumpAndSettle();
      expect(env.api.calls, contains('DELETE /notifications/n1'));
      expect(find.text('Pembayaran diterima'), findsNothing);
    });

    testWidgets('pharmacist sees a low-stock alert that filters the list', (tester) async {
      await bootApp(tester, role: 'farmasi', setup: (api) => api.on('GET /drugs', (_, __) => [
            {'_id': 'a', 'nama': 'Amoxicillin', 'harga': 18000, 'stok': 4, 'satuan': 'strip', 'tgl_kadaluarsa': '2030-01-01T00:00:00.000Z'},
            {'_id': 'b', 'nama': 'Vitamin C', 'harga': 25000, 'stok': 80, 'satuan': 'botol', 'tgl_kadaluarsa': '2030-01-01T00:00:00.000Z'},
          ]));
      await tester.tap(find.text('Stok').last);
      await tester.pumpAndSettle();
      expect(find.text('1 obat stok menipis'), findsOneWidget);
      expect(find.text('Vitamin C'), findsOneWidget);
      await tester.tap(find.text('1 obat stok menipis'));
      await tester.pumpAndSettle();
      expect(find.text('Vitamin C'), findsNothing);
      expect(find.text('Amoxicillin'), findsOneWidget);
    });

    testWidgets('chat marks day changes with a separator', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      final now = DateTime.now();
      env.api.on('GET /booking/consultations/c1/messages', (_, __) => [
            {'_id': 'm1', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Kemarin sore', 'tipe': 'text', 'timestamp': now.subtract(const Duration(days: 1)).toIso8601String()},
            {'_id': 'm2', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Hari ini', 'tipe': 'text', 'timestamp': now.toIso8601String()},
          ]);
      Get.toNamed('/chat', arguments: {'id': 'c1', 'title': 'dr. Andi'});
      await tester.pumpAndSettle();
      expect(find.text('Kemarin'), findsOneWidget);
      expect(find.text('Hari ini'), findsNWidgets(2)); // the separator pill and the message itself
    });

    testWidgets('the doctor form offers recently used diagnoses as chips', (tester) async {
      final env = await bootApp(tester, role: 'dokter');
      GetStorage().remove('recent_diagnoses'); // other tests also complete consultations and share this store
      env.api.on('POST /booking/consultations/c1/complete', (b, __) => {});
      Get.toNamed('/doctor/complete', arguments: 'c1');
      await tester.pumpAndSettle();
      expect(find.byType(ActionChip), findsNothing);
      await tester.enterText(find.widgetWithText(TextField, 'Diagnosa *'), 'Faringitis akut');
      await tester.scrollUntilVisible(find.text('Simpan & selesai'), 300, scrollable: find.byType(Scrollable).first);
      await tester.ensureVisible(find.text('Simpan & selesai'));
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -150));
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(FilledButton, 'Simpan & selesai'));
      await tester.pumpAndSettle();
      expect(env.api.calls, contains('POST /booking/consultations/c1/complete'));

      Get.toNamed('/doctor/complete', arguments: 'c2');
      await tester.pumpAndSettle();
      expect(find.widgetWithText(ActionChip, 'Faringitis akut'), findsOneWidget);
    });

    testWidgets('chat flags where the unread messages begin', (tester) async {
      final env = await bootApp(tester, role: 'pasien');
      final now = DateTime.now().toIso8601String();
      env.api.on('GET /booking/consultations/c1/messages', (_, __) => [
            {'_id': 'm1', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Sudah dibaca', 'tipe': 'text', 'timestamp': now, 'is_read': true},
            {'_id': 'm2', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Belum dibaca satu', 'tipe': 'text', 'timestamp': now, 'is_read': false},
            {'_id': 'm3', 'konsultasi_id': 'c1', 'pengirim_id': 'u9', 'isi': 'Belum dibaca dua', 'tipe': 'text', 'timestamp': now, 'is_read': false},
          ]);
      Get.toNamed('/chat', arguments: {'id': 'c1', 'title': 'dr. Andi'});
      await tester.pumpAndSettle();
      expect(find.text('Pesan baru'), findsOneWidget);
      // The marker sits directly above the first unread message, not the read one.
      final markerY = tester.getTopLeft(find.text('Pesan baru')).dy;
      expect(markerY, greaterThan(tester.getTopLeft(find.text('Sudah dibaca')).dy));
      expect(markerY, lessThan(tester.getTopLeft(find.text('Belum dibaca satu')).dy));
    });

    testWidgets('a prescription can be saved as a template and re-applied', (tester) async {
      final env = await bootApp(tester, role: 'dokter');
      GetStorage().remove('rx_templates');
      env.api.on('POST /booking/consultations/c1/complete', (b, __) => {});
      Get.toNamed('/doctor/complete', arguments: 'c1');
      await tester.pumpAndSettle();
      final c = Get.find<CompleteConsultationController>();
      c.items.add({'obat_id': 'dr1', 'nama': 'Paracetamol', 'dosis': '500mg', 'jumlah': 10, 'aturan_pakai': '3x1'});
      await tester.pumpAndSettle();

      final save = find.text('Simpan sebagai template');
      await tester.scrollUntilVisible(save, 300, scrollable: find.byType(Scrollable).first);
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -200)); // clear the bottom edge
      await tester.pumpAndSettle();
      await tester.tap(save);
      await tester.pumpAndSettle();
      await tester.enterText(find.widgetWithText(TextField, 'Nama template'), 'Demam ringan');
      await tester.tap(find.widgetWithText(FilledButton, 'Simpan'));
      await tester.pumpAndSettle();

      // Clear the list, then apply the template from its chip.
      c.items.clear();
      await tester.pumpAndSettle();
      final chip = find.widgetWithText(InputChip, 'Demam ringan');
      await tester.scrollUntilVisible(chip, -300, scrollable: find.byType(Scrollable).first);
      await tester.tap(chip);
      await tester.pumpAndSettle();
      expect(c.items.single['nama'], 'Paracetamol');
      expect(c.items.single['jumlah'], 10);
    });
  });
}
