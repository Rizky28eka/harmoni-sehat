import 'package:get/get.dart';
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
import 'package:harmoni_sehat_frontend/app/modules/apoteker/bindings/apoteker_home_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/views/apoteker_home_view.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/bindings/dokter_home_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/views/dokter_home_view.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/bindings/pasien_home_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/pasien_home_view.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/bindings/layanan_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/layanan_view.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/bindings/profil_binding.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/profil_view.dart';

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
    // GetPage(
    //   name: Routes.HOME, // This route can be removed or repurposed
    //   page: () => HomePage(),
    //   binding: HomeBinding(),
    // ),
    GetPage(
      name: Routes.PASIEN_HOME,
      page: () => const PasienHomeView(),
      binding: PasienHomeBinding(),
    ),
    GetPage(
      name: Routes.PASIEN_LAYANAN,
      page: () => const LayananView(),
      binding: LayananBinding(),
    ),
    GetPage(
      name: Routes.PASIEN_PROFIL,
      page: () => ProfilView(),
      binding: ProfilBinding(),
    ),
    GetPage(
      name: Routes.DOKTER_HOME,
      page: () => const DokterHomeView(),
      binding: DokterHomeBinding(),
    ),
    GetPage(
      name: Routes.APOTEKER_HOME,
      page: () => ApotekerHomeView(),
      binding: ApotekerHomeBinding(),
    ),
  ];
}
