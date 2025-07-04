import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/bindings/auth_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/views/forgot_password_page.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/views/login_page.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/views/register_page.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/views/verification_page.dart';
import 'package:harmoni_sehat_frontend/app/modules/introduction/bindings/introduction_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/introduction/views/introduction_page.dart';
import 'package:harmoni_sehat_frontend/app/modules/splash_screen/bindings/splash_screen_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/splash_screen/views/splash_screen_page.dart';

import 'package:harmoni_sehat_frontend/app/modules/pasien/bindings/pasien_main_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/pasien_main_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/bindings/dokter_main_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/views/dokter_main_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/bindings/apoteker_main_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/views/apoteker_main_screen.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL =
      Routes.SPLASH; // Changed to SPLASH for better startup flow

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
      name: Routes.PASIEN_MAIN,
      page: () => const PasienMainScreen(),
      binding: PasienMainBinding(),
    ),
    GetPage(
      name: Routes.DOKTER_MAIN,
      page: () => const DokterMainScreen(),
      binding: DokterMainBinding(),
    ),
    GetPage(
      name: Routes.APOTEKER_MAIN,
      page: () => const ApotekerMainScreen(),
      binding: ApotekerMainBinding(),
    ),
  ];
}
