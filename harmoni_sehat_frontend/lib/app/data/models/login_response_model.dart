// lib/app/data/models/login_response_model.dart

class LoginResponse {
  final String token;
  final String? role;
  final String? userId;
  final String? name;

  LoginResponse({required this.token, this.role, this.userId, this.name});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;

    return LoginResponse(
      token: data['token'] as String,
      role: user['role'] as String?,
      userId: user['_id'] as String?,
      name: user['nama_lengkap'] as String?,
    );
  }
}