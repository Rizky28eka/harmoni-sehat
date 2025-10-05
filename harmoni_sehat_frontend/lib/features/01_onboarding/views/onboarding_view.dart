import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../app/theme/app_colors.dart';
import '../controllers/onboarding_controller.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView(
                controller: controller.pageController,
                onPageChanged: controller.onPageChanged,
                children: const [
                  OnboardingPage(
                    svgAsset: _onboarding1, // SVG content as string
                    title: 'Selamat Datang di Harmoni Sehat',
                    description:
                        'Solusi kesehatan terpadu untuk Anda dan keluarga, langsung dari genggaman Anda.',
                  ),
                  OnboardingPage(
                    svgAsset: _onboarding2, // SVG content as string
                    title: 'Konsultasi Dokter Profesional',
                    description:
                        'Dapatkan saran medis dari dokter ahli kapan saja, di mana saja tanpa perlu antre.',
                  ),
                  OnboardingPage(
                    svgAsset: _onboarding3, // SVG content as string
                    title: 'Pesan Obat dengan Mudah',
                    description:
                        'Tersedia berbagai macam obat dan vitamin, siap diantar langsung ke rumah Anda.',
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Obx(
                () => Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        3,
                        (index) => AnimatedDot(
                          isActive: index == controller.currentPage.value,
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          if (controller.isLastPage) {
                            controller.completeOnboarding();
                          } else {
                            controller.pageController.nextPage(
                              duration: const Duration(milliseconds: 400),
                              curve: Curves.easeInOut,
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          shape: const CircleBorder(),
                          padding: const EdgeInsets.all(12),
                          backgroundColor: AppColors.primaryColor,
                        ),
                        child: const Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AnimatedDot extends StatelessWidget {
  const AnimatedDot({super.key, required this.isActive});

  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.only(right: 8),
      height: 8,
      width: isActive ? 24 : 8,
      decoration: BoxDecoration(
        color: isActive ? AppColors.primaryColor : AppColors.borderColor,
        borderRadius: BorderRadius.circular(5),
      ),
    );
  }
}

class OnboardingPage extends StatelessWidget {
  final String svgAsset;
  final String title;
  final String description;

  const OnboardingPage({
    super.key,
    required this.svgAsset,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          AspectRatio(
            aspectRatio: 4 / 3,
            child: SvgPicture.string(svgAsset, semanticsLabel: title),
          ),
          const SizedBox(height: 48),
          Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.montserrat(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            description,
            textAlign: TextAlign.center,
            style: GoogleFonts.montserrat(
              fontSize: 16,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

// SVG Illustrations (as strings)
const String _onboarding1 = '''
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-960C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z" fill="#4CAF50"/><path d="M742.4 364.8c-12.8-12.8-32-12.8-44.8 0L499.2 563.2 326.4 390.4c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 185.6c12.8 12.8 32 12.8 44.8 0L742.4 409.6c12.8-12.8 12.8-32 0-44.8z" fill="#FFFFFF"/></svg>
''';

const String _onboarding2 = '''
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#4CAF50"/>
<path d="M12.5 15H11v-4h1.5v4zm0-5.5h-1.5V8h1.5v1.5z" fill="#4CAF50"/>
<path d="M17 12h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H7v-2h2v2z" fill="#4CAF50"/>
</svg>
''';

const String _onboarding3 = '''
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#4CAF50"/>
<path d="M13 17h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#FFFFFF"/>
</svg>
''';
