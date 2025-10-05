import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/theme/app_colors.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/controllers/pasien_main_controller.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/views/tabs/appointments_tab_view.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/views/tabs/home_tab_view.dart';
import 'package:harmoni_sehat_frontend/features/03_dashboard/views/tabs/profile_tab_view.dart';

class PasienMainView extends GetView<PasienMainController> {
  const PasienMainView({super.key});

  static final List<Widget> _widgetOptions = <Widget>[
    const HomeTabView(),
    const AppointmentsTabView(),
    const ProfileTabView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(() => _widgetOptions.elementAt(controller.selectedIndex.value)),
      bottomNavigationBar: Obx(
        () => BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Beranda',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today_outlined),
              activeIcon: Icon(Icons.calendar_today),
              label: 'Janji Temu',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
          currentIndex: controller.selectedIndex.value,
          onTap: controller.onItemTapped,
          selectedItemColor: AppColors.primaryColor,
          unselectedItemColor: AppColors.textSecondary,
          showUnselectedLabels: true,
        ),
      ),
    );
  }
}
