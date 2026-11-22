import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/session.dart';
import '../../core/theme_controller.dart';
import '../../core/ui.dart';
import '../auth/auth_controller.dart';
import '../auth/auth_repository.dart';

/// Profile + settings tab shared by every role.
class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final session = Get.find<SessionService>();
    final settings = Get.find<SettingsController>();
    final repo = Get.find<AuthRepository>();
    final role = session.role ?? '';
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      children: [
        // Profile Info Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Theme.of(context).cardTheme.color ?? Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.borderColor, width: 0.9),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Center(child: Avatar(name: session.displayName, url: session.profile.value?['foto']?.toString(), radius: 44)),
              const SizedBox(height: 14),
              Text(session.displayName, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text(session.user.value?.email ?? '', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  role.toUpperCase(),
                  style: const TextStyle(color: AppColors.primaryDark, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5),
                ),
              ),
            ],
          ),
        ),
        if ((role == 'dokter' || role == 'farmasi') && session.profile.value?['is_verified'] != true)
          Container(
            margin: const EdgeInsets.only(top: 16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.accentAmberLight,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.accentAmber.withValues(alpha: 0.3)),
            ),
            child: Row(children: [
              const Icon(Icons.hourglass_top, color: AppColors.accentAmber),
              const SizedBox(width: 12),
              Expanded(child: Text('Akun Anda sedang menunggu verifikasi admin.'.tr, style: const TextStyle(fontSize: 13))),
            ]),
          ),
        const SizedBox(height: 20),

        // Settings Preferences Card
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18), side: const BorderSide(color: AppColors.borderColor, width: 0.9)),
          child: Column(
            children: [
              Obx(() => SwitchListTile(
                    secondary: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.accentIndigoLight, borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.dark_mode_outlined, color: AppColors.accentIndigo, size: 20),
                    ),
                    title: Text('Mode gelap'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    value: settings.themeMode.value == ThemeMode.dark,
                    onChanged: settings.setDark,
                  )),
              const Divider(height: 1),
              Obx(() => ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.secondaryLight, borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.language, color: AppColors.secondaryColor, size: 20),
                    ),
                    title: Text('Bahasa'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: DropdownButton<String>(
                      value: settings.locale.value.languageCode,
                      underline: const SizedBox(),
                      items: [
                        DropdownMenuItem(value: 'id', child: Text('Indonesia'.tr)),
                        DropdownMenuItem(value: 'en', child: Text('English'.tr)),
                      ],
                      onChanged: (v) => settings.setLanguage(v ?? 'id'),
                    ),
                  )),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.lock_outline, color: AppColors.primaryColor, size: 20),
                ),
                title: Text('Ubah password'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, size: 18, color: AppColors.textSecondary),
                onTap: () => _changePassword(repo),
              ),
              const Divider(height: 1),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppColors.accentRoseLight, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.logout, color: AppColors.accentRose, size: 20),
                ),
                title: Text('Keluar'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.accentRose)),
                trailing: const Icon(Icons.chevron_right, size: 18, color: AppColors.textSecondary),
                onTap: () async {
                  if (await confirm('Keluar', 'Anda yakin ingin keluar?', ok: 'Keluar')) {
                    await repo.logout();
                    Get.offAllNamed(AppRoutes.login);
                  }
                },
              ),
            ],
          ),
        ),

        if (role != 'admin' && role != 'superadmin') ...[
          const SizedBox(height: 16),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18), side: const BorderSide(color: AppColors.borderColor, width: 0.9)),
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AppColors.accentRoseLight, borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.delete_forever_outlined, color: Colors.red, size: 20),
              ),
              title: Text('Hapus akun'.tr, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.red)),
              subtitle: Text('Data identitas dihapus permanen sesuai UU PDP'.tr, style: const TextStyle(fontSize: 12)),
              onTap: () => _deleteAccount(repo),
            ),
          ),
        ],
        const SizedBox(height: 32),
      ],
    );
  }

  Future<void> _changePassword(AuthRepository repo) async {
    final current = TextEditingController();
    final next = TextEditingController();
    final ok = await Get.dialog<bool>(AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      title: Text('Ubah password'.tr, style: const TextStyle(fontWeight: FontWeight.bold)),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        TextField(controller: current, obscureText: true, decoration: InputDecoration(labelText: 'Password saat ini'.tr)),
        const SizedBox(height: 12),
        TextField(controller: next, obscureText: true, decoration: InputDecoration(labelText: 'Password baru'.tr)),
      ]),
      actions: [
        TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)),
        FilledButton(onPressed: () => Get.back(result: true), child: Text('Simpan'.tr)),
      ],
    ));
    if (ok != true) return;
    if (validatePassword(next.text) != null) return showError('${'Password baru'.tr}: ${validatePassword(next.text)!.tr}');
    try {
      await repo.changePassword(current.text, next.text);
      showSuccess('Password diperbarui. Silakan masuk kembali.');
      await repo.logout();
      Get.offAllNamed(AppRoutes.login);
    } catch (e) {
      showError(e);
    }
  }

  Future<void> _deleteAccount(AuthRepository repo) async {
    final pw = TextEditingController();
    final ok = await Get.dialog<bool>(AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      title: Text('Hapus akun?'.tr, style: const TextStyle(fontWeight: FontWeight.bold)),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        Text('Tindakan ini tidak dapat dibatalkan. Masukkan password untuk konfirmasi.'.tr),
        const SizedBox(height: 12),
        TextField(controller: pw, obscureText: true, decoration: InputDecoration(labelText: 'Password'.tr)),
      ]),
      actions: [
        TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: Colors.red),
          onPressed: () => Get.back(result: true),
          child: Text('Hapus'.tr),
        ),
      ],
    ));
    if (ok != true) return;
    try {
      await repo.deleteAccount(pw.text);
      showSuccess('Akun berhasil dihapus');
      Get.offAllNamed(AppRoutes.login);
    } catch (e) {
      showError(e);
    }
  }
}
