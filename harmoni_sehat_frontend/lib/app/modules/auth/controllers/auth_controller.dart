import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/models/user_model.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/auth_provider.dart'; // Ganti ke provider
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

class AuthController extends GetxController {
  final AuthProvider _authProvider =
      Get.find<AuthProvider>(); // Ganti ke provider

  final RxBool isLoading = false.obs;
  final Rx<User?> currentUser = Rx<User?>(null);

  // Form Key
  final GlobalKey<FormState> registerFormKey = GlobalKey<FormState>();

  // Role selectors
  final RxString selectedRole = 'Pasien'.obs;
  final RxString selectedLoginRole = 'Pasien'.obs;

  // Text editing controllers
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController =
      TextEditingController(); // Tambah controller HP
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();
  final TextEditingController strController = TextEditingController();
  final TextEditingController specializationController =
      TextEditingController();
  final TextEditingController straController = TextEditingController();
  final TextEditingController pharmacyNameController = TextEditingController();
  final TextEditingController verificationCodeController =
      TextEditingController();
  final RxString errorMessage = ''.obs;

  @override
  void onClose() {
    // Dispose controllers
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    strController.dispose();
    specializationController.dispose();
    straController.dispose();
    pharmacyNameController.dispose();
    verificationCodeController.dispose();
    super.onClose();
  }

  void selectRole(String role) {
    selectedRole.value = role;
  }

  void selectLoginRole(String role) {
    selectedLoginRole.value = role;
  }

  Future<void> register() async {
    // 1. Validasi form
    if (!registerFormKey.currentState!.validate()) {
      Get.snackbar(
        'Error',
        'Harap isi semua field dengan benar.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    isLoading.value = true;
    try {
      final String role = selectedRole.value.toLowerCase();
      Map<String, dynamic> userData = {
        'nama_lengkap': nameController.text,
        'email': emailController.text,
        'password': passwordController.text,
        'no_hp': phoneController.text, // Ambil dari controller
        'role': role,
      };

      if (role == 'dokter') {
        userData['nomor_sip'] = strController.text;
        userData['spesialisasi'] = specializationController.text;
      } else if (role == 'apoteker') {
        userData['nomor_stra'] = straController.text;
        userData['alamat_tempat_kerja'] = pharmacyNameController.text;
      }

      await _authProvider.register(userData); // Panggil provider

      Get.snackbar(
        'Sukses',
        'Registrasi berhasil! Silakan login.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      Get.offAllNamed(Routes.LOGIN);
    } catch (e) {
      // Menampilkan pesan error dari backend
      Get.snackbar(
        'Registrasi Gagal',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> login() async {
    isLoading.value = true;
    errorMessage.value = ''; // Clear previous errors
    try {
      final String role = selectedLoginRole.value.toLowerCase();
      Map<String, dynamic> loginData = {
        'email': emailController.text,
        'password': passwordController.text,
        'role': role,
      };

      final loginResponse = await _authProvider.login(loginData);
      currentUser.value = User(
        id: loginResponse['userId'],
        name: loginResponse['name'],
        email: emailController.text,
        role: loginResponse['role'],
        
      );
      Get.snackbar(
        'Sukses',
        'Login berhasil!',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      // Navigate to role-specific home page
      String homeRoute;
      switch (loginResponse['role']) {
        case 'pasien':
          homeRoute = Routes.PASIEN_MAIN;
          break;
        case 'dokter':
          homeRoute = Routes.DOKTER_MAIN;
          break;
        case 'apoteker':
          homeRoute = Routes.APOTEKER_MAIN;
          break;
        default:
          homeRoute = Routes.LOGIN; // Fallback or error page
          Get.snackbar('Error', 'Role tidak dikenal: ${loginResponse['role']}',
              snackPosition: SnackPosition.BOTTOM, backgroundColor: Colors.red, colorText: Colors.white);
          break;
      }
      Get.offAllNamed(homeRoute);
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar(
        'Login Gagal',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> forgotPassword() async {
    isLoading.value = true;
    try {
      // Implement forgot password logic here
      // This might involve sending an email with a reset link or OTP
      Get.snackbar(
        'Info',
        'Fitur lupa password akan segera diimplementasikan.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.blue,
        colorText: Colors.white,
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> signInWithGoogle() async {
    isLoading.value = true;
    try {
      // Implement Google Sign-In logic here
      Get.snackbar(
        'Info',
        'Fitur Google Sign-In akan segera diimplementasikan.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.blue,
        colorText: Colors.white,
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyCode() async {
    isLoading.value = true;
    try {
      // Implement OTP verification logic here
      Get.snackbar(
        'Info',
        'Verifikasi kode akan segera diimplementasikan.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.blue,
        colorText: Colors.white,
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
