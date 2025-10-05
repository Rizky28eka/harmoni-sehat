import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_routes.dart';
import 'package:harmoni_sehat_frontend/shared/services/storage_service.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_primary_button.dart';

class ProfileTabView extends StatelessWidget {
  const ProfileTabView({super.key});

  @override
  Widget build(BuildContext context) {
    final StorageService storageService = Get.find<StorageService>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil Saya'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const CircleAvatar(
                radius: 60,
                // Placeholder for user image
                child: Icon(Icons.person, size: 60),
              ),
              const SizedBox(height: 16),
              const Text(
                'Nama Pengguna', // Placeholder
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'email@pengguna.com', // Placeholder
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const Spacer(),
              CustomPrimaryButton(
                onPressed: () async {
                  await storageService.removeToken();
                  Get.offAllNamed(AppRoutes.login);
                },
                child: const Text('Logout'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
