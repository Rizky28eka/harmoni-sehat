import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:harmoni_sehat_frontend/core/api_client.dart';
import 'package:harmoni_sehat_frontend/core/format.dart';

import 'harness.dart';

Map<String, dynamic> authBody(String role) => {
      'status': 'success',
      'token': 'access-1',
      'refreshToken': 'refresh-1',
      'data': {'user': {'_id': 'u1', 'email': 'a@b.co', 'role': {'nama_peran': role}}},
    };

void main() {
  testWidgets('login validates input before calling the API', (tester) async {
    final env = await bootApp(tester);
    await tester.tap(find.widgetWithText(ElevatedButton, 'Masuk').first);
    await tester.pump();
    expect(find.text('Email tidak valid'), findsOneWidget);
    expect(env.api.calls.where((c) => c.contains('/auth/login')), isEmpty);
  });

  testWidgets('login with valid credentials stores the session and opens the role home', (tester) async {
    final env = await bootApp(tester);
    env.api.on('POST /auth/login', (_, __) => authBody('pasien'));
    env.api.on('GET /booking/consultations', (_, __) => {'data': []});
    env.api.on('GET /health-articles', (_, __) => {'data': []});

    await tester.enterText(find.byType(TextFormField).at(0), 'a@b.co');
    await tester.enterText(find.byType(TextFormField).at(1), 'Passw0rd!x');
    await tester.tap(find.widgetWithText(ElevatedButton, 'Masuk').first);
    await tester.pumpAndSettle();

    expect(env.api.bodies['POST /auth/login']!.single, {'email': 'a@b.co', 'password': 'Passw0rd!x'});
    expect(env.session.accessToken, 'access-1');
    expect(env.session.refreshToken, 'refresh-1');
    expect(env.session.role, 'pasien');
    expect(env.socket.connectCalled, isTrue);
    expect(find.text('Beranda'), findsWidgets); // patient shell reached
  });

  testWidgets('a wrong password shows the server message and stays on login', (tester) async {
    final env = await bootApp(tester);
    env.api.on('POST /auth/login', (_, __) async => throw const ApiException('Incorrect email or password', statusCode: 401));
    await tester.enterText(find.byType(TextFormField).at(0), 'a@b.co');
    await tester.enterText(find.byType(TextFormField).at(1), 'Passw0rd!x');
    await tester.tap(find.widgetWithText(ElevatedButton, 'Masuk').first);
    await tester.pumpAndSettle();
    expect(env.snackShown('Email atau password salah'), isTrue, reason: 'server message translated to the active language');
    expect(env.session.isLoggedIn, isFalse);
    expect(find.text('Masuk'), findsWidgets);
  });

  testWidgets('registration shows role-specific fields and validates the NIK', (tester) async {
    final env = await bootApp(tester, initialRoute: '/register');
    expect(find.text('NIK (16 digit)'), findsOneWidget);
    expect(find.text('Nomor STR'), findsNothing);

    await tester.tap(find.text('Dokter'));
    await tester.pumpAndSettle();
    expect(find.text('Nomor STR'), findsOneWidget);
    expect(find.text('NIK (16 digit)'), findsNothing);

    await tester.tap(find.text('Pasien'));
    await tester.pumpAndSettle();
    await tester.enterText(find.widgetWithText(TextFormField, 'NIK (16 digit)'), '123');
    await tester.ensureVisible(find.widgetWithText(ElevatedButton, 'Daftar'));
    await tester.tap(find.widgetWithText(ElevatedButton, 'Daftar'));
    await tester.pump();
    expect(find.text('NIK harus 16 digit'), findsOneWidget);
    expect(env.api.calls.where((c) => c.contains('/auth/register')), isEmpty);
  });

  testWidgets('registers a doctor in one request and shows the verification notice', (tester) async {
    final env = await bootApp(tester, initialRoute: '/register');
    env.api.on('GET /specializations', (_, __) => [{'_id': 's1', 'nama': 'Umum'}]);
    env.api.on('POST /auth/register', (_, __) => authBody('dokter'));
    env.api.on('GET /auth/me', (_, __) => {'user': {'_id': 'u1', 'email': 'rina@x.co', 'role': {'nama_peran': 'dokter'}}, 'profile': {'_id': 'p9', 'nama': 'dr. Rina', 'is_verified': false}});
    env.api.on('GET /booking/my/summary', (_, __) => {'today': [], 'upcoming': 0, 'completed': 0, 'rating': 0, 'pendapatan': 0});

    await tester.tap(find.text('Dokter'));
    await tester.pumpAndSettle();
    await tester.enterText(find.widgetWithText(TextFormField, 'Nama lengkap'), 'dr. Rina');
    await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'rina@x.co');
    await tester.enterText(find.widgetWithText(TextFormField, 'Password'), 'Passw0rd!x');
    await tester.enterText(find.widgetWithText(TextFormField, 'Nomor STR'), 'STR-1');
    await tester.enterText(find.widgetWithText(TextFormField, 'Biaya konsultasi (Rp)'), '100000');
    await tester.ensureVisible(find.widgetWithText(ElevatedButton, 'Daftar'));
    await tester.tap(find.widgetWithText(ElevatedButton, 'Daftar'));
    await tester.pumpAndSettle();

    final sent = env.api.bodies['POST /auth/register']!.single!;
    expect(sent['role'], 'dokter');
    expect(sent['nomor_str'], 'STR-1');
    expect(sent['biaya_konsultasi'], 100000);
    expect(sent.containsKey('nik'), isFalse);
    expect(env.snackShown('Akun dibuat. Menunggu verifikasi admin sebelum dapat digunakan penuh.'), isTrue);
    expect(env.session.role, 'dokter');
  });

  testWidgets('English locale renders translated labels', (tester) async {
    await bootApp(tester, locale: const Locale('en', 'US'));
    expect(find.text('Sign in'), findsWidgets);
    expect(find.text('Masuk'), findsNothing);
    expect(asMap(null), isEmpty);
  });
}
