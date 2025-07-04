import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/apoteker_main_controller.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/views/beranda_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/views/layanan_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/views/profil_screen.dart';

class ApotekerMainScreen extends GetView<ApotekerMainController> {
  const ApotekerMainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(
        () => IndexedStack(
          index: controller.tabIndex.value,
          children: const [
            ApotekerBerandaScreen(),
            ApotekerLayananScreen(),
            ApotekerProfilScreen(),
          ],
        ),
      ),
      bottomNavigationBar: Obx(
        () => BottomNavigationBar(
          currentIndex: controller.tabIndex.value,
          onTap: controller.changeTabIndex,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Beranda',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.medical_services),
              label: 'Layanan',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
