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
}

