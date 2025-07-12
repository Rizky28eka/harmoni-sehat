import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/core/domain/repositories/auth_repository.dart';
import 'package:harmoni_sehat_frontend/shared/models/pasien.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';

class PasienRegisterController extends GetxController {
  final AuthRepository _authRepository = Get.find<AuthRepository>();
  final StorageService _storageService = Get.find<StorageService>();

  final nameController = TextEditingController();
  final nikController = TextEditingController();
  final tanggalLahirController = TextEditingController();
  final jenisKelamin = 'Laki-laki'.obs; // Default value
  final alamatController = TextEditingController();
  final noTeleponController = TextEditingController();

  final isLoading = false.obs;

  @override
  void onClose() {
    nameController.dispose();
    nikController.dispose();
    tanggalLahirController.dispose();
    alamatController.dispose();
    noTeleponController.dispose();
    super.onClose();
  }

  void selectDate(BuildContext context) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (pickedDate != null) {
      tanggalLahirController.text = pickedDate.toIso8601String().split('T')[0];
    }
  }

  Future<void> registerPasien() async {
    if (nameController.text.isEmpty ||
        nikController.text.isEmpty ||
        tanggalLahirController.text.isEmpty ||
        alamatController.text.isEmpty ||
        noTeleponController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Semua field harus diisi.',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    try {
      isLoading.value = true;
      final userId = _storageService.getUserId();
      if (userId == null) {
        Get.snackbar(
          'Error',
          'User ID not found. Please login again.',
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        isLoading.value = false;
        return;
      }

      final pasien = Pasien(
        id: userId,
        nama: nameController.text,
        nik: nikController.text,
        tanggalLahir: DateTime.parse(tanggalLahirController.text),
        jenisKelamin: jenisKelamin.value,
        alamat: alamatController.text,
        noTelepon: noTeleponController.text,
      );
      await _authRepository.registerPasien(pasien);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Registrasi Pasien berhasil!',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      Get.offAllNamed(AppRoutes.login);
    } catch (e) {
      isLoading.value = false;
      Get.snackbar(
        'Gagal',
        e.toString(),
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }
}
