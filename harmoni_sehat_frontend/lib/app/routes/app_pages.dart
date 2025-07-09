import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/onboarding/bindings/onboarding_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/onboarding/views/onboarding_view.dart';
import 'package:harmoni_sehat_frontend/app/modules/splash/bindings/splash_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/splash/views/splash_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.SPLASH;

  static final routes = [
    GetPage(
      name: _Paths.SPLASH,
      page: () => const SplashView(),
      binding: SplashBinding(),
    ),
    GetPage(
      name: _Paths.ONBOARDING,
      page: () => const OnboardingView(),
      binding: OnboardingBinding(),
    ),
  ];
}
