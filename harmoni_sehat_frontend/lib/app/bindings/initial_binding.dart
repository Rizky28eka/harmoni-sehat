import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/shared/services/api_provider.dart';
import 'package:harmoni_sehat_frontend/shared/services/storage_service.dart';

class InitialBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(StorageService(), permanent: true);
    Get.put(ApiProvider(), permanent: true);
  }
}
