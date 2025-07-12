import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/02_auth/bindings/pasien_register_binding.dart';
import '../../features/00_splash/bindings/splash_binding.dart';
import '../../features/00_splash/views/splash_view.dart';
import '../../features/01_onboarding/bindings/onboarding_binding.dart';
import '../../features/01_onboarding/views/onboarding_view.dart';
import '../../features/02_auth/bindings/auth_binding.dart';
import '../../features/02_auth/views/login_view.dart';
import '../../features/02_auth/views/register_view.dart';
import '../../features/02_auth/views/forgot_password_view.dart';
import '../../features/02_auth/views/verify_token_view.dart';
import '../../features/02_auth/views/reset_password_view.dart';
import '../../features/03_dashboard/bindings/dashboard_binding.dart';
import '../../features/03_dashboard/views/dashboard_view.dart';
import '../../features/03_dashboard/views/pasien_dashboard_view.dart';
import '../../features/04_doctor/views/dokter_dashboard_view.dart';
import '../../features/05_pharmac/views/farmasi_dashboard_view.dart';
import '../../features/02_auth/views/pasien_register_view.dart';
import '../../features/02_auth/views/dokter_register_view.dart';
import '../../features/02_auth/views/farmasi_register_view.dart';
import '../../features/04_doctor/bindings/dokter_register_binding.dart';
import '../../features/05_pharmac/bindings/farmasi_register_binding.dart';
import 'app_routes.dart';

class AppPages {
  static final pages = [
    GetPage(
      name: AppRoutes.splash,
      page: () => const SplashView(),
      binding: SplashBinding(),
    ),
    GetPage(
      name: AppRoutes.onboarding,
      page: () => const OnboardingView(),
      binding: OnboardingBinding(),
    ),
    GetPage(
      name: AppRoutes.login,
      page: () => const LoginView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: AppRoutes.register,
      page: () => const RegisterView(),
      binding: AuthBinding(),
    ),

    GetPage(
      name: AppRoutes.dashboard,
      page: () => const DashboardView(),
      binding: DashboardBinding(),
    ),
    GetPage(
      name: AppRoutes.pasienDashboard,
      page: () => const PasienDashboardView(),
      binding: DashboardBinding(),
    ),
    GetPage(
      name: AppRoutes.dokterDashboard,
      page: () => const DokterDashboardView(),
      binding: DashboardBinding(),
    ),
    GetPage(
      name: AppRoutes.farmasiDashboard,
      page: () => const FarmasiDashboardView(),
      binding: DashboardBinding(),
    ),
    GetPage(
      name: AppRoutes.registerPasien,
      page: () => const PasienRegisterView(),
      binding: PasienRegisterBinding(),
    ),
    GetPage(
      name: AppRoutes.registerDokter,
      page: () => const DokterRegisterView(),
      binding: DokterRegisterBinding(),
    ),
    GetPage(
      name: AppRoutes.registerFarmasi,
      page: () => const FarmasiRegisterView(),
      binding: FarmasiRegisterBinding(),
    ),
    GetPage(
      name: AppRoutes.forgotPassword,
      page: () => const ForgotPasswordView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: AppRoutes.verifyResetToken,
      page: () => const VerifyTokenView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: AppRoutes.resetPassword,
      page: () => const ResetPasswordView(),
      binding: AuthBinding(),
    ),
  ];
}
