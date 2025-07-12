import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/04_doctor/controllers/dokter_register_controller.dart';

class DokterRegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DokterRegisterController>(() => DokterRegisterController());
  }
}
