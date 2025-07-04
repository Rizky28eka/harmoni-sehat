import 'dart:convert'; // Added for JWT decoding
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

  Future<LoginResponse?> login(String email, String password, String role) async {
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
      final loginResponse = LoginResponse.fromJson(response.body as Map<String, dynamic>);
      await _prefs.setString(_tokenKey, loginResponse.token);

      // Decode JWT token to get user role
      final Map<String, dynamic> decodedToken = _decodeJwtToken(loginResponse.token);
      final String? role = decodedToken['role'];

      if (role != null) {
        await _prefs.setString('user_role', role);
      } else {
        await _prefs.remove('user_role');
      }
      return loginResponse;
    } else {
      print('Login failed: ${response.bodyString}');
      throw Exception(response.body?['message'] ?? 'Login failed');
    }
  }

  Map<String, dynamic> _decodeJwtToken(String token) {
    debugPrint('AuthService: Decoding JWT token: $token');
    final parts = token.split('.');
    if (parts.length != 3) {
      debugPrint('AuthService: Invalid JWT token format. Parts: ${parts.length}');
      throw Exception('Invalid JWT token format');
    }
    final payload = _decodeBase64(parts[1]);
    debugPrint('AuthService: Decoded Base64 Payload: $payload');
    final Map<String, dynamic> jsonPayload = json.decode(payload);
    debugPrint('AuthService: JSON Payload: $jsonPayload');
    return jsonPayload;
  }

  String _decodeBase64(String str) {
    debugPrint('AuthService: Decoding Base64 string: $str');
    String output = str.replaceAll('-', '+').replaceAll('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw Exception('Illegal base64url string!');
    }
    final decodedBytes = base64Url.decode(output);
    final decodedString = utf8.decode(decodedBytes);
    debugPrint('AuthService: Base64 Decoded to UTF8: $decodedString');
    return decodedString;
  }

  String? getUserRole() {
    final role = _prefs.getString('user_role');
    debugPrint('AuthService: getUserRole() called. User role: $role');
    return role;
  }

  Future<User?> register(Map<String, dynamic> userData) async {
    final response = await post('/auth/register', userData);

    if (response.statusCode == 201) {
      return User(
        id: response.body['userId'].toString(),
        username: userData['nama_lengkap'],
        email: userData['email'],
      );
    } else {
      print('Register failed: ${response.bodyString}');
      throw Exception(response.body?['message'] ?? 'Registration failed');
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
