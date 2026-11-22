import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../shared/widgets/custom_primary_button.dart';
import '../../shared/widgets/custom_text_form_field.dart';
import 'auth_controller.dart';

Widget _logoHeader(String title, String subtitle) => Column(children: [
      Image.asset('assets/images/App_Logo.png', height: 72),
      const SizedBox(height: 16),
      Text(title, textAlign: TextAlign.center, style: GoogleFonts.montserrat(fontSize: 24, fontWeight: FontWeight.bold)),
      const SizedBox(height: 6),
      Text(subtitle, textAlign: TextAlign.center, style: GoogleFonts.montserrat(fontSize: 14, color: AppColors.textSecondary)),
      const SizedBox(height: 28),
    ]);

Widget _passwordField(TextEditingController c, RxBool obscure, {String label = 'Password', String? Function(String?)? validator}) => Obx(() => CustomTextFormField(
      controller: c,
      labelText: label,
      prefixIcon: Icons.lock_outline,
      obscureText: obscure.value,
      validator: validator,
      suffixIcon: IconButton(icon: Icon(obscure.value ? Icons.visibility_off : Icons.visibility), onPressed: () => obscure.toggle()),
    ));

class LoginView extends GetView<AuthController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: controller.formKey,
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  _logoHeader('Selamat Datang', 'Masuk untuk melanjutkan ke akun Anda'),
                  CustomTextFormField(controller: controller.email, labelText: 'Email', prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress, validator: validateEmail),
                  const SizedBox(height: 16),
                  _passwordField(controller.password, controller.obscure, validator: (v) => validateRequired(v, 'Password')),
                  Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () => Get.toNamed(AppRoutes.forgotPassword), child: const Text('Lupa password?'))),
                  const SizedBox(height: 8),
                  Obx(() => CustomPrimaryButton(onPressed: controller.login, isLoading: controller.loading.value, child: Text('Masuk'.tr))),
                  const SizedBox(height: 16),
                  Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Text('Belum punya akun?'),
                    TextButton(onPressed: () => Get.toNamed(AppRoutes.register), child: Text('Daftar'.tr)),
                  ]),
                ]),
              ),
            ),
          ),
        ),
      );
}

