import 'dart:convert';

DataKesehatan dataKesehatanFromJson(String str) => DataKesehatan.fromJson(json.decode(str));
String dataKesehatanToJson(DataKesehatan data) => json.encode(data.toJson());

class DataKesehatan {
    DataKesehatan({
        this.id,
        required this.nama,
        required this.detakJantung,
        required this.suhuTubuh,
    });

    String? id;
    String nama;
    int detakJantung;
    double suhuTubuh;

    factory DataKesehatan.fromJson(Map<String, dynamic> json) => DataKesehatan(
        id: json["_id"],
        nama: json["nama"],
        detakJantung: json["detakJantung"],
        suhuTubuh: (json["suhuTubuh"] as num).toDouble(),
    );

    Map<String, dynamic> toJson() => {
        "nama": nama,
        "detakJantung": detakJantung,
        "suhuTubuh": suhuTubuh,
    };
}