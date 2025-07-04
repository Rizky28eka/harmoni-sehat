import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/profil_controller.dart';

class DokterProfilBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DokterProfilController>(() => DokterProfilController());
  }
}
