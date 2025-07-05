import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/dokter_main_controller.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/views/beranda_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/views/jadwal_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/views/chat_screen.dart';

class DokterMainScreen extends GetView<DokterMainController> {
  const DokterMainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(
        () => IndexedStack(
          index: controller.tabIndex.value,
          children: const [
            DokterBerandaScreen(),
            DokterJadwalScreen(),
            DokterChatScreen(),
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
              icon: Icon(Icons.calendar_today_outlined),
              label: 'Jadwal',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.chat_outlined),
              label: 'Chat',
            ),
          ],
        ),
      ),
    );
  }
}
