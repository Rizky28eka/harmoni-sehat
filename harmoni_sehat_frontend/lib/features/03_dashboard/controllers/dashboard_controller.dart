import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_routes.dart';
import 'package:harmoni_sehat_frontend/shared/services/storage_service.dart';

class DashboardController extends GetxController {
  final StorageService _storageService = Get.find<StorageService>();

  void logout() async {
    await _storageService.removeToken();
    Get.offAllNamed(AppRoutes.login);
  }
}