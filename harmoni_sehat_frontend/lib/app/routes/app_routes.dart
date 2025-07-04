part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const LOGIN = _Paths.LOGIN;
  static const REGISTER = _Paths.REGISTER;
  static const HOME = _Paths.HOME;
  static const SPLASH = _Paths.SPLASH;
  static const INTRODUCTION = _Paths.INTRODUCTION;
  static const FORGOT_PASSWORD = _Paths.FORGOT_PASSWORD;
  static const VERIFICATION = _Paths.VERIFICATION;
  static const PASIEN_HOME = _Paths.PASIEN_HOME;
  static const DOKTER_HOME = _Paths.DOKTER_HOME;
  static const APOTEKER_HOME = _Paths.APOTEKER_HOME;
  static const PASIEN_LAYANAN = _Paths.PASIEN_LAYANAN;
  static const PASIEN_PROFIL = _Paths.PASIEN_PROFIL;
}

abstract class _Paths {
  _Paths._();
  static const LOGIN = '/login';
  static const REGISTER = '/register';
  static const HOME = '/home';
  static const SPLASH = '/splash';
  static const INTRODUCTION = '/introduction';
  static const FORGOT_PASSWORD = '/forgot-password';
  static const VERIFICATION = '/verification';
  static const PASIEN_HOME = '/pasien-home';
  static const DOKTER_HOME = '/dokter-home';
  static const APOTEKER_HOME = '/apoteker-home';
  static const PASIEN_LAYANAN = '/pasien-layanan';
  static const PASIEN_PROFIL = '/pasien-profil';
}
