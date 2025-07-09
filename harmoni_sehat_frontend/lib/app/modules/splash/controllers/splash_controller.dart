import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

class SplashController extends GetxController {
  @override
  void onInit() {
    super.onInit();
    _navigateToOnboarding();
  }

  _navigateToOnboarding() async {
    await Future.delayed(const Duration(milliseconds: 3000));
    Get.offNamed(Routes.ONBOARDING);
  }
}
