import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';

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

      await tester.ensureVisible(find.text('Simpan & selesai'));
      await tester.tap(find.text('Simpan & selesai'));
      await tester.pump();
      expect(env.snackShown('Diagnosa wajib diisi'), isTrue);
      expect(env.api.calls.where((c) => c.contains('/complete')), isEmpty);

      await tester.enterText(find.widgetWithText(TextField, 'Diagnosa *'), 'Demam viral');
      await tester.enterText(find.widgetWithText(TextField, 'Suhu (°C)'), '38.5');
      await tester.enterText(find.widgetWithText(TextField, 'Alergi (pisahkan dengan koma)'), 'Penisilin, Debu');
      await tester.ensureVisible(find.text('Simpan & selesai'));
      await tester.tap(find.text('Simpan & selesai'));
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
      await tester.tap(find.widgetWithText(TextButton, 'Tolak').last);
      await tester.pumpAndSettle();
      expect(env.api.bodies['POST /admins/manage/verify/farmasi/a1']!.single, {'approve': false});
    });
  });
}
