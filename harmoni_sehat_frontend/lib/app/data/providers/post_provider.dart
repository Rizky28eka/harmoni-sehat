import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/models/post_model.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/auth_service.dart';

class PostProvider extends GetConnect {
  final AuthService _authProvider = Get.find<AuthService>();

  @override
  void onInit() {
    httpClient.baseUrl = 'https://jsonplaceholder.typicode.com';
    // Add request interceptor
    httpClient.addRequestModifier<void>((request) async {
      final token = await _authProvider.getToken();
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      return request;
    });

    // Add response interceptor
    httpClient.addResponseModifier((request, response) {
      // For example, log response status
      print('Status Code: ${response.statusCode}');
      return response;
    });
  }

  Future<List<Post>> getPosts() async {
    final response = await get('/posts');
    if (response.status.hasError) {
      return Future.error(response.statusText!);
    } else {
      final List<dynamic> data = response.body;
      return data.map((json) => Post.fromJson(json)).toList();
    }
  }

  Future<Post> getPost(int id) async {
    final response = await get('/posts/$id');
    if (response.status.hasError) {
      return Future.error(response.statusText!);
    } else {
      return Post.fromJson(response.body);
    }
  }
}
