import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/data/models/user_model.dart';
import 'package:harmoni_sehat_frontend/app/data/providers/auth_service.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

class AuthController extends GetxController {
  final AuthService _authService = Get.find<AuthService>();

  final RxBool isLoading = false.obs;
  final RxString errorMessage = ''.obs;
  final Rx<User?> currentUser = Rx<User?>(null);

  // New properties for registration
  final RxString selectedRole = 'Pasien'.obs;
  final RxString selectedLoginRole = 'Pasien'.obs;
  final PageController pageController = PageController();

  // Text editing controllers
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
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

  @override
  void onInit() {
    super.onInit();
    // Initial navigation is handled by SplashScreenController.
  }

  // This method is for checking authentication status, not for initial navigation.
  void checkAuthStatus() async {
    if (_authService.isAuthenticated()) {
      print('User is authenticated. Token: ${_authService.getToken()}');
    } else {
      print('User is not authenticated.');
    }
  }

  void selectRole(String role) {
    selectedRole.value = role;
  }

  void selectLoginRole(String role) {
    selectedLoginRole.value = role;
  }

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      final response = await _authService.login(
        email,
        password,
        selectedLoginRole.value.toLowerCase(),
      );
      if (response != null) {
        final String? userRole = _authService.getUserRole();
        if (userRole != null) {
          switch (userRole) {
            case 'pasien':
              Get.offAllNamed(Routes.PASIEN_HOME);
              break;
            case 'dokter':
              Get.offAllNamed(Routes.DOKTER_HOME);
              break;
            case 'apoteker':
              Get.offAllNamed(Routes.APOTEKER_HOME);
              break;
            default:
              Get.offAllNamed(Routes.HOME); // Fallback or error page
              break;
          }
        } else {
          // If role is null, navigate to a default home or login again
          Get.offAllNamed(Routes.HOME);
        }
      }
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Login Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> register() async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // Basic validation
      if (passwordController.text != confirmPasswordController.text) {
        throw Exception("Passwords do not match");
      }

      final String role = selectedRole.value.toLowerCase();
      Map<String, dynamic> userData = {
        'nama_lengkap': nameController.text,
        'email': emailController.text,
        'password': passwordController.text,
        'no_hp': '081234567890', // Placeholder, adjust as needed
        'role': role,
      };

      if (role == 'dokter') {
        userData['nomor_sip'] = strController.text;
        userData['spesialisasi'] = specializationController.text;
      } else if (role == 'apoteker') {
        userData['nomor_stra'] = straController.text;
        userData['alamat_tempat_kerja'] = pharmacyNameController.text;
      }

      final user = await _authService.register(userData);
      if (user != null) {
        Get.snackbar('Success', 'Registration successful! Please login.');
        Get.offAllNamed(Routes.LOGIN);
      } else {
        throw Exception('Registration failed: No user data returned.');
      }
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Register Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> forgotPassword() async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // Simulate sending a verification code
      print("Sending verification code to ${emailController.text}");
      await Future.delayed(const Duration(seconds: 2));
      Get.toNamed(Routes.VERIFICATION);
      Get.snackbar(
        'Success',
        'Verification code sent to ${emailController.text}',
      );
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Forgot Password Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyCode() async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // Simulate verifying the code
      print("Verifying code ${verificationCodeController.text}");
      await Future.delayed(const Duration(seconds: 2));
      Get.offAllNamed(Routes.LOGIN); // Or navigate to a reset password page
      Get.snackbar('Success', 'Account verified successfully!');
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Verification Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    currentUser.value = null;
    Get.offAllNamed(Routes.LOGIN);
  }

  Future<void> signInWithGoogle() async {
    // Placeholder for Google Sign-In logic
    print("Attempting to sign in with Google...");
    Get.snackbar('Coming Soon', 'Google Sign-In is not yet implemented.');
  }
}
