import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';
import 'package:harmoni_sehat_frontend/app/controllers/auth_controller.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); // Pastikan Flutter binding diinisialisasi
  await initServices(); // Panggil fungsi inisialisasi servis
  runApp(
    GetMaterialApp(
      title: "Harmoni Sehat",
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
      debugShowCheckedModeBanner: false,
    ),
  );
}

Future<void> initServices() async {
  // Inisialisasi SharedPreferences
  final prefs = await SharedPreferences.getInstance();
  // Daftarkan SharedPreferences dengan GetX
  Get.put<SharedPreferences>(prefs);

  // Daftarkan AuthService dan AuthController secara permanen
  Get.put(AuthService(), permanent: true);
  Get.put(AuthController(), permanent: true);
}