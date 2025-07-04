import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/profil_controller.dart';

class ApotekerProfilBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApotekerProfilController>(() => ApotekerProfilController());
  }
}
