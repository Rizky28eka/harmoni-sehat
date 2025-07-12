class User {
  final String id;
  final String email;
  final String role;

  User({
    required this.id,
    required this.email,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      email: json['email'],
      role: json['role']['nama_peran'], // Accessing nama_peran from the nested role object
    );
  }
}
