import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/bindings/introduction_binding.dart';
import 'package:harmoni_sehat_frontend/app/bindings/splash_screen_binding.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/auth/forgot_password_page.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/auth/verification_page.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/introduction/introduction_page.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/splash_screen/splash_screen_page.dart';
import '../bindings/auth_binding.dart';
import '../bindings/home_binding.dart';
import '../ui/pages/auth/login_page.dart';
import '../ui/pages/auth/register_page.dart';
import '../ui/pages/home/home_page.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.SPLASH; // Mengubah INITIAL ke SPLASH

  static final routes = [
    GetPage(
      name: Routes.SPLASH,
      page: () => const SplashScreenPage(),
      binding: SplashScreenBinding(),
    ),
    GetPage(
      name: Routes.INTRODUCTION,
      page: () => const IntroductionPage(),
      binding: IntroductionBinding(),
    ),
    GetPage(
      name: Routes.LOGIN,
      page: () => LoginPage(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.REGISTER,
      page: () => RegisterPage(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.FORGOT_PASSWORD,
      page: () => const ForgotPasswordPage(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.VERIFICATION,
      page: () => const VerificationPage(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.HOME,
      page: () => HomePage(),
      binding: HomeBinding(),
    ),
  ];
}

