import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class SettingsController extends GetxController {
  final _box = GetStorage();
  final themeMode = ThemeMode.system.obs;
  final locale = const Locale('id', 'ID').obs;

  @override
  void onInit() {
    super.onInit();
    themeMode.value = switch (_box.read('themeMode')) {
      'dark' => ThemeMode.dark,
      'light' => ThemeMode.light,
      _ => ThemeMode.system,
    };
    locale.value = _box.read('lang') == 'en' ? const Locale('en', 'US') : const Locale('id', 'ID');
  }

  bool get isDark => themeMode.value == ThemeMode.dark;

  void setDark(bool dark) {
    themeMode.value = dark ? ThemeMode.dark : ThemeMode.light;
    Get.changeThemeMode(themeMode.value);
    _box.write('themeMode', dark ? 'dark' : 'light');
  }

  void setLanguage(String code) {
    locale.value = code == 'en' ? const Locale('en', 'US') : const Locale('id', 'ID');
    Get.updateLocale(locale.value);
    _box.write('lang', code);
  }
}
