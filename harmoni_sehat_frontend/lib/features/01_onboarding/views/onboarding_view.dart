import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../app/theme/app_colors.dart';
import '../../../app/theme/pastel.dart';
import '../../../shared/widgets/kit.dart';
import '../controllers/onboarding_controller.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});

  static const _pages = <OnboardingSlide>[
    OnboardingSlide(
      tone: Tone.mint,
      icon: Icons.favorite_rounded,
      orbit: [Icons.monitor_heart_rounded, Icons.spa_rounded, Icons.self_improvement_rounded],
      title: 'Selamat Datang di Harmoni Sehat',
      description: 'Solusi kesehatan terpadu untuk Anda dan keluarga, langsung dari genggaman Anda.',
    ),
    OnboardingSlide(
      tone: Tone.sky,
      icon: Icons.videocam_rounded,
      orbit: [Icons.chat_bubble_rounded, Icons.medical_services_rounded, Icons.schedule_rounded],
      title: 'Konsultasi Dokter Profesional',
      description: 'Dapatkan saran medis dari dokter ahli kapan saja, di mana saja tanpa perlu antre.',
    ),
    OnboardingSlide(
      tone: Tone.peach,
      icon: Icons.local_pharmacy_rounded,
      orbit: [Icons.medication_rounded, Icons.vaccines_rounded, Icons.local_shipping_rounded],
      title: 'Pesan Obat dengan Mudah',
      description: 'Tersedia berbagai macam obat dan vitamin, siap diantar langsung ke rumah Anda.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          Align(
            alignment: Alignment.centerRight,
            child: Padding(padding: const EdgeInsets.fromLTRB(0, 8, 12, 0), child: TextButton(onPressed: controller.completeOnboarding, child: Text('Lewati'.tr))),
          ),
          Expanded(
            child: PageView(
              controller: controller.pageController,
              onPageChanged: controller.onPageChanged,
              children: [for (final p in _pages) OnboardingPage(page: p)],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 8, 28, 28),
            child: Obx(() => Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Row(children: List.generate(3, (i) => AnimatedDot(isActive: i == controller.currentPage.value))),
                  SizedBox(
                    height: 58,
                    child: FilledButton.icon(
                      onPressed: () {
                        if (controller.isLastPage) {
                          controller.completeOnboarding();
                        } else {
                          controller.pageController.nextPage(duration: const Duration(milliseconds: 380), curve: Curves.easeOutCubic);
                        }
                      },
                      iconAlignment: IconAlignment.end,
                      icon: const Icon(Icons.arrow_forward_rounded),
                      label: Text((controller.isLastPage ? 'Mulai' : 'Lanjut').tr),
                    ),
                  ),
                ])),
          ),
        ]),
      ),
    );
  }
}

class OnboardingSlide {
  const OnboardingSlide({required this.tone, required this.icon, required this.orbit, required this.title, required this.description});
  final Tone tone;
  final IconData icon;
  final List<IconData> orbit;
  final String title;
  final String description;
}

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key, required this.page});
  final OnboardingSlide page;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, page.tone);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 26),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(
          child: SoftCard(
            tone: page.tone,
            radius: 44,
            padding: EdgeInsets.zero,
            child: LayoutBuilder(builder: (context, box) {
              final w = box.maxWidth;
              final h = box.maxHeight;
              Widget bubble(IconData icon, Offset at, double size, double alpha) => Positioned(
                    left: at.dx * w - size / 2,
                    top: at.dy * h - size / 2,
                    child: Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: alpha)), child: Icon(icon, color: c.ink, size: size * 0.46)),
                  );
              return Stack(children: [
                Center(child: Container(width: w * 0.62, height: w * 0.62, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.55)), child: Icon(page.icon, size: w * 0.3, color: c.ink))),
                bubble(page.orbit[0], const Offset(0.2, 0.2), 64, 0.75),
                bubble(page.orbit[1], const Offset(0.82, 0.3), 54, 0.65),
                bubble(page.orbit[2], const Offset(0.7, 0.82), 70, 0.8),
              ]);
            }),
          ),
        ),
        const SizedBox(height: 30),
        Text(page.title.tr, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -1, height: 1.1)),
        const SizedBox(height: 12),
        Text(page.description.tr, style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary, height: 1.5)),
        const SizedBox(height: 16),
      ]),
    );
  }
}

class AnimatedDot extends StatelessWidget {
  const AnimatedDot({super.key, required this.isActive});
  final bool isActive;

  @override
  Widget build(BuildContext context) => AnimatedContainer(
        duration: const Duration(milliseconds: 280),
        margin: const EdgeInsets.only(right: 8),
        height: 8,
        width: isActive ? 28 : 8,
        decoration: BoxDecoration(color: isActive ? AppColors.primaryColor : AppColors.textMuted.withValues(alpha: 0.35), borderRadius: BorderRadius.circular(8)),
      );
}
