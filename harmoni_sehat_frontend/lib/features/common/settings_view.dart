import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
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
    return ListView(children: [
      const SizedBox(height: 24),
      Center(child: Avatar(name: session.displayName, url: session.profile.value?['foto']?.toString(), radius: 44)),
      const SizedBox(height: 12),
      Center(child: Text(session.displayName, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold))),
      Center(child: Text(session.user.value?.email ?? '', style: const TextStyle(color: Colors.grey))),
      Center(child: Padding(padding: const EdgeInsets.only(top: 6), child: Chip(label: Text(role.toUpperCase())))),
      if ((role == 'dokter' || role == 'farmasi') && session.profile.value?['is_verified'] != true)
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.orange.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
          child: const Row(children: [Icon(Icons.hourglass_top, color: Colors.orange), SizedBox(width: 12), Expanded(child: Text('Akun Anda sedang menunggu verifikasi admin.'))]),
        ),
      const Divider(height: 32),
      Obx(() => SwitchListTile(secondary: const Icon(Icons.dark_mode_outlined), title: Text('Mode gelap'.tr), value: settings.themeMode.value == ThemeMode.dark, onChanged: settings.setDark)),
      Obx(() => ListTile(
            leading: const Icon(Icons.language),
            title: Text('Bahasa'.tr),
            trailing: DropdownButton<String>(
              value: settings.locale.value.languageCode,
              underline: const SizedBox(),
              items: const [DropdownMenuItem(value: 'id', child: Text('Indonesia')), DropdownMenuItem(value: 'en', child: Text('English'))],
              onChanged: (v) => settings.setLanguage(v ?? 'id'),
            ),
          )),
      ListTile(leading: const Icon(Icons.lock_outline), title: const Text('Ubah password'), onTap: () => _changePassword(repo)),
      ListTile(
        leading: const Icon(Icons.logout),
        title: Text('Keluar'.tr),
        onTap: () async {
          if (await confirm('Keluar', 'Anda yakin ingin keluar?', ok: 'Keluar')) {
            await repo.logout();
            Get.offAllNamed(AppRoutes.login);
          }
        },
      ),
      if (role != 'admin' && role != 'superadmin')
        ListTile(
          leading: const Icon(Icons.delete_forever_outlined, color: Colors.red),
          title: const Text('Hapus akun', style: TextStyle(color: Colors.red)),
          subtitle: const Text('Data identitas dihapus permanen sesuai UU PDP'),
          onTap: () => _deleteAccount(repo),
        ),
      const SizedBox(height: 32),
    ]);
  }

  Future<void> _changePassword(AuthRepository repo) async {
    final current = TextEditingController();
    final next = TextEditingController();
    final ok = await Get.dialog<bool>(AlertDialog(
      title: const Text('Ubah password'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        TextField(controller: current, obscureText: true, decoration: const InputDecoration(labelText: 'Password saat ini')),
        const SizedBox(height: 12),
        TextField(controller: next, obscureText: true, decoration: const InputDecoration(labelText: 'Password baru')),
      ]),
      actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(onPressed: () => Get.back(result: true), child: const Text('Simpan'))],
    ));
    if (ok != true) return;
    if (validatePassword(next.text) != null) return showError('Password baru: ${validatePassword(next.text)}');
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
      title: const Text('Hapus akun?'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        const Text('Tindakan ini tidak dapat dibatalkan. Masukkan password untuk konfirmasi.'),
        TextField(controller: pw, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
      ]),
      actions: [TextButton(onPressed: () => Get.back(result: false), child: const Text('Batal')), FilledButton(style: FilledButton.styleFrom(backgroundColor: Colors.red), onPressed: () => Get.back(result: true), child: const Text('Hapus'))],
    ));
    if (ok != true) return;
    try {
      await repo.deleteAccount(pw.text);
      await repo.logout();
      Get.offAllNamed(AppRoutes.login);
      showSuccess('Akun Anda telah dihapus.');
    } on ApiException catch (e) {
      showError(e);
    }
  }
}
