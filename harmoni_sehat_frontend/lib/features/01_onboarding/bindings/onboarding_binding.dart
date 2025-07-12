import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/01_onboarding/controllers/onboarding_controller.dart';

class OnboardingBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<OnboardingController>(() => OnboardingController());
  }
}