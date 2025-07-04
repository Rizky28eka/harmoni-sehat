
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/dokter_home_controller.dart';

class DokterHomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DokterHomeController>(
      () => DokterHomeController(),
    );
  }
}
