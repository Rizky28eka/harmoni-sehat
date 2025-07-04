import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/apoteker_main_controller.dart';

class ApotekerMainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApotekerMainController>(
      () => ApotekerMainController(),
    );
  }
}
