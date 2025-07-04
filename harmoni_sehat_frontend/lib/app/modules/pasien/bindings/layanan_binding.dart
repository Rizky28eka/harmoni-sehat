import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/layanan_controller.dart';

class LayananBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LayananController>(() => LayananController());
  }
}
