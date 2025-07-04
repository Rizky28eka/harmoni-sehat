import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/layanan_controller.dart';

class DokterLayananBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DokterLayananController>(() => DokterLayananController());
  }
}
