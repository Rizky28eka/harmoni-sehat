// lib/app/bindings/auth_binding.dart
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controllers/auth_controller.dart';
import '../data/providers/auth_service.dart';

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
