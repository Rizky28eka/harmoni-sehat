import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';

class AuthRepository {
  AuthRepository(this._api, this._session, this._socket);
  final ApiClient _api;
  final SessionService _session;
  final SocketService _socket;

  Future<AppUser> _consume(Map<String, dynamic> body) async {
    final user = AppUser.fromJson(asMap(asMap(body['data'])['user']));
    await _session.setSession(access: body['token'] as String, refresh: body['refreshToken'] as String?, appUser: user);
    await loadProfile();
    _socket.connect();
    return user;
  }

  Future<AppUser> login(String email, String password) async =>
      _consume(await _api.postRaw('/auth/login', data: {'email': email.trim(), 'password': password}));

  /// Single-step registration: account + role profile in one request.
  Future<AppUser> register(Map<String, dynamic> payload) async => _consume(await _api.postRaw('/auth/register', data: payload));

  Future<void> loadProfile() async {
    final data = asMap(await _api.get('/auth/me', cache: true));
    _session.profile.value = asMap(data['profile']);
    if (data['user'] != null) _session.user.value = AppUser.fromJson(asMap(data['user']));
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout', data: {'refreshToken': _session.refreshToken});
    } catch (_) {/* best effort */}
    _socket.disconnect();
    await _session.clear();
  }

  Future<void> forgotPassword(String email) => _api.post('/auth/forgot-password', data: {'email': email.trim()});
  Future<void> verifyResetToken(String token) => _api.post('/auth/verify-reset-token', data: {'token': token.trim()});
  Future<void> resetPassword(String token, String password) =>
      _api.post('/auth/reset-password', data: {'token': token.trim(), 'newPassword': password});
  Future<void> changePassword(String current, String next) =>
      _api.post('/auth/change-password', data: {'currentPassword': current, 'newPassword': next});
  Future<void> deleteAccount(String password) => _api.delete('/me/account', data: {'password': password});
}
