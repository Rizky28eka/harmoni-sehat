import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../../../app/routes/app_routes.dart';
import '../../../core/session.dart';
import '../../auth/auth_controller.dart' show homeRouteFor;
import '../../../core/socket_service.dart';
import '../../auth/auth_repository.dart';

class SplashController extends GetxController {
  final _storage = GetStorage();
  final _session = Get.find<SessionService>();

  @override
  void onReady() {
    super.onReady();
    _next();
  }

  Future<void> _next() async {
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!(_storage.read('hasSeenOnboarding') ?? false)) {
      return Get.offAllNamed(AppRoutes.onboarding);
    }
    if (!_session.isLoggedIn) return Get.offAllNamed(AppRoutes.login);
    try {
      // Validates the stored token (refreshing it when needed) and loads the profile.
      await Get.find<AuthRepository>().loadProfile();
      Get.find<SocketService>().connect();
      Get.offAllNamed(homeRouteFor(_session.role));
    } catch (_) {
      // Offline start keeps the cached session; a rejected refresh already cleared it.
      Get.offAllNamed(_session.isLoggedIn ? homeRouteFor(_session.role) : AppRoutes.login);
    }
  }
}
