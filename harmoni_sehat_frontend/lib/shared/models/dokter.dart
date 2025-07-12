class Dokter {
  final String id;
  final String nama;
  final String nomorStr;
  final double biayaKonsultasi;
  final String? spesialisasiId;
  final String? foto;
  final String? bio;

  Dokter({
    required this.id,
    required this.nama,
    required this.nomorStr,
    required this.biayaKonsultasi,
    this.spesialisasiId,
    this.foto,
    this.bio,
  });

  Map<String, dynamic> toJson() {
    return {
      'user_id': id,
      'nama': nama,
      'nomor_str': nomorStr,
      'biaya_konsultasi': biayaKonsultasi,
      if (spesialisasiId != null) 'spesialisasi_id': spesialisasiId,
      if (foto != null) 'foto': foto,
      if (bio != null) 'foto': foto,
    };
  }
}