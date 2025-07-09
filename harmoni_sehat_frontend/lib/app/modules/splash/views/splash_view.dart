import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/splash/controllers/splash_controller.dart';
import 'package:harmoni_sehat_frontend/app/utils/app_colors.dart';
import 'package:harmoni_sehat_frontend/app/utils/app_font_sizes.dart';

class SplashView extends GetView<SplashController> {
  const SplashView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          AppColors.primaryColor, // Menggunakan warna dari AppColors
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Anda bisa menambahkan logo atau gambar di sini
            const Icon(Icons.health_and_safety, size: 100, color: Colors.white),
            const SizedBox(height: 20),
            Text(
              'Harmoni Sehat', // Menggunakan terjemahan
              style: TextStyle(
                fontSize: AppFontSizes
                    .heading1, // Menggunakan ukuran font dari AppFontSizes
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Selamat datang di Harmoni Sehat!', // Menggunakan terjemahan
              style: TextStyle(
                fontSize: AppFontSizes.large,
                color: Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
