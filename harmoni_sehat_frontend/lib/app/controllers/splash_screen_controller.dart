import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';

class SplashScreenController extends GetxController {
  // Observable variables for better state management
  final RxBool isLoading = true.obs;
  final RxString loadingText = 'Initializing...'.obs;

  @override
  void onInit() {
    super.onInit();
    _initializeApp();
  }

  @override
  void onReady() {
    super.onReady();
    // Start the loading sequence
    _startLoadingSequence();
  }

  void _initializeApp() {
    // Here you can add any initialization logic
    // like checking user authentication, loading preferences, etc.
  }

  void _startLoadingSequence() async {
    // Simulate different loading stages with messages
    await _updateLoadingText('Checking connection...', 1000);
    await _updateLoadingText('Loading user data...', 1000);
    await _updateLoadingText('Preparing interface...', 1000);
    await _updateLoadingText('Almost ready...', 1000);

    // Final delay before navigation
    await Future.delayed(const Duration(milliseconds: 500));

    // Navigate to login page
    isLoading.value = false;
    Get.offAllNamed(Routes.LOGIN);
  }

  Future<void> _updateLoadingText(String text, int delayMs) async {
    loadingText.value = text;
    await Future.delayed(Duration(milliseconds: delayMs));
  }

  @override
  void onClose() {
    super.onClose();
    // Clean up resources if needed
  }
}
