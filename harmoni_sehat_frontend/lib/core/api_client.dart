import 'dart:async';
import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:get_storage/get_storage.dart';

import 'config.dart';
import 'session.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  const ApiException(this.message, {this.statusCode});

  bool get isNetwork => statusCode == null;
  bool get isUnauthorized => statusCode == 401;

  @override
  String toString() => message;
}

/// Thin Dio wrapper: bearer auth, single-flight token refresh with one retry,
/// error normalisation, and a read-through offline cache for GETs.
class ApiClient {
  ApiClient(this._session, {Dio? dio, Dio? refreshDio, GetStorage? cacheBox})
      : _dio = dio ?? Dio(BaseOptions(baseUrl: AppConfig.apiBaseUrl, connectTimeout: const Duration(seconds: 15), receiveTimeout: const Duration(seconds: 30))),
        _refreshDio = refreshDio ?? Dio(BaseOptions(baseUrl: AppConfig.apiBaseUrl, connectTimeout: const Duration(seconds: 15))),
        _cache = cacheBox ?? GetStorage('api_cache') {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        final t = _session.accessToken;
        if (t != null) options.headers['Authorization'] = 'Bearer $t';
        handler.next(options);
      },
      onError: (e, handler) async {
        final req = e.requestOptions;
        final canRefresh = e.response?.statusCode == 401 &&
            req.extra['retried'] != true &&
            !req.path.startsWith('/auth/login') &&
            !req.path.startsWith('/auth/refresh') &&
            _session.refreshToken != null;
        if (!canRefresh) return handler.next(e);
        final ok = await _refresh();
        if (!ok) return handler.next(e);
        try {
          req.extra['retried'] = true;
          req.headers['Authorization'] = 'Bearer ${_session.accessToken}';
          handler.resolve(await _dio.fetch(req));
        } on DioException catch (err) {
          handler.next(err);
        }
      },
    ));
    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(requestBody: false, responseBody: false));
    }
  }

  final SessionService _session;
  final Dio _dio;
  final Dio _refreshDio;
  final GetStorage _cache;

  /// Called when the refresh token is rejected; the app should return to login.
  void Function()? onSessionExpired;

  Completer<bool>? _refreshing;

  Future<bool> _refresh() {
    if (_refreshing != null) return _refreshing!.future;
    final c = _refreshing = Completer<bool>();
    () async {
      try {
        final res = await _refreshDio.post('/auth/refresh', data: {'refreshToken': _session.refreshToken});
        final body = res.data as Map<String, dynamic>;
        await _session.setTokens(body['token'] as String, body['refreshToken'] as String?);
        c.complete(true);
      } catch (_) {
        await _session.clear();
        onSessionExpired?.call();
        c.complete(false);
      } finally {
        _refreshing = null;
      }
    }();
    return c.future;
  }

  ApiException _toException(DioException e) {
    final status = e.response?.statusCode;
    final data = e.response?.data;
    if (data is Map && data['message'] is String) {
      return ApiException(data['message'] as String, statusCode: status);
    }
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const ApiException('Koneksi timeout. Periksa jaringan Anda.');
      case DioExceptionType.connectionError:
        return const ApiException('Tidak dapat terhubung ke server.');
      default:
        return ApiException(status != null ? 'Terjadi kesalahan ($status).' : 'Terjadi kesalahan jaringan.', statusCode: status);
    }
  }

  Future<Response<dynamic>> _send(Future<Response<dynamic>> Function() call) async {
    try {
      return await call();
    } on DioException catch (e) {
      throw _toException(e);
    }
  }

  /// Unwraps the `data` envelope (`{status, data}` / `{success, data}`).
  dynamic _unwrap(dynamic body) => body is Map && body.containsKey('data') ? body['data'] : body;

  String _cacheKey(String path, Map<String, dynamic>? q) => '${_session.user.value?.id ?? '-'}|$path|${jsonEncode(q ?? {})}';

  /// GET. With [cache] the last good response is stored and served when offline.
  Future<dynamic> get(String path, {Map<String, dynamic>? query, bool cache = false}) async {
    final key = _cacheKey(path, query);
    try {
      final res = await _send(() => _dio.get(path, queryParameters: query));
      final data = _unwrap(res.data);
      if (cache) await _cache.write(key, jsonEncode(data));
      return data;
    } on ApiException catch (e) {
      if (cache && e.isNetwork) {
        final hit = _cache.read(key);
        if (hit is String) return jsonDecode(hit);
      }
      rethrow;
    }
  }

  Future<dynamic> post(String path, {dynamic data}) async => _unwrap((await _send(() => _dio.post(path, data: data))).data);
  Future<dynamic> put(String path, {dynamic data}) async => _unwrap((await _send(() => _dio.put(path, data: data))).data);
  Future<dynamic> delete(String path, {dynamic data}) async => _unwrap((await _send(() => _dio.delete(path, data: data))).data);

  /// Returns the full body (needed for auth responses that put tokens at the top level).
  Future<Map<String, dynamic>> postRaw(String path, {dynamic data}) async {
    final res = await _send(() => _dio.post(path, data: data));
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<dynamic> upload(String path, String filePath, {String field = 'file'}) async {
    final form = FormData.fromMap({field: await MultipartFile.fromFile(filePath)});
    return _unwrap((await _send(() => _dio.post(path, data: form))).data);
  }
}
