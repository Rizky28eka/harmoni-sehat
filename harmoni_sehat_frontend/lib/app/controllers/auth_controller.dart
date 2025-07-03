// lib/app/controllers/auth_controller.dart
import 'package:get/get.dart';
import '../data/models/user_model.dart';
import '../data/providers/auth_service.dart';
import '../routes/app_pages.dart';

class AuthController extends GetxController {
  final AuthService _authService = Get.find<AuthService>();

  final RxBool isLoading = false.obs;
  final RxString errorMessage = ''.obs;
  final Rx<User?> currentUser = Rx<User?>(null);

  @override
  void onInit() {
    super.onInit();
    checkAuthStatus();
  }

  void checkAuthStatus() async {
    if (_authService.isAuthenticated()) {
      print('User is authenticated. Token: ${_authService.getToken()}');
      Get.offAllNamed(Routes.HOME);
    } else {
      print('User is not authenticated.');
    }
  }

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      final response = await _authService.login(email, password);
      if (response != null) {
        // Backend hanya mengembalikan token, tidak ada data user di sini
        // Anda bisa menambahkan logika untuk mengambil profil user setelah login jika diperlukan
        Get.offAllNamed(Routes.HOME);
      }
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Login Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> register(String username, String email, String password, String noHp) async {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      final user = await _authService.register(username, email, password, noHp);
      if (user != null) {
        Get.snackbar('Success', 'Registration successful! Please login.');
        Get.offAllNamed(Routes.LOGIN);
      }
    } catch (e) {
      errorMessage.value = e.toString().replaceFirst('Exception: ', '');
      print('Register Error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    currentUser.value = null;
    Get.offAllNamed(Routes.LOGIN);
  }
}
