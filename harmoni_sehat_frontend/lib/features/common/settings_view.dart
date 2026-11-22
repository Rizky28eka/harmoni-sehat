import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
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
    final mint = toneOf(context, Tone.mint);
    Widget row({required IconData icon, required Tone tone, required String title, String? subtitle, Widget? trailing, VoidCallback? onTap, Color? titleColor}) => ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          leading: ToneIcon(icon, tone: tone, size: 42),
          title: Text(title, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5, color: titleColor)),
          subtitle: subtitle == null ? null : Text(subtitle, style: const TextStyle(fontSize: 12)),
          trailing: trailing ?? (onTap == null ? null : const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted)),
          onTap: onTap,
        );
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
      children: [
        SoftCard(
          tone: Tone.mint,
          radius: 32,
          padding: const EdgeInsets.fromLTRB(20, 26, 20, 22),
          child: Column(children: [
            Avatar(name: session.displayName, url: session.profile.value?['foto']?.toString(), radius: 44),
            const SizedBox(height: 14),
            Text(session.displayName, textAlign: TextAlign.center, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: mint.ink, letterSpacing: -0.5)),
            const SizedBox(height: 3),
            Text(session.user.value?.email ?? '', style: TextStyle(color: mint.ink.withValues(alpha: 0.8), fontSize: 13)),
            const SizedBox(height: 12),
            Pill(role.toUpperCase(), tone: Tone.mint, icon: Icons.verified_user_rounded),
          ]),
        ),
        if ((role == 'dokter' || role == 'farmasi') && session.profile.value?['is_verified'] != true)
          Padding(
            padding: const EdgeInsets.only(top: 14),
            child: SoftCard(
              tone: Tone.butter,
              radius: 22,
              padding: const EdgeInsets.all(14),
              child: Row(children: [
                Icon(Icons.hourglass_top_rounded, color: toneOf(context, Tone.butter).ink),
                const SizedBox(width: 12),
                Expanded(child: Text('Akun Anda sedang menunggu verifikasi admin.'.tr, style: TextStyle(fontSize: 13, color: toneOf(context, Tone.butter).ink, fontWeight: FontWeight.w600))),
              ]),
            ),
          ),
        const SizedBox(height: 18),
        SoftCard(
          radius: 26,
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Column(children: [
            Obx(() => SwitchListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  secondary: const ToneIcon(Icons.dark_mode_rounded, tone: Tone.lilac, size: 42),
                  title: Text('Mode gelap'.tr, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5)),
                  value: settings.themeMode.value == ThemeMode.dark,
                  onChanged: settings.setDark,
                )),
            Obx(() => row(
                  icon: Icons.language_rounded,
                  tone: Tone.sky,
                  title: 'Bahasa'.tr,
                  trailing: DropdownButton<String>(
                    value: settings.locale.value.languageCode,
                    underline: const SizedBox(),
                    borderRadius: BorderRadius.circular(18),
                    items: [DropdownMenuItem(value: 'id', child: Text('Indonesia'.tr)), DropdownMenuItem(value: 'en', child: Text('English'.tr))],
                    onChanged: (v) => settings.setLanguage(v ?? 'id'),
                  ),
                )),
            row(icon: Icons.lock_rounded, tone: Tone.mint, title: 'Ubah password'.tr, onTap: () => _changePassword(repo)),
            if (role == 'pasien') ...[
              row(icon: Icons.folder_rounded, tone: Tone.sky, title: 'Rekam medis'.tr, onTap: () => Get.toNamed(AppRoutes.medicalRecords)),
              row(icon: Icons.alarm_rounded, tone: Tone.butter, title: 'Pengingat obat'.tr, onTap: () => Get.toNamed(AppRoutes.reminders)),
              row(icon: Icons.receipt_long_rounded, tone: Tone.peach, title: 'Pesanan obat'.tr, onTap: () => Get.toNamed(AppRoutes.orders)),
            ],
          ]),
        ),
        const SizedBox(height: 14),
        SoftCard(
          radius: 26,
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Column(children: [
            row(
              icon: Icons.logout_rounded,
              tone: Tone.rose,
              title: 'Keluar'.tr,
              titleColor: toneOf(context, Tone.rose).ink,
              onTap: () async {
                if (await confirm('Keluar', 'Anda yakin ingin keluar?', ok: 'Keluar')) {
                  await repo.logout();
                  Get.offAllNamed(AppRoutes.login);
                }
              },
            ),
            if (role != 'admin' && role != 'superadmin')
              row(
                icon: Icons.delete_forever_rounded,
                tone: Tone.rose,
                title: 'Hapus akun'.tr,
                subtitle: 'Data identitas dihapus permanen sesuai UU PDP'.tr,
                titleColor: AppColors.errorColor,
                onTap: () => _deleteAccount(repo),
              ),
          ]),
        ),
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
