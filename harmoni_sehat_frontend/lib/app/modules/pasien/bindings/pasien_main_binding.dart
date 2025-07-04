import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/pasien_main_controller.dart';

class PasienMainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PasienMainController>(
      () => PasienMainController(),
    );
  }
}
