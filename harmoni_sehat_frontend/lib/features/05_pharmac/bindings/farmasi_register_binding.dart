import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/05_pharmac/controllers/farmasi_register_controller.dart';

class FarmasiRegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<FarmasiRegisterController>(() => FarmasiRegisterController());
  }
}
