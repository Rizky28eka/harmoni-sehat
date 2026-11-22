// Takes the README screenshots on a simulator against a locally running, seeded backend.
//
//   cd harmoni_sehat_backend && npm run seed && npm run dev      (terminal 1)
//   flutter drive \
//     --driver=test_driver/integration_test.dart \
//     --target=integration_test/screenshots_test.dart -d <simulator-id>   (terminal 2)
//
// The simulator reaches the API at http://localhost:8000. All accounts are fictional demo accounts
// created by the seeder (password `Harmoni123!`).
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_routes.dart';
import 'package:harmoni_sehat_frontend/core/session.dart';
import 'package:harmoni_sehat_frontend/main.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_primary_button.dart';
import 'package:integration_test/integration_test.dart';
import 'package:intl/date_symbol_data_local.dart';

const _password = 'Harmoni123!';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  /// Pumps in small steps so network calls and animations can finish without `pumpAndSettle`
  /// (which never returns while a spinner is on screen).
  Future<void> wait(WidgetTester t, [double seconds = 2]) async {
    final steps = (seconds * 10).round();
    for (var i = 0; i < steps; i++) {
      await t.pump(const Duration(milliseconds: 100));
    }
  }

  Future<void> shot(WidgetTester t, String name, [double seconds = 1.5]) async {
    await wait(t, seconds);
    await binding.takeScreenshot(name);
  }

  Future<void> tapIcon(WidgetTester t, IconData icon, [double seconds = 2]) async {
    await t.tap(find.byIcon(icon).first);
    await wait(t, seconds);
  }

  /// Assumes the login screen is already showing.
  Future<void> login(WidgetTester t, String email) async {
    final fields = find.byType(TextFormField);
    await t.enterText(fields.at(0), email);
    await t.enterText(fields.at(1), _password);
    await t.pump();
    await t.tap(find.byType(CustomPrimaryButton).first);
    await wait(t, 4);
  }

  Future<void> logout(WidgetTester t) async {
    await Get.find<SessionService>().clear();
    Get.offAllNamed(AppRoutes.login);
    await wait(t, 1);
  }

  testWidgets('Harmoni Sehat: every role', (t) async {
    await GetStorage.init();
    await GetStorage.init('api_cache');
    await initializeDateFormatting('id_ID');
    await initializeDateFormatting('en_US');
    final box = GetStorage();
    await box.erase();
    await GetStorage('api_cache').erase();
    await box.write('lang', 'en');
    await box.write('themeMode', 'light');
    await Get.putAsync(() => SessionService().init(), permanent: true);
    await Get.find<SessionService>().clear();

    await t.pumpWidget(const MyApp());
    await wait(t, 1);
    await shot(t, 'onboarding', 0.5);
    await wait(t, 3);

    // ── Login ──
    Get.offAllNamed(AppRoutes.login);
    await shot(t, 'login');

    // ── Patient ──
    await login(t, 'pasien@harmoni.test');
    await shot(t, 'patient-home');
    Get.toNamed(AppRoutes.doctors);
    await shot(t, 'patient-doctors', 3);
    await t.tap(find.textContaining('dr. Andi').first);
    await shot(t, 'patient-doctor-detail', 3);
    Get.back();
    await wait(t, 1);
    Get.back();
    await wait(t, 1);
    await tapIcon(t, Icons.chat_bubble_outline);
    await shot(t, 'patient-consultations', 2.5);
    await t.tap(find.text('In progress').first);
    await shot(t, 'patient-consultation', 3);
    await t.tap(find.byIcon(Icons.chat_bubble_outline).last);
    await shot(t, 'patient-chat', 4);
    Get.back();
    await wait(t, 1);
    Get.back();
    await wait(t, 1);
    await tapIcon(t, Icons.local_pharmacy_outlined);
    await shot(t, 'patient-shop', 3);
    await t.tap(find.text('Pesanan Saya'));
    await shot(t, 'patient-orders', 3);
    await tapIcon(t, Icons.folder_outlined);
    await shot(t, 'patient-records');
    Get.toNamed(AppRoutes.aiChat);
    await shot(t, 'patient-ai');
    Get.back();
    await wait(t, 1);
    Get.toNamed(AppRoutes.articles);
    await shot(t, 'patient-articles', 3);
    Get.back();
    await wait(t, 1);
    Get.toNamed(AppRoutes.reminders);
    await shot(t, 'patient-reminders');
    Get.back();
    await wait(t, 1);
    Get.changeThemeMode(ThemeMode.dark);
    await tapIcon(t, Icons.home_outlined);
    await shot(t, 'patient-home-dark', 2);
    Get.changeThemeMode(ThemeMode.light);
    await wait(t, 1);
    await logout(t);

    // ── Doctor ──
    await login(t, 'dokter1@harmoni.test');
    await shot(t, 'doctor-home', 2.5);
    await tapIcon(t, Icons.chat_bubble_outline);
    await shot(t, 'doctor-consultations');
    await tapIcon(t, Icons.calendar_month_outlined);
    await shot(t, 'doctor-schedule');
    await logout(t);

    // ── Pharmacist ──
    await login(t, 'apoteker@harmoni.test');
    await t.tap(find.text('Shipped'));
    await shot(t, 'pharmacist-orders', 2.5);
    await tapIcon(t, Icons.inventory_2_outlined);
    await shot(t, 'pharmacist-stock');
    await logout(t);

    // ── Admin ──
    await login(t, 'admin@harmoni.test');
    await shot(t, 'admin-stats', 2.5);
    await tapIcon(t, Icons.verified_user_outlined);
    await shot(t, 'admin-verification');
  });
}
