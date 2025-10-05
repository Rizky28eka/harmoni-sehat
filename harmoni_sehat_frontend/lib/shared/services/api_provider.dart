import 'package:dio/dio.dart' as dio;
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/shared/services/storage_service.dart';

class ApiProvider {
  final dio.Dio _dio;
  final StorageService _storageService = Get.find<StorageService>();

  // Pastikan IP address ini adalah IP address mesin Anda di jaringan lokal.
  // 'localhost' atau '127.0.0.1' tidak akan berfungsi di emulator Android.
  // Gunakan 'ipconfig' (Windows) atau 'ifconfig' (macOS/Linux) untuk menemukan IP Anda.
  static const String _baseUrl =
    'http://10.0.2.2:8000/api'; // Sesuaikan dengan IP backend Anda

  ApiProvider() : _dio = dio.Dio(dio.BaseOptions(baseUrl: _baseUrl)) {
    _dio.interceptors.add(
      dio.InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = _storageService.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          return handler.next(response);
        },
        onError: (dio.DioException e, handler) {
          return handler.next(e);
        },
      ),
    );

    if (kDebugMode) {
      _dio.interceptors.add(
        dio.LogInterceptor(
          requestBody: true,
          responseBody: true,
          requestHeader: true,
        ),
      );
    }
  }

  Future<dio.Response> post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } on dio.DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<dio.Response> get(
    String path, {
    Map<String, dynamic>? queryParams,
  }) async {
    try {
      return await _dio.get(path, queryParameters: queryParams);
    } on dio.DioException catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dio.DioException error) {
    String errorDescription = "An unexpected error occurred.";
    if (error.response != null) {
      errorDescription =
          error.response?.data['message'] as String? ??
          'Failed to process the request.';
    } else {
      errorDescription = error.message ?? 'Connection problem.';
    }
    return errorDescription;
  }
}
