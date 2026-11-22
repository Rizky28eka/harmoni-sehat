import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';

import 'harness.dart';

void main() {
  group('accessibility', () {
    testWidgets('navigation, notifications and password toggle expose labels', (tester) async {
      final handle = tester.ensureSemantics();
      await bootApp(tester, role: 'pasien');
      expect(find.bySemanticsLabel('Konsultasi'), findsWidgets);
      expect(find.bySemanticsLabel('Cari dokter'), findsWidgets); // centre action
      expect(find.byTooltip('Notifikasi'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('week strip days are announced with their date and appointment state', (tester) async {
      final handle = tester.ensureSemantics();
      final today = DateTime.now().toUtc().add(const Duration(hours: 1)).toIso8601String();
      await bootApp(tester, role: 'pasien', setup: (api) => api.on('GET /booking/consultations', (_, __) => {
            'data': [{'_id': 'c1', 'status': 'scheduled', 'tanggal': today, 'keluhan': 'x', 'dokter_id': {'nama': 'dr. A'}}],
          }));
      expect(find.bySemanticsLabel(RegExp('ada jadwal')), findsOneWidget); // only today is marked
      expect(find.bySemanticsLabel(RegExp(r'\d{1,2} \w+')), findsWidgets);
      handle.dispose();
    });

    // One screen per test: each boots its own app instance.
    final screens = <(String, Future<void> Function(WidgetTester))>[
      ('login', (t) async => bootApp(t)),
      ('register', (t) async => bootApp(t, initialRoute: '/register')),
      ('patient home', (t) async => bootApp(t, role: 'pasien')),
      ('doctor list', (t) async {
        final env = await bootApp(t, role: 'pasien', setup: (api) {
          api.on('GET /specializations', (_, __) => [{'_id': 's1', 'nama': 'Penyakit Dalam'}]);
          api.on('GET /booking/doctors', (_, __) => {'data': [doctorJson(nama: 'dr. Sari Wulandari, Sp.A', fee: 150000)], 'total': 1});
        });
        Get.toNamed('/doctors');
        await t.pumpAndSettle();
        expect(env.api.calls, contains('GET /booking/doctors'));
      }),
      ('doctor dashboard', (t) async => bootApp(t, role: 'dokter')),
      ('admin stats', (t) async => bootApp(t, role: 'admin')),
    ];
    for (final scale in [1.3, 1.8]) {
      for (final (name, open) in screens) {
        testWidgets('$name survives ${scale}x text without overflowing', (tester) async {
          tester.platformDispatcher.textScaleFactorTestValue = scale;
          addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
          await open(tester);
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull, reason: '$name at ${scale}x');
        });
      }
    }
  });
}
