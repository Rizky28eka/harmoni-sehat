
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/pasien_home_controller.dart';

class PasienHomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PasienHomeController>(
      () => PasienHomeController(),
    );
  }
}
