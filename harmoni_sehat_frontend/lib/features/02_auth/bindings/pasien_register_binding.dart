import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/02_auth/controllers/pasien_register_controller.dart';

class PasienRegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PasienRegisterController>(() => PasienRegisterController());
  }
}