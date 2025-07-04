import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/profil_controller.dart';

class ProfilBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ProfilController>(() => ProfilController());
  }
}
