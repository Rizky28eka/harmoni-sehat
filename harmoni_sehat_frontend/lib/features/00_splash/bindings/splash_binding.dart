import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/00_splash/controllers/splash_controller.dart';

class SplashBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<SplashController>(SplashController());
  }
}