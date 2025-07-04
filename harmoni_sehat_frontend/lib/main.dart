import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

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
}
