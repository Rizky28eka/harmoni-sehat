import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../shared/widgets/custom_primary_button.dart';
import '../../shared/widgets/custom_text_form_field.dart';
import 'auth_controller.dart';

/// Soft blob backdrop behind the auth screens.
class _AuthBackdrop extends StatelessWidget {
  const _AuthBackdrop({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final mint = toneOf(context, Tone.mint);
    final sky = toneOf(context, Tone.sky);
    return Stack(children: [
      Positioned(top: -90, right: -70, child: Container(width: 260, height: 260, decoration: BoxDecoration(shape: BoxShape.circle, color: mint.bg))),
      Positioned(top: 90, left: -80, child: Container(width: 170, height: 170, decoration: BoxDecoration(shape: BoxShape.circle, color: sky.bg))),
      Positioned(bottom: -70, right: -40, child: Container(width: 200, height: 200, decoration: BoxDecoration(shape: BoxShape.circle, color: toneOf(context, Tone.peach).bg.withValues(alpha: 0.7)))),
      child,
    ]);
  }
}

Widget _logoHeader(BuildContext context, String title, String subtitle) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: AppColors.primaryColor.withValues(alpha: 0.16), blurRadius: 24, offset: const Offset(0, 10))]),
        child: Image.asset('assets/images/App_Logo.png', height: 48, width: 48, errorBuilder: (_, __, ___) => const Icon(Icons.health_and_safety_rounded, size: 48, color: AppColors.primaryColor)),
      ),
      const SizedBox(height: 28),
      Text(title, style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -1, height: 1.05)),
      const SizedBox(height: 8),
      Text(subtitle, style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary, height: 1.4)),
      const SizedBox(height: 30),
    ]);

Widget _passwordField(TextEditingController c, RxBool obscure, {String label = 'Password', String? Function(String?)? validator}) => Obx(() => CustomTextFormField(
      controller: c,
      labelText: label,
      prefixIcon: Icons.lock_outline,
      obscureText: obscure.value,
      validator: validator,
      suffixIcon: IconButton(
        tooltip: (obscure.value ? 'Tampilkan password' : 'Sembunyikan password').tr,
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
        body: _AuthBackdrop(
          child: SafeArea(
            child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 20),
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
            padding: const EdgeInsets.fromLTRB(22, 8, 22, 28),
            child: Form(
              key: controller.formKey,
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                Text('Daftar sebagai'.tr, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
                const SizedBox(height: 10),
                Obx(() => Row(children: [
                      for (final r in const [('pasien', 'Pasien', Icons.person_rounded, Tone.mint), ('dokter', 'Dokter', Icons.medical_services_rounded, Tone.sky), ('farmasi', 'Apoteker', Icons.local_pharmacy_rounded, Tone.peach)])
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: GestureDetector(
                              onTap: () => controller.role.value = r.$1,
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 180),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                decoration: BoxDecoration(
                                  color: toneOf(context, r.$4).bg,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: controller.role.value == r.$1 ? toneOf(context, r.$4).ink : Colors.transparent, width: 2),
                                ),
                                child: Column(children: [
                                  Icon(r.$3, color: toneOf(context, r.$4).ink, size: 28),
                                  const SizedBox(height: 6),
                                  Text(r.$2.tr, style: TextStyle(fontWeight: FontWeight.w800, color: toneOf(context, r.$4).ink, fontSize: 13)),
                                ]),
                              ),
                            ),
                          ),
                        ),
                    ])),
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
          decoration: InputDecoration(labelText: 'Jenis kelamin'.tr, prefixIcon: const Icon(Icons.wc_rounded, color: AppColors.textMuted, size: 22)),
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

/// Shared layout for the three password-recovery steps.
class _RecoveryStep extends StatelessWidget {
  const _RecoveryStep({required this.step, required this.title, required this.hint, required this.icon, required this.tone, required this.children, this.formKey});
  final int step;
  final String title;
  final String hint;
  final IconData icon;
  final Tone tone;
  final List<Widget> children;
  final GlobalKey<FormState>? formKey;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, tone);
    final body = Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Row(children: [for (var i = 1; i <= 3; i++) Expanded(child: Container(height: 5, margin: const EdgeInsets.only(right: 6), decoration: BoxDecoration(color: i <= step ? AppColors.primaryColor : AppColors.textMuted.withValues(alpha: 0.25), borderRadius: BorderRadius.circular(5))))]),
      const SizedBox(height: 26),
      GlowAvatar(size: 84, tone: tone, child: Icon(icon, size: 38, color: c.ink)),
      const SizedBox(height: 20),
      Text(title.tr, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -0.8)),
      const SizedBox(height: 8),
      Text(hint.tr, style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary, height: 1.45)),
      const SizedBox(height: 26),
      ...children,
    ]);
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(child: SingleChildScrollView(padding: const EdgeInsets.fromLTRB(24, 4, 24, 28), child: formKey == null ? body : Form(key: formKey, child: body))),
    );
  }
}

class ForgotPasswordView extends GetView<AuthController> {
  const ForgotPasswordView({super.key});

  @override
  Widget build(BuildContext context) => _RecoveryStep(
        step: 1,
        title: 'Lupa Password',
        hint: 'Masukkan email akun Anda. Kami akan mengirim kode untuk mengatur ulang password.',
        icon: Icons.mark_email_read_rounded,
        tone: Tone.mint,
        children: [
          CustomTextFormField(controller: controller.email, labelText: 'Email'.tr, prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 24),
          Obx(() => CustomPrimaryButton(onPressed: controller.forgot, isLoading: controller.loading.value, child: Text('Kirim kode'.tr))),
        ],
      );
}

class VerifyTokenView extends GetView<AuthController> {
  const VerifyTokenView({super.key});

  @override
  Widget build(BuildContext context) => _RecoveryStep(
        step: 2,
        title: 'Verifikasi Kode',
        hint: 'Tempel kode yang kami kirim ke email Anda (berlaku 10 menit).',
        icon: Icons.pin_rounded,
        tone: Tone.sky,
        children: [
          CustomTextFormField(controller: controller.token, labelText: 'Kode reset'.tr, prefixIcon: Icons.key_outlined),
          const SizedBox(height: 24),
          Obx(() => CustomPrimaryButton(onPressed: controller.verifyToken, isLoading: controller.loading.value, child: Text('Verifikasi'.tr))),
        ],
      );
}

class ResetPasswordView extends GetView<AuthController> {
  const ResetPasswordView({super.key});

  @override
  Widget build(BuildContext context) => _RecoveryStep(
        step: 3,
        title: 'Password Baru',
        hint: 'Min. 8 karakter dengan huruf besar, kecil, angka & simbol (@\$!%*?&)',
        icon: Icons.lock_reset_rounded,
        tone: Tone.lilac,
        formKey: controller.formKey,
        children: [
          _passwordField(controller.newPassword, controller.obscure, label: 'Password baru'.tr, validator: validatePassword),
          const SizedBox(height: 24),
          Obx(() => CustomPrimaryButton(onPressed: controller.reset, isLoading: controller.loading.value, child: Text('Simpan'.tr))),
        ],
      );
}
