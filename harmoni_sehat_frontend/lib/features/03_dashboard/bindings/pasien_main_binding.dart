import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/controllers/pasien_main_controller.dart';

class PasienMainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PasienMainController>(() => PasienMainController());
  }
}
