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
    print('SplashController: onReady called');
    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    print('SplashController: _navigateToNextScreen called');
    await Future.delayed(const Duration(seconds: 2));
    print('SplashController: Delay finished');

    final bool hasSeenOnboarding = storage.read('hasSeenOnboarding') ?? false;
    print('SplashController: hasSeenOnboarding = $hasSeenOnboarding');

    if (!hasSeenOnboarding) {
      print('SplashController: Navigating to onboarding');
      Get.offAllNamed(AppRoutes.onboarding);
    } else {
      final bool tokenValid = await _storageService.validateToken();
      print('SplashController: tokenValid = $tokenValid');
      if (tokenValid) {
        final userRole = _storageService.getUserRole();
        print('SplashController: userRole = $userRole');
        if (userRole == 'pasien') {
          Get.offAllNamed(AppRoutes.pasienDashboard);
        } else if (userRole == 'dokter') {
          Get.offAllNamed(AppRoutes.dokterDashboard);
        } else if (userRole == 'farmasi') {
          Get.offAllNamed(AppRoutes.farmasiDashboard);
        } else {
          // Default or error case if role is not recognized
          print('SplashController: Unknown role, navigating to login');
          Get.offAllNamed(AppRoutes.login);
        }
      } else {
        print('SplashController: Navigating to login');
        Get.offAllNamed(AppRoutes.login);
      }
    }
  }
}
