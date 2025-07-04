import 'dart:convert';
import 'dart:io';

import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/api_constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends GetConnect {
  @override
  void onInit() {
    httpClient.baseUrl = ApiConstants.baseUrl;
    httpClient.timeout = const Duration(seconds: 30);

    httpClient.addRequestModifier<void>((request) {
      final SharedPreferences prefs = Get.find<SharedPreferences>();
      final token = prefs.getString('jwt_token');
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      print("REQUEST [${request.method}] => ${request.url}");
      return request;
    });
  }

  Future<void> register(Map<String, dynamic> userData) async {
    final response = await post('/auth/register', userData);

    print("RESPONSE [${response.statusCode}] => ${response.bodyString}");

    if (response.isOk) {
      // Registrasi berhasil, tidak perlu mengembalikan apa-apa
      // karena controller akan redirect ke halaman login.
      return;
    } else {
      // Tangani error dari backend
      if (response.body != null && response.body is Map<String, dynamic>) {
        // Jika backend mengirim JSON error { "message": "..." }
        throw response.body['message'] ?? 'Terjadi kesalahan tidak diketahui.';
      } else if (response.statusCode == 422) {
        // Error validasi dari express-validator
        final errors = response.body['errors'] as List;
        final firstError = errors.first as Map<String, dynamic>;
        final errorMessage = firstError.values.first;
        throw errorMessage;
      }
      else {
        // Error umum lainnya
        throw 'Gagal terhubung ke server. Status: ${response.statusCode}';
      }
    }
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> loginData) async {
    final response = await post('/auth/login', loginData);

    print("RESPONSE [${response.statusCode}] => ${response.bodyString}");

    if (response.isOk) {
      if (response.body != null && response.body['token'] != null) {
        final SharedPreferences prefs = Get.find<SharedPreferences>();
        await prefs.setString('jwt_token', response.body['token']);
        return {
          'token': response.body['token'],
          'userId': response.body['userId'], // Assuming userId is returned
          'role': response.body['role'],     // Assuming role is returned
          'name': response.body['name'],     // Assuming name is returned
        };
      }
      throw 'Token tidak ditemukan dalam respons login.';
    } else {
      if (response.body != null && response.body is Map<String, dynamic>) {
        throw response.body['message'] ?? 'Terjadi kesalahan tidak diketahui.';
      } else if (response.statusCode == 401) {
        throw 'Email atau password salah.';
      } else {
        throw 'Gagal terhubung ke server. Status: ${response.statusCode}';
      }
    }
  }
}
