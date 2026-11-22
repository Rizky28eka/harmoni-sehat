import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';
import 'package:harmoni_sehat_frontend/core/api_client.dart';
import 'package:harmoni_sehat_frontend/core/reminder_scheduler.dart';
import 'package:harmoni_sehat_frontend/core/session.dart';
import 'package:harmoni_sehat_frontend/core/socket_service.dart';
import 'package:harmoni_sehat_frontend/core/theme_controller.dart';
import 'package:harmoni_sehat_frontend/core/ui.dart';
import 'package:harmoni_sehat_frontend/core/translations.dart';
import 'package:harmoni_sehat_frontend/features/auth/auth_repository.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'test_helpers.dart';

typedef Handler = FutureOr<dynamic> Function(Map<String, dynamic>? body, Map<String, dynamic>? query);

/// In-memory API: routes are registered as `'GET /path'`. Unregistered routes fail loudly.
class FakeApi extends ApiClient {
  FakeApi(super.session) : super();
  final routes = <String, Handler>{};
  final calls = <String>[];
  final bodies = <String, List<Map<String, dynamic>?>>{};

  void on(String route, Handler h) => routes[route] = h;
  void ok(String route, dynamic data) => routes[route] = (_, __) => data;

  Future<dynamic> _run(String method, String path, {dynamic data, Map<String, dynamic>? query}) async {
    final key = '$method $path';
    calls.add(key);
    bodies.putIfAbsent(key, () => []).add(data is Map ? Map<String, dynamic>.from(data) : null);
    final h = routes[key];
    if (h == null) throw ApiException('No fake route for $key');
    return await h(data is Map ? Map<String, dynamic>.from(data) : null, query);
  }

  @override
  Future<dynamic> get(String path, {Map<String, dynamic>? query, bool cache = false}) => _run('GET', path, query: query);
  @override
  Future<dynamic> post(String path, {dynamic data}) => _run('POST', path, data: data);
  @override
  Future<dynamic> put(String path, {dynamic data}) => _run('PUT', path, data: data);
  @override
  Future<dynamic> delete(String path, {dynamic data}) => _run('DELETE', path, data: data);
  @override
  Future<Map<String, dynamic>> postRaw(String path, {dynamic data}) async => Map<String, dynamic>.from(await _run('POST', path, data: data) as Map);
  @override
  Future<dynamic> upload(String path, String filePath, {String field = 'file'}) => _run('POST', path);
}

class FakeSocket extends SocketService {
  FakeSocket(super.session);
  final sent = <Map<String, dynamic>>[];
  final chatCtl = StreamController<Map<String, dynamic>>.broadcast();
  bool connectCalled = false;

  @override
  void connect() => connectCalled = true;
  @override
  void disconnect() {}
  @override
  Stream<Map<String, dynamic>> get chatMessages => chatCtl.stream;
  @override
  Future<Map<String, dynamic>> joinChat(String consultationId) async => {'ok': true, 'status': 'scheduled'};
  @override
  Future<Map<String, dynamic>> sendMessage(String consultationId, String text, {String type = 'text', String? fileUrl}) async {
    sent.add({'id': consultationId, 'text': text, 'type': type});
    return {'ok': true};
  }

  @override
  void markRead(String consultationId) {}
  @override
  void setTyping(String consultationId, bool typing) {}
}

class FakeScheduler extends ReminderScheduler {
  final synced = <List<Map<String, dynamic>>>[];
  bool asked = false;
  @override
  Future<int> sync(List<Map<String, dynamic>> reminders) async {
    synced.add(reminders);
    return reminders.length;
  }

  @override
  Future<bool> requestPermission() async => asked = true;
  @override
  Future<void> clear() async {}
}

class TestEnv {
  late SessionService session;
  late FakeApi api;
  late FakeSocket socket;
  late FakeScheduler scheduler;
  final snacks = <({String title, String message})>[];
  bool snackShown(String text) => snacks.any((s) => s.message == text);
}

