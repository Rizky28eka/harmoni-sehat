import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';

class DokterDashboardView extends GetView {
  const DokterDashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    final StorageService storageService = Get.find<StorageService>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Dokter'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await storageService.removeToken();
              Get.offAllNamed(AppRoutes.login);
            },
          ),
        ],
      ),
      body: const Center(
        child: Text('Selamat Datang, Dokter!'),
      ),
    );
  }
}