import 'package:flutter/foundation.dart';

class AppConfig {
  /// Override at build time: `--dart-define=API_BASE_URL=https://api.example.com/api/v1`
  static const String _envBase = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_envBase.isNotEmpty) return _envBase;
    // The Android emulator reaches the host machine through 10.0.2.2.
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8000/api/v1';
    }
    return 'http://localhost:8000/api/v1';
  }

  /// Socket.IO lives on the server root, not under /api/v1.
  static String get socketUrl => apiBaseUrl.replaceFirst(RegExp(r'/api/v1/?$'), '');
}
