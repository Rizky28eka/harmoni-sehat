
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/apoteker_home_controller.dart';

class ApotekerHomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApotekerHomeController>(
      () => ApotekerHomeController(),
    );
  }
}
