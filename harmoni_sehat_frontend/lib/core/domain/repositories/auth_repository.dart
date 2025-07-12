import 'package:dio/dio.dart' as dio;
import 'package:harmoni_sehat_frontend/shared/models/auth_response.dart';
import 'package:harmoni_sehat_frontend/shared/services/api_provider.dart';
import 'package:harmoni_sehat_frontend/shared/models/pasien.dart';
import 'package:harmoni_sehat_frontend/shared/models/dokter.dart';
import 'package:harmoni_sehat_frontend/shared/models/pharmacist.dart';

class AuthRepository {
  final ApiProvider _apiProvider;

  AuthRepository(this._apiProvider);

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _apiProvider.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return AuthResponse.fromJson(response.data);
    } on dio.DioException catch (e) {
      throw e.message ?? 'Login failed';
    }
  }

  Future<AuthResponse> register(
    String name,
    String email,
    String password,
    String role,
  ) async {
    try {
      final response = await _apiProvider.post(
        '/auth/register',
        data: {'name': name, 'email': email, 'password': password, 'role': role},
      );
      return AuthResponse.fromJson(response.data);
    } on dio.DioException catch (e) {
      throw e.message ?? 'Registration failed';
    }
  }

  Future<void> registerPasien(Pasien pasien) async {
    try {
      await _apiProvider.post('/patients', data: pasien.toJson());
    } on dio.DioException catch (e) {
      throw e.message ?? 'Pasien registration failed';
    }
  }

  Future<void> registerDokter(Dokter dokter) async {
    try {
      await _apiProvider.post('/doctors', data: dokter.toJson());
    } on dio.DioException catch (e) {
      throw e.message ?? 'Dokter registration failed';
    }
  }

  Future<void> registerPharmacist(Pharmacist pharmacist) async {
    try {
      await _apiProvider.post('/pharmacists', data: pharmacist.toJson());
    } on dio.DioException catch (e) {
      throw e.message ?? 'Pharmacist registration failed';
    }
  }

  Future<void> forgotPassword(String email) async {
    try {
      await _apiProvider.post('/auth/forgot-password', data: {'email': email});
    } on dio.DioException catch (e) {
      throw e.message ?? 'Forgot password failed';
    }
  }

  Future<void> verifyResetToken(String token) async {
    try {
      await _apiProvider.post('/auth/verify-reset-token', data: {'token': token});
    } on dio.DioException catch (e) {
      throw e.message ?? 'Token verification failed';
    }
  }

  Future<void> resetPassword(String token, String newPassword) async {
    try {
      await _apiProvider.post('/auth/reset-password', data: {'token': token, 'newPassword': newPassword});
    } on dio.DioException catch (e) {
      throw e.message ?? 'Password reset failed';
    }
  }
}
