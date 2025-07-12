import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/core/domain/repositories/auth_repository.dart';
import 'package:harmoni_sehat_frontend/shared/models/dokter.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';

class DokterRegisterController extends GetxController {
  final AuthRepository _authRepository = Get.find<AuthRepository>();
  final StorageService _storageService = Get.find<StorageService>();

  final nameController = TextEditingController();
  final nomorStrController = TextEditingController();
  final biayaKonsultasiController = TextEditingController();
  final spesialisasiIdController =
      TextEditingController(); // For specialization ID
  final fotoController = TextEditingController(); // For photo URL
  final bioController = TextEditingController(); // For bio

  final isLoading = false.obs;

  @override
  void onClose() {
    nameController.dispose();
    nomorStrController.dispose();
    biayaKonsultasiController.dispose();
    spesialisasiIdController.dispose();
    fotoController.dispose();
    bioController.dispose();
    super.onClose();
  }

  Future<void> registerDokter() async {
    if (nameController.text.isEmpty ||
        nomorStrController.text.isEmpty ||
        biayaKonsultasiController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Nama, Nomor STR, dan Biaya Konsultasi harus diisi.',
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

      final dokter = Dokter(
        id: userId,
        nama: nameController.text,
        nomorStr: nomorStrController.text,
        biayaKonsultasi: double.parse(biayaKonsultasiController.text),
        spesialisasiId: spesialisasiIdController.text.isEmpty
            ? null
            : spesialisasiIdController.text, // Optional
        foto: fotoController.text.isEmpty
            ? null
            : fotoController.text, // Optional
        bio: bioController.text.isEmpty ? null : bioController.text, // Optional
      );
      await _authRepository.registerDokter(dokter);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Registrasi Dokter berhasil!',
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
