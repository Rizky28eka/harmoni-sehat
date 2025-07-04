import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/dokter_main_controller.dart';

class DokterMainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DokterMainController>(
      () => DokterMainController(),
    );
  }
}
