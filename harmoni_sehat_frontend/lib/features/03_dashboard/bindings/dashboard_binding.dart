import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/controllers/dashboard_controller.dart';

class DashboardBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DashboardController>(() => DashboardController());
  }
}