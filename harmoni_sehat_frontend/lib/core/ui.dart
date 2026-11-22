import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../app/theme/app_colors.dart';
import '../app/theme/pastel.dart';
import '../shared/widgets/kit.dart';
import 'api_client.dart';
import 'translations.dart';

void showSuccess(String msg) => _snack('Berhasil', msg, AppColors.primaryColor);
void showError(Object e) => _snack('Gagal', e is ApiException ? e.message : e.toString(), AppColors.errorColor);
void showInfo(String msg) => _snack('Info', msg, AppColors.secondaryColor);

/// Seam for tests: they replace this to capture messages instead of mounting real snackbars.
void Function(String title, String message, Color color) snackPresenter = _showSnackbar;

void _snack(String title, String msg, Color color) => snackPresenter(title.tr, localizeMessage(msg), color);

void _showSnackbar(String title, String msg, Color color) {
  if (Get.isSnackbarOpen) Get.closeCurrentSnackbar();
  Get.snackbar(
    title,
    msg,
    backgroundColor: color,
    colorText: Colors.white,
    margin: const EdgeInsets.all(16),
    borderRadius: 14,
    duration: const Duration(seconds: 3),
    snackPosition: SnackPosition.BOTTOM,
    boxShadows: [
      BoxShadow(
        color: color.withValues(alpha: 0.3),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ],
  );
}

/// Loading / error / empty / content switcher used by list screens.
Widget asyncBody({
  required bool loading,
  String? error,
  required bool isEmpty,
  required VoidCallback onRetry,
  required Widget Function() builder,
  String emptyText = 'Belum ada data',
  IconData emptyIcon = Icons.inbox_outlined,
}) {
  if (loading) return const SkeletonList();
  if (error != null) {
    return _StateMessage(
      icon: Icons.cloud_off_rounded,
      tone: Tone.rose,
      text: localizeMessage(error),
      action: OutlinedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh_rounded), label: Text('Coba lagi'.tr)),
    );
  }
  if (isEmpty) return _StateMessage(icon: emptyIcon, tone: Tone.sky, text: emptyText.tr);
  return builder();
}

class _StateMessage extends StatelessWidget {
  const _StateMessage({required this.icon, required this.tone, required this.text, this.action});
  final IconData icon;
  final Tone tone;
  final String text;
  final Widget? action;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            GlowAvatar(size: 104, tone: tone, child: Icon(icon, size: 44, color: toneOf(context, tone).ink)),
            const SizedBox(height: 18),
            Text(text, textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary, height: 1.4)),
            if (action != null) ...[const SizedBox(height: 18), action!],
          ]),
        ),
      );
}

/// Base controller for screens that load one thing from the API.
abstract class LoadController<T> extends GetxController {
  final loading = true.obs;
  final error = RxnString();
  final data = Rxn<T>();

  Future<T> fetch();

  @override
  void onInit() {
    super.onInit();
    load();
  }

  Future<void> load({bool silent = false}) async {
    if (!silent) loading.value = true;
    error.value = null;
    try {
      data.value = await fetch();
    } catch (e) {
      error.value = e is ApiException ? e.message : 'Terjadi kesalahan';
    } finally {
      loading.value = false;
    }
  }
}

class StatusChip extends StatelessWidget {
  const StatusChip(this.status, {super.key});
  final String status;

  static const _map = <String, (String, Tone)>{
    'pending': ('Menunggu', Tone.butter),
    'scheduled': ('Terjadwal', Tone.sky),
    'ongoing': ('Berlangsung', Tone.mint),
    'completed': ('Selesai', Tone.mint),
    'cancelled': ('Dibatalkan', Tone.rose),
    'processing': ('Diproses', Tone.sky),
    'shipped': ('Dikirim', Tone.lilac),
    'delivered': ('Diterima', Tone.mint),
    'failed': ('Gagal', Tone.rose),
    'expired': ('Kedaluwarsa', Tone.slate),
    'refunded': ('Dana kembali', Tone.lilac),
  };

  @override
  Widget build(BuildContext context) {
    final (label, tone) = _map[status] ?? (status, Tone.slate);
    return Pill(label.tr, tone: tone);
  }
}

class Avatar extends StatelessWidget {
  const Avatar({super.key, this.url, required this.name, this.radius = 24});
  final String? url;
  final String name;
  final double radius;

  static const _tones = [Tone.mint, Tone.sky, Tone.lilac, Tone.peach, Tone.rose, Tone.butter];

  @override
  Widget build(BuildContext context) {
    final words = name.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty && !w.toLowerCase().startsWith('dr')).toList();
    final initials = words.isEmpty ? '?' : words.take(2).map((w) => w[0].toUpperCase()).join();
    final tone = _tones[name.codeUnits.fold<int>(0, (a, b) => a + b) % _tones.length];
    final c = toneOf(context, tone);
    return Container(
      width: radius * 2,
      height: radius * 2,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(colors: [c.deco, c.bg], begin: Alignment.topLeft, end: Alignment.bottomRight),
        image: (url != null && url!.startsWith('http')) ? DecorationImage(image: NetworkImage(url!), fit: BoxFit.cover) : null,
      ),
      alignment: Alignment.center,
      child: (url != null && url!.startsWith('http')) ? null : Text(initials, style: TextStyle(color: c.ink, fontWeight: FontWeight.w800, fontSize: radius * 0.72)),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key, this.action, this.onAction});
  final String text;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => SectionHeading(text.tr, action: action?.tr, onAction: onAction);
}

Future<bool> confirm(String title, String message, {String ok = 'Ya'}) async {
  final res = await Get.dialog<bool>(AlertDialog(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
    title: Text(title.tr, style: const TextStyle(fontWeight: FontWeight.w700)),
    content: Text(message.tr),
    actions: [
      TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)),
      FilledButton(onPressed: () => Get.back(result: true), child: Text(ok.tr)),
    ],
  ));
  return res ?? false;
}
