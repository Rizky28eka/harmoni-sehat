import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/introduction/controllers/introduction_controller.dart';

class IntroductionBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<IntroductionController>(() => IntroductionController());
  }
}
