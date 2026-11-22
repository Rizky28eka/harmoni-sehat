import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../shared/widgets/custom_primary_button.dart';
import '../../shared/widgets/custom_text_form_field.dart';
import 'auth_controller.dart';

Widget _logoHeader(BuildContext context, String title, String subtitle) => Column(children: [
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.borderColor, width: 1),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryColor.withValues(alpha: 0.12),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Image.asset(
          'assets/images/App_Logo.png',
          height: 60,
          width: 60,
          errorBuilder: (_, __, ___) => const Icon(
            Icons.health_and_safety,
            size: 60,
            color: AppColors.primaryColor,
          ),
        ),
      ),
      const SizedBox(height: 18),
      Text(
        title,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
              letterSpacing: -0.4,
            ),
      ),
      const SizedBox(height: 6),
      Text(
        subtitle,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.textSecondary,
            ),
      ),
      const SizedBox(height: 28),
    ]);

Widget _passwordField(TextEditingController c, RxBool obscure, {String label = 'Password', String? Function(String?)? validator}) => Obx(() => CustomTextFormField(
      controller: c,
      labelText: label,
      prefixIcon: Icons.lock_outline,
      obscureText: obscure.value,
      validator: validator,
      suffixIcon: IconButton(
        icon: Icon(
          obscure.value ? Icons.visibility_off_outlined : Icons.visibility_outlined,
          color: AppColors.textSecondary,
          size: 20,
        ),
        onPressed: () => obscure.toggle(),
      ),
    ));

class LoginView extends GetView<AuthController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.lightBackground,
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Form(
                key: controller.formKey,
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  _logoHeader(context, 'Selamat Datang'.tr, 'Masuk untuk melanjutkan ke akun Anda'.tr),
                  CustomTextFormField(
                    controller: controller.email,
                    labelText: 'Email'.tr,
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    validator: validateEmail,
                  ),
                  const SizedBox(height: 16),
                  _passwordField(controller.password, controller.obscure, validator: (v) => validateRequired(v, 'Password')),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => Get.toNamed(AppRoutes.forgotPassword),
                      style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4)),
                      child: Text(
                        'Lupa password?'.tr,
                        style: const TextStyle(color: AppColors.primaryColor, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Obx(() => CustomPrimaryButton(onPressed: controller.login, isLoading: controller.loading.value, child: Text('Masuk'.tr))),
                  const SizedBox(height: 20),
                  Wrap(alignment: WrapAlignment.center, crossAxisAlignment: WrapCrossAlignment.center, children: [
                    Text('Belum punya akun?'.tr, style: const TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                    TextButton(
                      onPressed: () => Get.toNamed(AppRoutes.register),
                      child: Text(
                        'Daftar'.tr,
                        style: const TextStyle(color: AppColors.primaryColor, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
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
        backgroundColor: AppColors.lightBackground,
        appBar: AppBar(title: Text('Daftar'.tr)),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: controller.formKey,
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                Obx(() => SegmentedButton<String>(
                      style: ButtonStyle(
                        shape: WidgetStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                      ),
                      segments: [
                        ButtonSegment(value: 'pasien', label: Text('Pasien'.tr), icon: const Icon(Icons.person_outline)),
                        ButtonSegment(value: 'dokter', label: Text('Dokter'.tr), icon: const Icon(Icons.medical_services_outlined)),
                        ButtonSegment(value: 'farmasi', label: Text('Apoteker'.tr), icon: const Icon(Icons.local_pharmacy_outlined)),
                      ],
                      selected: {controller.role.value},
                      onSelectionChanged: (s) => controller.role.value = s.first,
                    )),
                const SizedBox(height: 20),
                CustomTextFormField(controller: controller.name, labelText: 'Nama lengkap'.tr, prefixIcon: Icons.badge_outlined, validator: (v) => validateRequired(v, 'Nama')),
                const SizedBox(height: 14),
                CustomTextFormField(controller: controller.email, labelText: 'Email'.tr, prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress, validator: validateEmail),
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
        CustomTextFormField(controller: controller.nik, labelText: 'NIK (16 digit)'.tr, prefixIcon: Icons.credit_card, keyboardType: TextInputType.number, validator: (v) => (v ?? '').trim().length == 16 ? null : 'NIK harus 16 digit'),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.birthDate, labelText: 'Tanggal lahir'.tr, prefixIcon: Icons.cake_outlined, readOnly: true, onTap: () => controller.pickBirthDate(context), validator: (v) => validateRequired(v, 'Tanggal lahir')),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(
          initialValue: controller.gender.value,
          decoration: InputDecoration(
            labelText: 'Jenis kelamin'.tr,
            prefixIcon: const Icon(Icons.wc, color: AppColors.textSecondary, size: 20),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderColor)),
          ),
          items: [DropdownMenuItem(value: 'Laki-laki', child: Text('Laki-laki'.tr)), DropdownMenuItem(value: 'Perempuan', child: Text('Perempuan'.tr))],
          onChanged: (v) => controller.gender.value = v ?? 'Laki-laki',
        ),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.address, labelText: 'Alamat'.tr, prefixIcon: Icons.home_outlined, maxLines: 2, validator: (v) => validateRequired(v, 'Alamat')),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.phone, labelText: 'No. telepon'.tr, prefixIcon: Icons.phone_outlined, keyboardType: TextInputType.phone, validator: (v) => validateRequired(v, 'No. telepon')),
      ];

  List<Widget> _dokterFields() => [
        CustomTextFormField(controller: controller.str, labelText: 'Nomor STR'.tr, prefixIcon: Icons.verified_outlined, validator: (v) => validateRequired(v, 'Nomor STR')),
        const SizedBox(height: 14),
        Obx(() => DropdownButtonFormField<String>(
              initialValue: controller.specializationId.value,
              decoration: InputDecoration(
                labelText: 'Spesialisasi'.tr,
                prefixIcon: const Icon(Icons.local_hospital_outlined, color: AppColors.textSecondary, size: 20),
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.borderColor)),
              ),
              items: controller.specializations.map((s) => DropdownMenuItem(value: s['_id'].toString(), child: Text('${s['nama']}'))).toList(),
              onChanged: (v) => controller.specializationId.value = v,
            )),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.fee, labelText: 'Biaya konsultasi (Rp)'.tr, prefixIcon: Icons.payments_outlined, keyboardType: TextInputType.number, validator: (v) => num.tryParse(v ?? '') == null ? 'Masukkan angka' : null),
        const SizedBox(height: 14),
        CustomTextFormField(controller: controller.bio, labelText: 'Bio singkat (opsional)'.tr, prefixIcon: Icons.notes, maxLines: 3),
      ];

  List<Widget> _farmasiFields() => [
        CustomTextFormField(controller: controller.sipa, labelText: 'Nomor SIPA'.tr, prefixIcon: Icons.verified_outlined, validator: (v) => validateRequired(v, 'Nomor SIPA')),
      ];
}

