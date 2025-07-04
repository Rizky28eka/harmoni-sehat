import 'dart:convert';

// Fungsi untuk mem-parsing JSON menjadi objek User
User userFromJson(String str) => User.fromJson(json.decode(str));

// Fungsi untuk mengubah objek User menjadi JSON string
String userToJson(User data) => json.encode(data.toJson());

class User {
  final int id;
  final String name;
  final String email;
  final String? role; // Role bisa null
  final String? photoUrl; // URL foto profil bisa null

  User({
    required this.id,
    required this.name,
    required this.email,
    this.role,
    this.photoUrl,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json["id"],
    name: json["name"],
    email: json["email"],
    role: json["role"], // Ambil role jika ada
    photoUrl: json["photo_url"], // Ambil URL foto jika ada
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "name": name,
    "email": email,
    "role": role,
    "photo_url": photoUrl,
  };
}
