import 'package:get/get.dart';

/// Minimal id/en dictionary for shell-level strings. Screens fall back to the key
/// (Indonesian) when no translation exists, so coverage can grow incrementally.
class AppTranslations extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        'en_US': {
          'Beranda': 'Home',
          'Konsultasi': 'Consultations',
          'Obat': 'Pharmacy',
          'Riwayat': 'Records',
          'Profil': 'Profile',
          'Pesanan': 'Orders',
          'Jadwal': 'Schedule',
          'Masuk': 'Sign in',
          'Daftar': 'Sign up',
          'Keluar': 'Sign out',
          'Mode gelap': 'Dark mode',
          'Bahasa': 'Language',
          'Notifikasi': 'Notifications',
          'Cari dokter': 'Find a doctor',
          'Asisten AI': 'AI assistant',
          'Artikel kesehatan': 'Health articles',
        },
      };
}
