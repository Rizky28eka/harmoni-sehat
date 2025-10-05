import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/shared/models/dokter.dart';
import 'package:harmoni_sehat_frontend/shared/models/pasien.dart';
import 'package:harmoni_sehat_frontend/shared/models/pharmacist.dart';
import '../../../app/routes/app_routes.dart';
import '../../../shared/services/storage_service.dart';
import '../../../core/domain/repositories/auth_repository.dart';

class AuthController extends GetxController {
  final AuthRepository _authRepository;
  final StorageService _storageService = Get.find<StorageService>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final nameController = TextEditingController(); // For registration
  final tokenController = TextEditingController(); // For password reset token
  final newPasswordController = TextEditingController(); // For new password

  final selectedRole = 'pasien'.obs; // Default selected role for login
  final selectedRegisterRole =
      'pasien'.obs; // Default selected role for registration

  final isLoading = false.obs;
  final isPasswordVisible = false.obs;

  AuthController(this._authRepository);

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    nameController.dispose();
    tokenController.dispose();
    newPasswordController.dispose();
    super.onClose();
  }

  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  Future<void> login() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Email dan password tidak boleh kosong.',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    try {
      isLoading.value = true;
      final response = await _authRepository.login(
        emailController.text,
        passwordController.text,
      );
      await _storageService.saveToken(response.token);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Login Berhasil!',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );

      // Redirect based on user role
      if (response.user.role == 'pasien') {
        Get.offAllNamed(AppRoutes.pasienDashboard);
      } else if (response.user.role == 'dokter') {
        Get.offAllNamed(AppRoutes.dokterDashboard);
      } else if (response.user.role == 'farmasi') {
        Get.offAllNamed(AppRoutes.farmasiDashboard);
      } else {
        // Default or error case
        Get.offAllNamed(AppRoutes.dashboard);
      }
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

  Future<void> register() async {
    if (nameController.text.isEmpty ||
        emailController.text.isEmpty ||
        passwordController.text.isEmpty) {
      Get.snackbar('Gagal', 'Nama, Email, dan Password harus diisi.',
          backgroundColor: Colors.red, colorText: Colors.white);
      return;
    }

    try {
      isLoading.value = true;
      final response = await _authRepository.register(
        nameController.text,
        emailController.text,
        passwordController.text,
        selectedRegisterRole.value,
      );

      // Save user ID and role for the next step (profile completion)
      await _storageService.saveUserId(response.user.id);
      await _storageService.saveUserRole(response.user.role);

      isLoading.value = false;
      Get.snackbar(
        'Registrasi Awal Berhasil',
        'Silakan lengkapi data profil Anda.',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );

      // Navigate to the specific profile completion page
      switch (selectedRegisterRole.value) {
        case 'pasien':
          Get.offNamed(AppRoutes.registerPasien);
          break;
        case 'dokter':
          Get.offNamed(AppRoutes.registerDokter);
          break;
        case 'farmasi':
          Get.offNamed(AppRoutes.registerFarmasi);
          break;
        default:
          Get.offAllNamed(AppRoutes.login); // Fallback
      }
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

  // New methods for role-specific registration
  Future<void> registerPasien(Pasien pasien) async {
    try {
      isLoading.value = true;
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

  Future<void> registerDokter(Dokter dokter) async {
    try {
      isLoading.value = true;
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

  Future<void> registerFarmasi(Pharmacist pharmacist) async {
    try {
      isLoading.value = true;
      await _authRepository.registerPharmacist(pharmacist);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Registrasi Farmasi berhasil!',
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

  // --- Password Reset Methods ---

  Future<void> forgotPassword() async {
    if (emailController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Email tidak boleh kosong.',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }
    try {
      isLoading.value = true;
      await _authRepository.forgotPassword(emailController.text);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Link reset password telah dikirim ke email Anda.',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      Get.toNamed(
        AppRoutes.verifyResetToken,
      ); // Navigate to token verification screen
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

  Future<void> verifyResetToken() async {
    if (tokenController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Token tidak boleh kosong.',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }
    try {
      isLoading.value = true;
      await _authRepository.verifyResetToken(tokenController.text);
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Token berhasil diverifikasi.',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      Get.toNamed(
        AppRoutes.resetPassword,
        arguments: tokenController.text,
      ); // Navigate to reset password screen with token
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

  Future<void> resetPassword() async {
    if (newPasswordController.text.isEmpty || tokenController.text.isEmpty) {
      Get.snackbar(
        'Gagal',
        'Password baru dan token tidak boleh kosong.',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }
    try {
      isLoading.value = true;
      await _authRepository.resetPassword(
        tokenController.text,
        newPasswordController.text,
      );
      isLoading.value = false;
      Get.snackbar(
        'Sukses',
        'Password berhasil direset.',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      Get.offAllNamed(AppRoutes.login); // Navigate back to login screen
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
