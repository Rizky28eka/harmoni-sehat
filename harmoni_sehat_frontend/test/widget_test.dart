import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/routes/app_pages.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/auth/login_page.dart';
import 'package:harmoni_sehat_frontend/app/ui/pages/home/home_page.dart';
import 'package:mockito/mockito.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Create a mock class for SharedPreferences
class MockSharedPreferences extends Mock implements SharedPreferences {}

void main() {
  group('Authentication Tests', () {
    late MockSharedPreferences mockSharedPreferences;

    setUp(() {
      // Initialize GetX dependencies before each test
      Get.reset(); // Reset GetX bindings before each test
      mockSharedPreferences = MockSharedPreferences();
      when(
        mockSharedPreferences.getString(any as String),
      ).thenAnswer((_) => ''); // Mock token as empty string initially
      when(
        mockSharedPreferences.setString(any as String, any as String),
      ).thenAnswer((_) async => true); // Mock setString

      Get.put<SharedPreferences>(mockSharedPreferences);
    });

    testWidgets('Login Page and Navigation to Home Test', (
      WidgetTester tester,
    ) async {
      // Build our app and trigger a frame, starting from the login page.
      await tester.pumpWidget(
        GetMaterialApp(
          title: "Harmoni Sehat",
          initialRoute: AppPages.INITIAL,
          getPages: AppPages.routes,
          debugShowCheckedModeBanner: false,
        ),
      );

      // Verify that LoginPage is displayed initially
      expect(find.byType(LoginPage), findsOneWidget);
      expect(find.text('Login'), findsOneWidget); // AppBar title

      // Simulate typing email and password
      await tester.enterText(
        find.widgetWithText(TextField, 'Email'),
        'test@example.com',
      );
      await tester.enterText(
        find.widgetWithText(TextField, 'Password'),
        'password123',
      );

      // Tap the login button
      await tester.tap(find.widgetWithText(ElevatedButton, 'Login'));
      await tester.pumpAndSettle(); // Wait for navigation and state changes

      // Verify that HomePage is displayed after successful login
      // Note: This test assumes a successful login will navigate to HomePage.
      // In a real scenario, you might mock the AuthService to control the login outcome.
      expect(find.byType(HomePage), findsOneWidget);
      expect(find.text('Welcome to Harmoni Sehat!'), findsOneWidget);
      expect(find.byType(LoginPage), findsNothing);
    });
  });
}
