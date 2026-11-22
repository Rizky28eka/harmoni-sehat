import 'package:get/get.dart';

import '../../core/api_client.dart';
import '../../features/00_splash/bindings/splash_binding.dart';
import '../../features/00_splash/views/splash_view.dart';
import '../../features/01_onboarding/bindings/onboarding_binding.dart';
import '../../features/01_onboarding/views/onboarding_view.dart';
import '../../features/admin/admin_shell.dart';
import '../../features/auth/auth_controller.dart';
import '../../features/auth/auth_repository.dart';
import '../../features/auth/auth_views.dart';
import '../../features/common/chat_view.dart';
import '../../features/common/notifications_view.dart';
import '../../features/doctor/doctor_shell.dart';
import '../../features/patient/ai_articles.dart';
import '../../features/patient/consultations.dart';
import '../../features/patient/doctors.dart';
import '../../features/patient/patient_shell.dart';
import '../../features/patient/records.dart';
import '../../features/patient/shop.dart';
import '../../features/pharmacist/pharmacist_shell.dart';
import 'app_routes.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => AuthController(Get.find<AuthRepository>()));
    Get.lazyPut(() => RegisterController(Get.find<AuthRepository>(), Get.find<ApiClient>()));
  }
}

class AppPages {
  static final pages = [
    GetPage(name: AppRoutes.splash, page: () => const SplashView(), binding: SplashBinding()),
    GetPage(name: AppRoutes.onboarding, page: () => const OnboardingView(), binding: OnboardingBinding()),
    GetPage(name: AppRoutes.login, page: () => const LoginView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.register, page: () => const RegisterView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.forgotPassword, page: () => const ForgotPasswordView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.verifyResetToken, page: () => const VerifyTokenView(), binding: AuthBinding()),
    GetPage(name: AppRoutes.resetPassword, page: () => const ResetPasswordView(), binding: AuthBinding()),

    GetPage(name: AppRoutes.pasienHome, page: () => const PatientShell()),
    GetPage(name: AppRoutes.dokterHome, page: () => const DoctorShell()),
    GetPage(name: AppRoutes.farmasiHome, page: () => const PharmacistShell()),
    GetPage(name: AppRoutes.adminHome, page: () => const AdminShell()),

    GetPage(name: AppRoutes.doctors, page: () => const DoctorListView()),
    GetPage(name: AppRoutes.doctorDetail, page: () => const DoctorDetailView()),
    GetPage(name: AppRoutes.consultation, page: () => const ConsultationDetailView()),
    GetPage(name: AppRoutes.chat, page: () => const ChatView()),
    GetPage(name: AppRoutes.payment, page: () => const PaymentView()),
    GetPage(name: AppRoutes.shop, page: () => const ShopView()),
    GetPage(name: AppRoutes.cart, page: () => const CartView()),
    GetPage(name: AppRoutes.orderDetail, page: () => const OrderDetailView()),
    GetPage(name: AppRoutes.reminders, page: () => const RemindersView()),
    GetPage(name: AppRoutes.aiChat, page: () => const AiChatView()),
    GetPage(name: AppRoutes.articles, page: () => const ArticlesView()),
    GetPage(name: AppRoutes.articleDetail, page: () => const ArticleDetailView()),
    GetPage(name: AppRoutes.notifications, page: () => const NotificationsView()),
    GetPage(name: AppRoutes.completeConsultation, page: () => const CompleteConsultationView()),
  ];
}
