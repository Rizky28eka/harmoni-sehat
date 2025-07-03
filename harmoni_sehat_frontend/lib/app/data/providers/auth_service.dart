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

  Future<LoginResponse?> login(String email, String password) async {
    final response = await post('/auth/login', {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      final loginResponse = LoginResponse.fromJson(response.body);
      await _prefs.setString(_tokenKey, loginResponse.token);
      return loginResponse;
    } else {
      print('Login failed: ${response.bodyString}');
      throw Exception(response.body?['message'] ?? 'Login failed');
    }
  }

  Future<User?> register(
    String username,
    String email,
    String password,
    String noHp,
  ) async {
    final response = await post('/auth/register', {
      'nama_lengkap': username,
      'email': email,
      'password': password,
      'no_hp': noHp,
    });

    if (response.statusCode == 201) {
      return User(
        id: response.body['userId'].toString(),
        username: username,
        email: email,
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
