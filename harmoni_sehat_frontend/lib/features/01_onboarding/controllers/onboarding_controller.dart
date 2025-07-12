import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../../app/routes/app_routes.dart';

class OnboardingController extends GetxController {
  final pageController = PageController();
  final storage = GetStorage();

  final currentPage = 0.obs;

  bool get isLastPage =>
      currentPage.value == 2; // Asumsi ada 3 halaman (0, 1, 2)

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }

  void onPageChanged(int index) {
    currentPage.value = index;
  }

  void completeOnboarding() {
    storage.write('hasSeenOnboarding', true);
    Get.offAllNamed(AppRoutes.login);
  }
}
