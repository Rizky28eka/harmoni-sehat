import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
          onTap: (index) {
            HapticFeedback.lightImpact(); // Add haptic feedback
            controller.changeTabIndex(index);
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white, // White background
          selectedItemColor: const Color(0xFF7C3AED), // Active tab color
          unselectedItemColor: Colors.grey, // Inactive tab color
          showUnselectedLabels: true,
          selectedLabelStyle: const TextStyle(fontSize: 12), // Small text
          unselectedLabelStyle: const TextStyle(fontSize: 12), // Small text
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              label: 'Beranda',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.medical_services_outlined),
              label: 'Layanan',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
