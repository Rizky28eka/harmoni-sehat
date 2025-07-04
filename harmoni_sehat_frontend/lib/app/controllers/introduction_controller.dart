import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

class IntroductionController extends GetxController {
  var currentPage = 0.obs;
  final PageController pageController = PageController();

  final List<Map<String, String>> pages = [
    {
      "image": "assets/images/App_Logo.png",
      "title": "Welcome to Harmoni Sehat",
      "description": "Your journey to a healthier and more balanced life starts here."
    },
    {
      "image": "assets/images/App_Logo.png",
      "title": "Track Your Health",
      "description": "Easily monitor your health metrics and stay informed about your well-being."
    },
    {
      "image": "assets/images/App_Logo.png",
      "title": "Get Personalized Insights",
      "description": "Receive personalized tips and recommendations to improve your health."
    }
  ];

  void onPageChanged(int index) {
    currentPage.value = index;
  }

  void nextPage() {
    if (currentPage.value < pages.length - 1) {
      pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.ease,
      );
    } else {
      Get.offAllNamed(Routes.LOGIN);
    }
  }

  void skip() {
    Get.offAllNamed(Routes.LOGIN);
  }
}
