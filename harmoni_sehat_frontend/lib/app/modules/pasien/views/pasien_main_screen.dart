import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/pasien_main_controller.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/beranda_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/jadwal_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/chat_screen.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/views/profil_screen.dart';

class PasienMainScreen extends GetView<PasienMainController> {
  const PasienMainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(
        () => IndexedStack(
          index: controller.tabIndex.value,
          children: const [
            PasienBerandaScreen(),
            PasienJadwalScreen(),
            PasienChatScreen(),
            PasienProfilScreen(),
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
