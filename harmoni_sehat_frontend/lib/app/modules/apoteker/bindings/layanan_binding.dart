import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/layanan_controller.dart';

class ApotekerLayananBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApotekerLayananController>(() => ApotekerLayananController());
  }
}
