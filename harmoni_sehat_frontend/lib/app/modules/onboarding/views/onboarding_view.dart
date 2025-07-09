import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/onboarding/controllers/onboarding_controller.dart';
import 'package:harmoni_sehat_frontend/app/utils/app_colors.dart';
import 'package:harmoni_sehat_frontend/app/utils/app_font_sizes.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome to Harmoni Sehat'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Your Health, Our Priority',
              style: TextStyle(
                fontSize: AppFontSizes.heading2,
                fontWeight: FontWeight.bold,
                color: AppColors.primaryColor,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            const Text(
              'Manage your health, book appointments, and get medical advice all in one place.',
              style: TextStyle(
                fontSize: AppFontSizes.large,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            // ElevatedButton(
            //   onPressed: () => controller.skipOnboarding(),
            //   style: ElevatedButton.styleFrom(
            //     backgroundColor: AppColors.secondaryColor,
            //     padding: const EdgeInsets.symmetric(
            //       horizontal: 40,
            //       vertical: 15,
            //     ),
            //     shape: RoundedRectangleBorder(
            //       borderRadius: BorderRadius.circular(10),
            //     ),
            //   ),
            //   child: const Text(
            //     'Skip Onboarding',
            //     style: TextStyle(
            //       fontSize: AppFontSizes.large,
            //       color: Colors.white,
            //     ),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
