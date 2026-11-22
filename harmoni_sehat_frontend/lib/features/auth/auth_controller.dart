import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../core/api_client.dart';
import '../../core/session.dart';
import '../../core/ui.dart';
import 'auth_repository.dart';

String homeRouteFor(String? role) => switch (role) {
      'pasien' => AppRoutes.pasienHome,
      'dokter' => AppRoutes.dokterHome,
      'farmasi' => AppRoutes.farmasiHome,
      'admin' || 'superadmin' => AppRoutes.adminHome,
      _ => AppRoutes.login,
    };

const _passwordHint = 'Min. 8 karakter dengan huruf besar, kecil, angka & simbol (@\$!%*?&)';
final _passwordRule = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$');

String? validateEmail(String? v) => (v == null || !RegExp(r'^\S+@\S+\.\S+$').hasMatch(v.trim())) ? 'Email tidak valid'.tr : null;
String? validatePassword(String? v) => (v == null || !_passwordRule.hasMatch(v)) ? _passwordHint.tr : null;
String? validateRequired(String? v, [String label = 'Field']) => (v == null || v.trim().isEmpty) ? '${label.tr} ${'wajib diisi'.tr}' : null;

class AuthController extends GetxController {
  AuthController(this._repo);
  final AuthRepository _repo;

  final formKey = GlobalKey<FormState>();
  final email = TextEditingController();
  final password = TextEditingController();
  final token = TextEditingController();
  final newPassword = TextEditingController();

  final loading = false.obs;
  final obscure = true.obs;

  @override
  void onClose() {
    email.dispose();
    password.dispose();
    token.dispose();
    newPassword.dispose();
    super.onClose();
  }

  Future<void> login() async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    loading.value = true;
    try {
      final user = await _repo.login(email.text, password.text);
      Get.offAllNamed(homeRouteFor(user.role));
    } catch (e) {
      showError(e);
    } finally {
      loading.value = false;
    }
  }

  Future<void> forgot() async {
    if (validateEmail(email.text) != null) return showError('Masukkan email yang valid');
    loading.value = true;
    try {
      await _repo.forgotPassword(email.text);
      showSuccess('Jika email terdaftar, kode reset telah dikirim.');
      Get.toNamed(AppRoutes.verifyResetToken);
    } catch (e) {
      showError(e);
    } finally {
      loading.value = false;
    }
  }

  Future<void> verifyToken() async {
    if (token.text.trim().isEmpty) return showError('Kode tidak boleh kosong');
    loading.value = true;
    try {
      await _repo.verifyResetToken(token.text);
      Get.toNamed(AppRoutes.resetPassword);
    } catch (e) {
      showError(e);
    } finally {
      loading.value = false;
    }
  }

  Future<void> reset() async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    loading.value = true;
    try {
      await _repo.resetPassword(token.text, newPassword.text);
      showSuccess('Password berhasil diubah. Silakan masuk.');
      Get.offAllNamed(AppRoutes.login);
    } catch (e) {
      showError(e);
    } finally {
      loading.value = false;
    }
  }
}

class RegisterController extends GetxController {
  RegisterController(this._repo, this._api);
  final AuthRepository _repo;
  final ApiClient _api;

  final formKey = GlobalKey<FormState>();
  final role = 'pasien'.obs;
  final loading = false.obs;
  final obscure = true.obs;
  final specializations = <Map<String, dynamic>>[].obs;
  final specializationId = RxnString();
  final gender = 'Laki-laki'.obs;

  final name = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  final nik = TextEditingController();
  final birthDate = TextEditingController();
  final address = TextEditingController();
  final phone = TextEditingController();
  final str = TextEditingController();
  final fee = TextEditingController();
  final bio = TextEditingController();
  final sipa = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    _loadSpecializations();
  }

  Future<void> _loadSpecializations() async {
    try {
      final list = await _api.get('/specializations', cache: true);
      specializations.assignAll((list as List).whereType<Map>().map((e) => Map<String, dynamic>.from(e)));
    } catch (_) {/* optional */}
  }

  @override
  void onClose() {
    for (final c in [name, email, password, nik, birthDate, address, phone, str, fee, bio, sipa]) {
      c.dispose();
    }
    super.onClose();
  }

  Future<void> pickBirthDate(BuildContext context) async {
    final d = await showDatePicker(
      context: context,
      initialDate: DateTime(1995),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (d != null) birthDate.text = d.toIso8601String().split('T').first;
  }

  Future<void> submit() async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    final payload = <String, dynamic>{
      'name': name.text.trim(),
      'email': email.text.trim(),
      'password': password.text,
      'role': role.value,
    };
    switch (role.value) {
      case 'pasien':
        payload.addAll({
          'nik': nik.text.trim(),
          'tanggal_lahir': birthDate.text,
          'jenis_kelamin': gender.value,
          'alamat': address.text.trim(),
          'no_telepon': phone.text.trim(),
        });
      case 'dokter':
        payload.addAll({
          'nomor_str': str.text.trim(),
          'biaya_konsultasi': num.tryParse(fee.text) ?? 0,
          if (specializationId.value != null) 'spesialisasi_id': specializationId.value,
          if (bio.text.trim().isNotEmpty) 'bio': bio.text.trim(),
        });
      case 'farmasi':
        payload['nomor_sipa'] = sipa.text.trim();
    }
    loading.value = true;
    try {
      final AppUser user = await _repo.register(payload);
      if (user.role != 'pasien') {
        showInfo('Akun dibuat. Menunggu verifikasi admin sebelum dapat digunakan penuh.');
      }
      Get.offAllNamed(homeRouteFor(user.role));
    } catch (e) {
      showError(e);
    } finally {
      loading.value = false;
    }
  }
}
