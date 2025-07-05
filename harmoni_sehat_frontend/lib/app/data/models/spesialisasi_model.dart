class Spesialisasi {
  final String id;
  final String namaSpesialisasi;
  final String? deskripsi;
  final String? icon;
  final String? color;
  final bool? isActive;

  Spesialisasi({
    required this.id,
    required this.namaSpesialisasi,
    this.deskripsi,
    this.icon,
    this.color,
    this.isActive,
  });

  factory Spesialisasi.fromJson(Map<String, dynamic> json) {
    return Spesialisasi(
      id: json['_id'] as String,
      namaSpesialisasi: json['nama_spesialisasi'] as String,
      deskripsi: json['deskripsi'] as String?,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      isActive: json['is_active'] as bool?,
    );
  }

  Map<String, dynamic> toJson() => {
    '_id': id,
    'nama_spesialisasi': namaSpesialisasi,
    'deskripsi': deskripsi,
    'icon': icon,
    'color': color,
    'is_active': isActive,
  };
}
