import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:harmoni_sehat_frontend/core/format.dart';
import 'package:harmoni_sehat_frontend/core/session.dart';
import 'package:harmoni_sehat_frontend/core/ui.dart';
import 'package:harmoni_sehat_frontend/features/auth/auth_controller.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() {
  setUpAll(() async => initializeDateFormatting('id_ID'));

  group('validators', () {
    test('password policy matches the backend', () {
      expect(validatePassword('Passw0rd!x'), isNull);
      for (final bad in ['Sh0rt!x', 'nouppercase1!', 'NOLOWERCASE1!', 'NoDigits!!', 'NoSymbol123', '']) {
        expect(validatePassword(bad), isNotNull, reason: bad);
      }
    });
    test('email', () {
      expect(validateEmail('a@b.co'), isNull);
      expect(validateEmail('nope'), isNotNull);
      expect(validateEmail(null), isNotNull);
    });
    test('required', () {
      expect(validateRequired(' ', 'Nama'), 'Nama wajib diisi');
      expect(validateRequired('x'), isNull);
    });
  });

  group('routing & parsing', () {
    test('home route per role', () {
      expect(homeRouteFor('pasien'), '/pasien');
      expect(homeRouteFor('dokter'), '/dokter');
      expect(homeRouteFor('farmasi'), '/farmasi');
      expect(homeRouteFor('admin'), '/admin');
      expect(homeRouteFor('superadmin'), '/admin');
      expect(homeRouteFor('wat'), '/login');
    });
    test('AppUser accepts populated and plain roles', () {
      expect(AppUser.fromJson({'_id': '1', 'email': 'a', 'role': {'nama_peran': 'dokter'}}).role, 'dokter');
      expect(AppUser.fromJson({'id': '2', 'email': 'a', 'role': 'pasien'}).role, 'pasien');
    });
    test('json helpers are null-safe', () {
      final m = <String, dynamic>{'a': 3, 'b': '4.5', 'c': {'x': 1}, 'd': [{'y': 1}, 'bad']};
      expect(m.n('a'), 3);
      expect(m.n('b'), 4.5);
      expect(m.n('zzz'), 0);
      expect(m.s('zzz', 'dflt'), 'dflt');
      expect(m.m('c'), {'x': 1});
      expect(m.m('nope'), isEmpty);
      expect(m.l('d'), [{'y': 1}]);
      expect(asList(null), isEmpty);
    });
    test('rupiah formatting', () {
      expect(rupiah(150000).replaceAll(' ', ' '), 'Rp 150.000');
      expect(rupiah(null).replaceAll(' ', ' '), 'Rp 0');
    });
  });

  group('widgets', () {
    testWidgets('AsyncBody shows loading, error with retry, empty and content', (tester) async {
      var retried = false;
      Widget host({bool loading = false, String? error, bool empty = false}) => MaterialApp(
            home: Scaffold(body: AsyncBody(loading: loading, error: error, isEmpty: empty, onRetry: () => retried = true, emptyText: 'Kosong', child: const Text('Konten'))),
          );

      await tester.pumpWidget(host(loading: true));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      await tester.pumpWidget(host(error: 'Gagal'));
      expect(find.text('Gagal'), findsOneWidget);
      await tester.tap(find.text('Coba lagi'));
      expect(retried, isTrue);

      await tester.pumpWidget(host(empty: true));
      expect(find.text('Kosong'), findsOneWidget);

      await tester.pumpWidget(host());
      expect(find.text('Konten'), findsOneWidget);
    });

    testWidgets('StatusChip localises known statuses', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: Column(children: [StatusChip('scheduled'), StatusChip('weird')]))));
      expect(find.text('Terjadwal'), findsOneWidget);
      expect(find.text('weird'), findsOneWidget);
    });
  });
}