/// Boots the real app (routes, theme, translations, controllers) against fakes.
Future<TestEnv> bootApp(WidgetTester tester, {String? role, String? initialRoute, Locale locale = const Locale('id', 'ID'), Size size = const Size(420, 900), void Function(FakeApi api)? setup}) async {
  // Real file I/O must not run inside the widget tester's fake-async zone.
  await tester.runAsync(() async {
    await initStorage();
  });
  await initializeDateFormatting('id_ID');
  await initializeDateFormatting('en_US');
  Get.testMode = true;
  Get.reset();
  addTearDown(Get.reset);
  tester.view.physicalSize = size * 2;
  tester.view.devicePixelRatio = 2;
  addTearDown(tester.view.reset);

  final env = TestEnv();
  snackPresenter = (title, message, color) => env.snacks.add((title: title, message: message));
  env.session = SessionService(box: MemoryStore());
  await env.session.init();
  if (role != null) {
    await env.session.setSession(access: 'tok', refresh: 'ref', appUser: AppUser(id: 'u1', email: '$role@test.id', role: role));
    env.session.profile.value = {'_id': 'p1', 'nama': 'Budi Santoso', 'alamat': 'Jl. Mawar 1', 'is_verified': true};
  }
  Get.put<SessionService>(env.session, permanent: true);
  env.api = FakeApi(env.session);
  env.socket = FakeSocket(env.session);
  env.scheduler = FakeScheduler();
  Get.put<ApiClient>(env.api, permanent: true);
  Get.put<SocketService>(env.socket, permanent: true);
  Get.put(SettingsController(), permanent: true);
  Get.put<ReminderScheduler>(env.scheduler, permanent: true);
  Get.put(AuthRepository(env.api, env.session, env.socket), permanent: true);
  // Call plumbing is only exercised on device; the incoming-call listener stays inert here.
  Get.put(_NoCallService(env.socket), permanent: true);

  // Quiet defaults most shells query on start.
  env.api.on('GET /notifications/unread-count', (_, __) => {'count': 0});
  env.api.on('GET /auth/me', (_, __) => {'user': {'_id': 'u1', 'email': 'x@y.z', 'role': {'nama_peran': role ?? 'pasien'}}, 'profile': env.session.profile.value ?? {'_id': 'p1', 'nama': 'Budi Santoso'}});

  env.api.on('GET /booking/consultations', (_, __) => {'data': []});
  env.api.on('GET /health-articles', (_, __) => {'data': []});
  env.api.on('GET /notifications', (_, __) => []);
  env.api.on('GET /booking/my/summary', (_, __) => {'today': [], 'upcoming': 0, 'completed': 0, 'rating': 0, 'pendapatan': 0});
  env.api.on('GET /admins/manage/stats', (_, __) => {'pasien': 0, 'dokter': 0, 'apoteker': 0, 'pendapatan': 0, 'konsultasi': {}, 'pesanan': {}});
  env.api.on('GET /admins/manage/pending-verifications', (_, __) => {'dokter': [], 'apoteker': []});
  env.api.on('GET /shop/orders', (_, __) => {'data': []});
  env.api.on('GET /drugs', (_, __) => []);
  env.api.on('GET /me/medical-timeline', (_, __) => []);
  env.api.on('GET /booking/my/schedules', (_, __) => []);

  setup?.call(env.api);

  final start = initialRoute ?? switch (role) { 'pasien' => '/pasien', 'dokter' => '/dokter', 'farmasi' => '/farmasi', 'admin' => '/admin', _ => '/login' };
  await tester.pumpWidget(GetMaterialApp(
    translations: AppTranslations(),
    locale: locale,
    fallbackLocale: const Locale('id', 'ID'),
    theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
    initialRoute: start,
    getPages: AppPages.pages,
    debugShowCheckedModeBanner: false,
  ));
  await tester.pumpAndSettle();
  return env;
}

class _NoCallService extends GetxService {
  _NoCallService(this.socket);
  final SocketService socket;
}

/// Shorthand for the decoded-JSON shapes the API returns.
Map<String, dynamic> doctorJson({String id = 'd1', String nama = 'dr. Andi Pratama', num fee = 75000, double rating = 4.5}) => {
      '_id': id,
      'nama': nama,
      'biaya_konsultasi': fee,
      'rating': rating,
      'jumlah_ulasan': 3,
      'spesialisasi_id': {'_id': 's1', 'nama': 'Umum'},
    };
