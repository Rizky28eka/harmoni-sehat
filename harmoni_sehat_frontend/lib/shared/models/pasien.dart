class Pasien {
  final String id;
  final String nama;
  final String nik;
  final DateTime tanggalLahir;
  final String jenisKelamin;
  final String alamat;
  final String noTelepon;

  Pasien({
    required this.id,
    required this.nama,
    required this.nik,
    required this.tanggalLahir,
    required this.jenisKelamin,
    required this.alamat,
    required this.noTelepon,
  });

  Map<String, dynamic> toJson() {
    return {
      'user_id': id,
      'nama': nama,
      'nik': nik,
      'tanggal_lahir': tanggalLahir.toIso8601String(),
      'jenis_kelamin': jenisKelamin,
      'alamat': alamat,
      'no_telepon': noTelepon,
    };
  }
}