import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/core/domain/repositories/auth_repository.dart';
import 'package:harmoni_sehat_frontend/shared/models/pharmacist.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';

class FarmasiRegisterController extends GetxController {
  final AuthRepository _authRepository = Get.find<AuthRepository>();
  final StorageService _storageService = Get.find<StorageService>();

  final nameController = TextEditingController();
  final nomorSipaController = TextEditingController();

  final isLoading = false.obs;

  @override
  void onClose() {
    nameController.dispose();
    nomorSipaController.dispose();
    super.onClose();
  }

  Future<void> registerFarmasi() async {
    if (nameController.text.isEmpty || nomorSipaController.text.isEmpty) {
      Get.snackbar('Gagal', 'Semua field harus diisi.',
          backgroundColor: Colors.red, colorText: Colors.white);
      return;
    }

    try {
      isLoading.value = true;
      final userId = _storageService.getUserId();
      if (userId == null) {
        Get.snackbar('Error', 'User ID not found. Please login again.', backgroundColor: Colors.red, colorText: Colors.white);
        isLoading.value = false;
        return;
      }

      final pharmacist = Pharmacist(
        id: userId,
        nama: nameController.text,
        nomorSipa: nomorSipaController.text,
      );
      await _authRepository.registerPharmacist(pharmacist);
      isLoading.value = false;
      Get.snackbar('Sukses', 'Registrasi Farmasi berhasil!', backgroundColor: Colors.green, colorText: Colors.white);
      Get.offAllNamed(AppRoutes.login);
    } catch (e) {
      isLoading.value = false;
      Get.snackbar('Gagal', e.toString(), backgroundColor: Colors.red, colorText: Colors.white);
    }
  }
}