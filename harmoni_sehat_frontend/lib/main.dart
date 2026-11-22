import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'app/bindings/initial_binding.dart';
import 'app/routes/app_pages.dart';
import 'app/routes/app_routes.dart';
import 'app/theme/app_theme.dart';
import 'core/api_client.dart';
import 'core/session.dart';
import 'core/translations.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  await GetStorage.init('api_cache');
  await initializeDateFormatting('id_ID');
  await initializeDateFormatting('en_US');
  // Must exist before any screen so the router and API client can read the stored session.
  await Get.putAsync(() => SessionService().init(), permanent: true);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final box = GetStorage();
    final mode = switch (box.read('themeMode')) { 'dark' => ThemeMode.dark, 'light' => ThemeMode.light, _ => ThemeMode.system };
    return GetMaterialApp(
      title: 'Harmoni Sehat',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: mode,
      translations: AppTranslations(),
      locale: box.read('lang') == 'en' ? const Locale('en', 'US') : const Locale('id', 'ID'),
      fallbackLocale: const Locale('id', 'ID'),
      supportedLocales: const [Locale('id', 'ID'), Locale('en', 'US')],
      localizationsDelegates: const [GlobalMaterialLocalizations.delegate, GlobalWidgetsLocalizations.delegate, GlobalCupertinoLocalizations.delegate],
      initialRoute: AppRoutes.splash,
      getPages: AppPages.pages,
      initialBinding: InitialBinding(),
      debugShowCheckedModeBanner: false,
      onInit: () {
        // A rejected refresh token means the session is over: go back to login.
        Get.find<ApiClient>().onSessionExpired = () => Get.offAllNamed(AppRoutes.login);
      },
    );
  }
}
