import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/onboarding_controller.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: controller.pageController,
        onPageChanged: controller.onPageChanged,
        children: const [
          OnboardingPage(
            color: Colors.blueAccent,
            title: 'Selamat Datang di Harmoni Sehat',
            description: 'Solusi kesehatan terpadu untuk Anda dan keluarga.',
            imagePath: 'assets/images/onboarding1.png', // Placeholder
          ),
          OnboardingPage(
            color: Colors.greenAccent,
            title: 'Konsultasi Dokter Online',
            description:
                'Dapatkan saran medis dari dokter profesional kapan saja, di mana saja.',
            imagePath: 'assets/images/onboarding2.png', // Placeholder
          ),
          OnboardingPage(
            color: Colors.purpleAccent,
            title: 'Pesan Obat dengan Mudah',
            description:
                'Tersedia berbagai macam obat dan vitamin, siap diantar ke rumah Anda.',
            imagePath: 'assets/images/onboarding3.png', // Placeholder
          ),
        ],
      ),
      bottomSheet: Obx(
        () => Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: List.generate(
                  3,
                  (index) => buildDot(index, controller.currentPage.value),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  if (controller.isLastPage) {
                    controller.completeOnboarding();
                  } else {
                    controller.pageController.nextPage(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeIn,
                    );
                  }
                },
                child: Text(controller.isLastPage ? 'Mulai' : 'Lanjut'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildDot(int index, int currentPage) {
    return Container(
      margin: const EdgeInsets.only(right: 5),
      height: 10,
      width: 10,
      decoration: BoxDecoration(
        color: currentPage == index ? Colors.blue : Colors.grey,
        borderRadius: BorderRadius.circular(5),
      ),
    );
  }
}

class OnboardingPage extends StatelessWidget {
  final Color color;
  final String title;
  final String description;
  final String imagePath;

  const OnboardingPage({
    super.key,
    required this.color,
    required this.title,
    required this.description,
    required this.imagePath,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: color,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Image.asset(imagePath, height: 200), // Placeholder for images
          const SizedBox(height: 40),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              description,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }
}
