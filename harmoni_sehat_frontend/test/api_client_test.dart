import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get_storage/get_storage.dart';
import 'package:harmoni_sehat_frontend/core/api_client.dart';
import 'package:harmoni_sehat_frontend/core/session.dart';
import 'package:http_mock_adapter/http_mock_adapter.dart';

import 'test_helpers.dart';

/// Scriptable adapter: lets a test answer each request based on its headers and call count.
class FakeAdapter implements HttpClientAdapter {
  FakeAdapter(this.handler);
  final (int, Object) Function(RequestOptions o) handler;
  final calls = <RequestOptions>[];

  @override
  Future<ResponseBody> fetch(RequestOptions options, Stream<Uint8List>? requestStream, Future<void>? cancelFuture) async {
    calls.add(options);
    final (status, body) = handler(options);
    return ResponseBody.fromString(jsonEncode(body), status, headers: {Headers.contentTypeHeader: ['application/json']});
  }

  @override
  void close({bool force = false}) {}
}

void main() {
  late SessionService session;
  late Dio dio;
  late Dio refreshDio;
  late DioAdapter adapter;
  late ApiClient api;

  setUp(() async {
    await initStorage();
    session = SessionService(box: MemoryStore());
    await session.init();
    await session.setSession(access: 'old-access', refresh: 'old-refresh', appUser: const AppUser(id: '1', email: 'a@b.c', role: 'pasien'));
    dio = Dio(BaseOptions(baseUrl: 'http://test'));
    refreshDio = Dio(BaseOptions(baseUrl: 'http://test'));
    adapter = DioAdapter(dio: dio);
    api = ApiClient(session, dio: dio, refreshDio: refreshDio, cacheBox: GetStorage('api_cache'));
  });

  test('unwraps the data envelope and sends the bearer token', () async {
    adapter.onGet('/things', (s) => s.reply(200, {'status': 'success', 'data': [1, 2]}), headers: {'Authorization': 'Bearer old-access'});
    expect(await api.get('/things'), [1, 2]);
  });

  test('refreshes once on 401, retries the request and rotates tokens', () async {
    final main = FakeAdapter((o) => o.headers['Authorization'] == 'Bearer new-access' ? (200, {'data': 'ok'}) : (401, {'message': 'expired'}));
    final refresh = FakeAdapter((o) => (200, {'token': 'new-access', 'refreshToken': 'new-refresh'}));
    dio.httpClientAdapter = main;
    refreshDio.httpClientAdapter = refresh;

    expect(await api.get('/secure'), 'ok');
    expect(session.accessToken, 'new-access');
    expect(session.refreshToken, 'new-refresh');
    expect(main.calls, hasLength(2));
    expect(refresh.calls, hasLength(1));
    expect(refresh.calls.single.data, {'refreshToken': 'old-refresh'});
  });

  test('concurrent 401s share a single refresh call', () async {
    final main = FakeAdapter((o) => o.headers['Authorization'] == 'Bearer new-access' ? (200, {'data': o.path}) : (401, {}));
    final refresh = FakeAdapter((o) => (200, {'token': 'new-access', 'refreshToken': 'r2'}));
    dio.httpClientAdapter = main;
    refreshDio.httpClientAdapter = refresh;

    final results = await Future.wait([api.get('/a'), api.get('/b'), api.get('/c')]);
    expect(results, ['/a', '/b', '/c']);
    expect(refresh.calls, hasLength(1));
  });

  test('does not loop forever when the retried request is still unauthorised', () async {
    final main = FakeAdapter((o) => (401, {'message': 'nope'}));
    final refresh = FakeAdapter((o) => (200, {'token': 'x', 'refreshToken': 'y'}));
    dio.httpClientAdapter = main;
    refreshDio.httpClientAdapter = refresh;
    await expectLater(api.get('/secure'), throwsA(isA<ApiException>()));
    expect(main.calls, hasLength(2));
    expect(refresh.calls, hasLength(1));
  });

  test('clears the session and signals expiry when the refresh token is rejected', () async {
    var expired = false;
    api.onSessionExpired = () => expired = true;
    dio.httpClientAdapter = FakeAdapter((o) => (401, {'message': 'expired'}));
    refreshDio.httpClientAdapter = FakeAdapter((o) => (401, {'message': 'bad refresh'}));

    await expectLater(api.get('/secure'), throwsA(isA<ApiException>()));
    expect(expired, isTrue);
    expect(session.isLoggedIn, isFalse);
  });

  test('maps server messages and network failures to ApiException', () async {
    adapter.onGet('/bad', (s) => s.reply(409, {'message': 'Slot sudah dipesan'}));
    await expectLater(api.get('/bad'), throwsA(predicate((e) => e is ApiException && e.message == 'Slot sudah dipesan' && e.statusCode == 409)));

    adapter.onGet('/down', (s) => s.throws(0, DioException(requestOptions: RequestOptions(path: '/down'), type: DioExceptionType.connectionError)));
    await expectLater(api.get('/down'), throwsA(predicate((e) => e is ApiException && e.isNetwork)));
  });

  test('serves cached GET responses when offline', () async {
    adapter.onGet('/cached', (s) => s.reply(200, {'data': {'v': 1}}));
    expect(await api.get('/cached', cache: true), {'v': 1});

    final offline = DioAdapter(dio: dio);
    offline.onGet('/cached', (s) => s.throws(0, DioException(requestOptions: RequestOptions(path: '/cached'), type: DioExceptionType.connectionError)));
    expect(await api.get('/cached', cache: true), {'v': 1});
  });
}
