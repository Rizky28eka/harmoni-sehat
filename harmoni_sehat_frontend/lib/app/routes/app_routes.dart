class AppRoutes {
  static const splash = '/';
  static const onboarding = '/onboarding';
  static const login = '/login';
  static const register = '/register';
  
  static const dashboard = '/dashboard'; // Generic dashboard

  // Role-specific dashboards
  static const pasienDashboard = '/pasien/dashboard';
  static const dokterDashboard = '/dokter/dashboard';
  static const farmasiDashboard = '/farmasi/dashboard';

  // Role-specific registration
  static const registerPasien = '/register/pasien';
  static const registerDokter = '/register/dokter';
  static const registerFarmasi = '/register/farmasi';

  // Password reset
  static const forgotPassword = '/forgot-password';
  static const verifyResetToken = '/verify-reset-token';
  static const resetPassword = '/reset-password';

  
}