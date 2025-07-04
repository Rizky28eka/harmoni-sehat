import 'package:flutter/material.dart';
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
          onTap: controller.changeTabIndex,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Beranda',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today),
              label: 'Jadwal',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.chat),
              label: 'Chat',
            ),
          ],
        ),
      ),
    );
  }
}
