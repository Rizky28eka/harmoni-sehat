import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

/// Minimal key/value store so session persistence can be swapped for an in-memory one in tests.
abstract class KeyValueStore {
  dynamic read(String key);
  Future<void> write(String key, dynamic value);
  Future<void> remove(String key);
}

class GetStorageStore implements KeyValueStore {
  GetStorageStore([GetStorage? box]) : _box = box ?? GetStorage();
  final GetStorage _box;
  @override
  dynamic read(String key) => _box.read(key);
  @override
  Future<void> write(String key, dynamic value) => _box.write(key, value);
  @override
  Future<void> remove(String key) => _box.remove(key);
}

class MemoryStore implements KeyValueStore {
  final _m = <String, dynamic>{};
  @override
  dynamic read(String key) => _m[key];
  @override
  Future<void> write(String key, dynamic value) async => _m[key] = value;
  @override
  Future<void> remove(String key) async => _m.remove(key);
}

class AppUser {
  final String id;
  final String email;
  final String role;
  const AppUser({required this.id, required this.email, required this.role});

  factory AppUser.fromJson(Map<String, dynamic> json) {
    final role = json['role'];
    return AppUser(
      id: (json['_id'] ?? json['id']).toString(),
      email: json['email']?.toString() ?? '',
      role: role is Map ? role['nama_peran'].toString() : role.toString(),
    );
  }

  Map<String, dynamic> toJson() => {'_id': id, 'email': email, 'role': role};
}

/// Holds the signed-in user and tokens. Tokens live in the platform keystore,
/// non-sensitive preferences in GetStorage.
class SessionService extends GetxService {
  static const _kAccess = 'access_token';
  static const _kRefresh = 'refresh_token';
  static const _kUser = 'session_user';

  final FlutterSecureStorage _secure;
  final KeyValueStore _box;

  SessionService({FlutterSecureStorage? secure, KeyValueStore? box})
      : _secure = secure ?? const FlutterSecureStorage(),
        _box = box ?? GetStorageStore();

  final Rxn<AppUser> user = Rxn<AppUser>();
  /// Role-specific profile document (Pasien / Dokter / Apoteker) from /auth/me.
  final Rxn<Map<String, dynamic>> profile = Rxn<Map<String, dynamic>>();

  String? _access;
  String? _refresh;

  String? get accessToken => _access;
  String? get refreshToken => _refresh;
  bool get isLoggedIn => _access != null && user.value != null;
  String? get role => user.value?.role;
  String get displayName => (profile.value?['nama'] ?? user.value?.email ?? '').toString();
  String? get profileId => profile.value?['_id']?.toString();

  Future<SessionService> init() async {
    try {
      _access = await _secure.read(key: _kAccess);
      _refresh = await _secure.read(key: _kRefresh);
    } catch (_) {
      _access = null;
      _refresh = null;
    }
    final raw = _box.read(_kUser);
    if (raw is Map && _access != null) {
      user.value = AppUser.fromJson(Map<String, dynamic>.from(raw));
    }
    return this;
  }

  Future<void> setTokens(String access, String? refresh) async {
    _access = access;
    if (refresh != null) _refresh = refresh;
    await _secure.write(key: _kAccess, value: access);
    if (refresh != null) await _secure.write(key: _kRefresh, value: refresh);
  }

  Future<void> setSession({
    required String access,
    required String? refresh,
    required AppUser appUser,
  }) async {
    await setTokens(access, refresh);
    user.value = appUser;
    await _box.write(_kUser, appUser.toJson());
  }

  Future<void> clear() async {
    _access = null;
    _refresh = null;
    user.value = null;
    profile.value = null;
    await _secure.delete(key: _kAccess);
    await _secure.delete(key: _kRefresh);
    await _box.remove(_kUser);
  }
}
