import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/data_kesehatan_model.dart';

class ApiProvider {
  // Ganti dengan IP address Anda jika menjalankan di perangkat fisik
  final String _baseUrl = "http://10.0.2.2:5000/api"; 

  Future<List<DataKesehatan>> fetchDataKesehatan() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/data'));
      if (response.statusCode == 200) {
        Iterable list = json.decode(response.body);
        return list.map((model) => DataKesehatan.fromJson(model)).toList();
      } else {
        throw Exception('Gagal memuat data');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<DataKesehatan> createDataKesehatan(DataKesehatan data) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/data'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: dataKesehatanToJson(data),
      );
      if (response.statusCode == 201) {
        return DataKesehatan.fromJson(json.decode(response.body));
      } else {
        throw Exception('Gagal membuat data. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}