class ForgotPasswordView extends GetView<AuthController> {
  const ForgotPasswordView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.lightBackground,
        appBar: AppBar(title: Text('Lupa Password'.tr)),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderColor),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.mark_email_read_outlined, color: AppColors.primaryColor, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Masukkan email akun Anda. Kami akan mengirim kode untuk mengatur ulang password.'.tr,
                      style: const TextStyle(fontSize: 13, height: 1.4, color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            CustomTextFormField(controller: controller.email, labelText: 'Email'.tr, prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 24),
            Obx(() => CustomPrimaryButton(onPressed: controller.forgot, isLoading: controller.loading.value, child: Text('Kirim kode'.tr))),
          ]),
        ),
      );
}

class VerifyTokenView extends GetView<AuthController> {
  const VerifyTokenView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.lightBackground,
        appBar: AppBar(title: Text('Verifikasi Kode'.tr)),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderColor),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.secondaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.pin_outlined, color: AppColors.secondaryColor, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Tempel kode yang kami kirim ke email Anda (berlaku 10 menit).'.tr,
                      style: const TextStyle(fontSize: 13, height: 1.4, color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            CustomTextFormField(controller: controller.token, labelText: 'Kode reset'.tr, prefixIcon: Icons.key_outlined),
            const SizedBox(height: 24),
            Obx(() => CustomPrimaryButton(onPressed: controller.verifyToken, isLoading: controller.loading.value, child: Text('Verifikasi'.tr))),
          ]),
        ),
      );
}

class ResetPasswordView extends GetView<AuthController> {
  const ResetPasswordView({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.lightBackground,
        appBar: AppBar(title: Text('Password Baru'.tr)),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: controller.formKey,
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              _passwordField(controller.newPassword, controller.obscure, label: 'Password baru', validator: validatePassword),
              const SizedBox(height: 24),
              Obx(() => CustomPrimaryButton(onPressed: controller.reset, isLoading: controller.loading.value, child: Text('Simpan'.tr))),
            ]),
          ),
        ),
      );
}
