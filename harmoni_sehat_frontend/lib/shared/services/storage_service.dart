import 'package:get_storage/get_storage.dart';

class StorageService {
  final GetStorage _box = GetStorage();

  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userRoleKey = 'user_role';

  Future<void> saveToken(String token) async {
    await _box.write(_tokenKey, token);
  }

  String? getToken() {
    return _box.read(_tokenKey);
  }

  Future<void> saveUserId(String userId) async {
    await _box.write(_userIdKey, userId);
  }

  String? getUserId() {
    return _box.read(_userIdKey);
  }

  Future<void> saveUserRole(String userRole) async {
    await _box.write(_userRoleKey, userRole);
  }

  String? getUserRole() {
    return _box.read(_userRoleKey);
  }

  Future<void> removeToken() async {
    await _box.remove(_tokenKey);
    await _box.remove(_userIdKey);
    await _box.remove(_userRoleKey);
  }

  // Dummy token validation for now
  Future<bool> validateToken() async {
    final token = getToken();
    final userId = getUserId();
    final userRole = getUserRole();
    // In a real app, this would involve an API call to validate the token with the backend.
    // For now, we just check if a token, userId, and userRole exist.
    return token != null && token.isNotEmpty && userId != null && userId.isNotEmpty && userRole != null && userRole.isNotEmpty;
  }
}