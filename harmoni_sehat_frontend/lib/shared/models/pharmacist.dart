class Pharmacist {
  final String id;
  final String nama;
  final String nomorSipa;

  Pharmacist({
    required this.id,
    required this.nama,
    required this.nomorSipa,
  });

  Map<String, dynamic> toJson() {
    return {'user_id': id, 'nama': nama, 'nomor_sipa': nomorSipa};
  }
}
