import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/login_response_model.dart';
import '../models/user_model.dart';
import 'api_constants.dart';

class AuthService extends GetConnect {
  final SharedPreferences _prefs = Get.find<SharedPreferences>();
  final String _tokenKey = 'jwt_token';

  @override
  void onInit() {
    httpClient.baseUrl = ApiConstants.baseUrl;

    httpClient.addRequestModifier<void>((request) async {
      final token = _prefs.getString(_tokenKey);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      return request;
    });

    httpClient.addResponseModifier((request, response) {
      print('Request URL: ${request.url}');
      print('Response Status Code: ${response.statusCode}');
      print('Response Body: ${response.bodyString}');
      return response;
    });
  }

  Future<LoginResponse?> login(
    String email,
    String password,
    String role,
  ) async {
    final response = await post('/auth/login', {
      'email': email,
      'password': password,
      'role': role,
    });

    debugPrint('AuthService: Login API Response Body: ${response.body}');

    if (response.statusCode == 200) {
      if (response.body == null || response.body is! Map<String, dynamic>) {
        throw Exception('Invalid response body from login API');
      }
      final loginResponse = LoginResponse.fromJson(
        response.body as Map<String, dynamic>,
      );
      await _prefs.setString(_tokenKey, loginResponse.token);

      // Store user role from login response
      if (loginResponse.role != null) {
        await _prefs.setString('user_role', loginResponse.role!);
      } else {
        await _prefs.remove('user_role');
      }
      return loginResponse;
    } else {
      print('Login failed: ${response.bodyString}');
      throw Exception(response.body?['message'] ?? 'Login failed');
    }
  }

  // Removed _decodeJwtToken and _decodeBase64 as role is now directly from response
  // String? getUserRole() remains the same

  String? getUserRole() {
    final role = _prefs.getString('user_role');
    debugPrint('AuthService: getUserRole() called. User role: $role');
    return role;
  }

  Future<User?> register(Map<String, dynamic> userData) async {
    final response = await post('/auth/register', userData);

    if (response.statusCode == 201 && response.body != null) {
      try {
        final Map<String, dynamic> responseData = response.body['data'];
        final Map<String, dynamic> userResponse = responseData['user'];

        final String id = userResponse['_id'];
        final String email = userResponse['email'];
        final String role = userResponse['role'];
        final String name = userData['nama_lengkap']; // Get name from initial userData

        return User(
          id: id,
          name: name,
          email: email,
          role: role,
        );
      } catch (e) {
        print('Error saat parsing respons registrasi: $e');
        return null;
      }
    } else {
      print('Registrasi gagal: ${response.bodyString}');
      // Melempar exception agar bisa ditangkap di UI untuk menampilkan pesan error
      throw Exception(response.body?['message'] ?? 'Registrasi gagal');
    }
  }

  Future<void> logout() async {
    await _prefs.remove(_tokenKey);
    await _prefs.remove('user_id');
  }

  String? getToken() {
    return _prefs.getString(_tokenKey);
  }

  bool isAuthenticated() {
    return getToken() != null;
  }
}
