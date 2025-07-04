// lib/app/bindings/auth_binding.dart
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controllers/auth_controller.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    Get.putAsync<SharedPreferences>(() async {
      return await SharedPreferences.getInstance();
    }, permanent: true);

    Get.put<AuthService>(AuthService(), permanent: true);
    Get.lazyPut<AuthController>(() => AuthController());
  }
}