class RegisterView extends GetView<RegisterController> {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text('Daftar'.tr)),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: controller.formKey,
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                Obx(() => SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(value: 'pasien', label: Text('Pasien'), icon: Icon(Icons.person)),
                        ButtonSegment(value: 'dokter', label: Text('Dokter'), icon: Icon(Icons.medical_services)),
                        ButtonSegment(value: 'farmasi', label: Text('Apoteker'), icon: Icon(Icons.local_pharmacy)),
                      ],
                      selected: {controller.role.value},
                      onSelectionChanged: (s) => controller.role.value = s.first,
                    )),
                const SizedBox(height: 20),
                CustomTextFormField(controller: controller.name, labelText: 'Nama lengkap', prefixIcon: Icons.badge_outlined, validator: (v) => validateRequired(v, 'Nama')),
                const SizedBox(height: 14),
                CustomTextFormField(controller: controller.email, labelText: 'Email', prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress, validator: validateEmail),
                const SizedBox(height: 14),
                _passwordField(controller.password, controller.obscure, validator: validatePassword),
                const SizedBox(height: 14),
                Obx(() => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: switch (controller.role.value) {
                      'pasien' => _pasienFields(context),
                      'dokter' => _dokterFields(),
                      _ => _farmasiFields(),
                    })),
                const SizedBox(height: 24),
                Obx(() => CustomPrimaryButton(onPressed: controller.submit, isLoading: controller.loading.value, child: Text('Daftar'.tr))),
              ]),
            ),
          ),
        ),
      );

  List<Widget> _pasienFields(BuildContext context) => [
        CustomTextFormField(controller: controller.nik, labelText: 'NIK (16 digit)', prefixIcon: Icons.credit_card, keyboardType: TextInputType.number, validator: (v) => (v ?? '').trim().length == 16 ? null : 'NIK harus 16 digit'),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.birthDate, labelText: 'Tanggal lahir', prefixIcon: Icons.cake_outlined, readOnly: true, onTap: () => controller.pickBirthDate(context), validator: (v) => validateRequired(v, 'Tanggal lahir')),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(
          initialValue: controller.gender.value,
          decoration: const InputDecoration(labelText: 'Jenis kelamin', prefixIcon: Icon(Icons.wc)),
          items: const [DropdownMenuItem(value: 'Laki-laki', child: Text('Laki-laki')), DropdownMenuItem(value: 'Perempuan', child: Text('Perempuan'))],
          onChanged: (v) => controller.gender.value = v ?? 'Laki-laki',
        ),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.address, labelText: 'Alamat', prefixIcon: Icons.home_outlined, maxLines: 2, validator: (v) => validateRequired(v, 'Alamat')),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.phone, labelText: 'No. telepon', prefixIcon: Icons.phone_outlined, keyboardType: TextInputType.phone, validator: (v) => validateRequired(v, 'No. telepon')),
      ];

  List<Widget> _dokterFields() => [
        CustomTextFormField(controller: controller.str, labelText: 'Nomor STR', prefixIcon: Icons.verified_outlined, validator: (v) => validateRequired(v, 'Nomor STR')),
        const SizedBox(height: 14),
        Obx(() => DropdownButtonFormField<String>(
              initialValue: controller.specializationId.value,
              decoration: const InputDecoration(labelText: 'Spesialisasi', prefixIcon: Icon(Icons.local_hospital_outlined)),
              items: controller.specializations.map((s) => DropdownMenuItem(value: s['_id'].toString(), child: Text('${s['nama']}'))).toList(),
              onChanged: (v) => controller.specializationId.value = v,
            )),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.fee, labelText: 'Biaya konsultasi (Rp)', prefixIcon: Icons.payments_outlined, keyboardType: TextInputType.number, validator: (v) => num.tryParse(v ?? '') == null ? 'Masukkan angka' : null),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.bio, labelText: 'Bio singkat (opsional)', prefixIcon: Icons.notes, maxLines: 3),
      ];

  List<Widget> _farmasiFields() => [
        CustomTextFormField(controller: controller.sipa, labelText: 'Nomor SIPA', prefixIcon: Icons.verified_outlined, validator: (v) => validateRequired(v, 'Nomor SIPA')),
      ];
}

class ForgotPasswordView extends GetView<AuthController> {
  const ForgotPasswordView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Lupa Password')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('Masukkan email akun Anda. Kami akan mengirim kode untuk mengatur ulang password.'),
            const SizedBox(height: 20),
            CustomTextFormField(controller: controller.email, labelText: 'Email', prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 24),
            Obx(() => CustomPrimaryButton(onPressed: controller.forgot, isLoading: controller.loading.value, child: const Text('Kirim kode'))),
          ]),
        ),
      );
}

class VerifyTokenView extends GetView<AuthController> {
  const VerifyTokenView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Verifikasi Kode')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('Tempel kode yang kami kirim ke email Anda (berlaku 10 menit).'),
            const SizedBox(height: 20),
            CustomTextFormField(controller: controller.token, labelText: 'Kode reset', prefixIcon: Icons.key_outlined),
            const SizedBox(height: 24),
            Obx(() => CustomPrimaryButton(onPressed: controller.verifyToken, isLoading: controller.loading.value, child: const Text('Verifikasi'))),
          ]),
        ),
      );
}

class ResetPasswordView extends GetView<AuthController> {
  const ResetPasswordView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Password Baru')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: controller.formKey,
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              _passwordField(controller.newPassword, controller.obscure, label: 'Password baru', validator: validatePassword),
              const SizedBox(height: 24),
              Obx(() => CustomPrimaryButton(onPressed: controller.reset, isLoading: controller.loading.value, child: const Text('Simpan'))),
            ]),
          ),
        ),
      );
}
