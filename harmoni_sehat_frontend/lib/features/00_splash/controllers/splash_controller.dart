import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';

class SplashController extends GetxController {
  final storage = GetStorage();
  final StorageService _storageService = Get.find<StorageService>();

  @override
  void onReady() {
    super.onReady();
    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    await Future.delayed(const Duration(seconds: 2));

    final bool hasSeenOnboarding = storage.read('hasSeenOnboarding') ?? false;

    if (!hasSeenOnboarding) {
      Get.offAllNamed(AppRoutes.onboarding);
    } else {
      final bool tokenValid = await _storageService.validateToken();
      if (tokenValid) {
        final userRole = _storageService.getUserRole();
        if (userRole == 'pasien') {
          Get.offAllNamed(AppRoutes.pasienDashboard);
        } else if (userRole == 'dokter') {
          Get.offAllNamed(AppRoutes.dokterDashboard);
        } else if (userRole == 'farmasi') {
          Get.offAllNamed(AppRoutes.farmasiDashboard);
        } else {
          // Default or error case if role is not recognized
          Get.offAllNamed(AppRoutes.login);
        }
      } else {
        Get.offAllNamed(AppRoutes.login);
      }
    }
  }
}
