import 'package:get/get.dart';

import '../../core/api_client.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';
import '../../core/theme_controller.dart';
import '../../features/auth/auth_repository.dart';

/// Services that live for the whole app. SessionService is created (and initialised) in main().
class InitialBinding extends Bindings {
  @override
  void dependencies() {
    final session = Get.find<SessionService>();
    Get.put(ApiClient(session), permanent: true);
    Get.put(SocketService(session), permanent: true);
    Get.put(SettingsController(), permanent: true);
    Get.put(AuthRepository(Get.find(), session, Get.find()), permanent: true);
  }
}
