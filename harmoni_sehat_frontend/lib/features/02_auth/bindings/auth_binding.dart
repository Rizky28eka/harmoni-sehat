import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/02_auth/controllers/auth_controller.dart';
import 'package:harmoni_sehat_frontend/core/domain/repositories/auth_repository.dart';
import 'package:harmoni_sehat_frontend/shared/services/api_provider.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AuthRepository>(() => AuthRepository(Get.find<ApiProvider>()));
    Get.lazyPut<AuthController>(
      () => AuthController(Get.find<AuthRepository>()),
    );
  }
}
