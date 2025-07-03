import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized(); // Pastikan Flutter binding diinisialisasi
  runApp(
    GetMaterialApp(
      title: "Harmoni Sehat",
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
      debugShowCheckedModeBanner: false,
    ),
  );
}
