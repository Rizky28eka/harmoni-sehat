import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/controllers/splash_screen_controller.dart';

class SplashScreenBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<SplashScreenController>(
      SplashScreenController(),
    );
  }
}
