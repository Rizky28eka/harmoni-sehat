import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/models/spesialisasi_model.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/api_constants.dart';

class SpesialisasiProvider extends GetConnect {
  @override
  void onInit() {
    httpClient.baseUrl = ApiConstants.baseUrl;
    httpClient.timeout = const Duration(seconds: 30);
  }

  Future<List<Spesialisasi>> getAllSpesialisasi() async {
    final response = await get('/spesialisasis');

    if (response.isOk) {
      if (response.body != null && response.body is Map && response.body.containsKey('data') && response.body['data'] is Map && response.body['data'].containsKey('data') && response.body['data']['data'] is List) {
        final List<dynamic> responseData = response.body['data']['data'];
        return responseData.map((json) => Spesialisasi.fromJson(json)).toList();
      } else {
        // Log the unexpected format for debugging, but return empty list for graceful handling
        // print('SpesialisasiProvider: Unexpected API response format: ${response.body}');
        return [];
      }
    } else {
      // print('SpesialisasiProvider: Failed to load spesialisasi with status code: ${response.statusCode}');
      return [];
    }
  }
}
