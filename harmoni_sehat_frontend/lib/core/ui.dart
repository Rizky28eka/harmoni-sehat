import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../app/theme/app_colors.dart';
import 'api_client.dart';
import 'translations.dart';

void showSuccess(String msg) => _snack('Berhasil', msg, AppColors.primaryColor);
void showError(Object e) => _snack('Gagal', e is ApiException ? e.message : e.toString(), AppColors.errorColor);
void showInfo(String msg) => _snack('Info', msg, Colors.blueGrey);

/// Seam for tests: they replace this to capture messages instead of mounting real snackbars.
void Function(String title, String message, Color color) snackPresenter = _showSnackbar;

void _snack(String title, String msg, Color color) => snackPresenter(title.tr, localizeMessage(msg), color);

void _showSnackbar(String title, String msg, Color color) {
  if (Get.isSnackbarOpen) Get.closeCurrentSnackbar();
  Get.snackbar(title, msg,
      backgroundColor: color, colorText: Colors.white, margin: const EdgeInsets.all(12), duration: const Duration(seconds: 3), snackPosition: SnackPosition.BOTTOM);
}

/// Loading / error / empty / content switcher used by list screens.
///
/// A function (not a widget) on purpose: [builder] runs synchronously inside the caller's `Obx`,
/// so Rx reads in it stay reactive, yet it is only invoked once data exists, so `data.value!` is safe.
Widget asyncBody({
  required bool loading,
  String? error,
  required bool isEmpty,
  required VoidCallback onRetry,
  required Widget Function() builder,
  String emptyText = 'Belum ada data',
  IconData emptyIcon = Icons.inbox_outlined,
}) {
  if (loading) return const Center(child: CircularProgressIndicator());
  if (error != null) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.cloud_off_outlined, size: 48, color: AppColors.textSecondary),
          const SizedBox(height: 12),
          Text(localizeMessage(error), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          OutlinedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: Text('Coba lagi'.tr)),
        ]),
      ),
    );
  }
  if (isEmpty) {
    return Center(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(emptyIcon, size: 56, color: AppColors.textSecondary.withValues(alpha: 0.6)),
        const SizedBox(height: 8),
        Text(emptyText.tr, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary)),
      ]),
    );
  }
  return builder();
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

  static const _map = <String, (String, Color)>{
    'pending': ('Menunggu', Colors.orange),
    'scheduled': ('Terjadwal', Colors.blue),
    'ongoing': ('Berlangsung', Colors.teal),
    'completed': ('Selesai', Colors.green),
    'cancelled': ('Dibatalkan', Colors.red),
    'processing': ('Diproses', Colors.blue),
    'shipped': ('Dikirim', Colors.indigo),
    'delivered': ('Diterima', Colors.green),
    'failed': ('Gagal', Colors.red),
    'expired': ('Kedaluwarsa', Colors.grey),
    'refunded': ('Dana kembali', Colors.purple),
  };

  @override
  Widget build(BuildContext context) {
    final (label, color) = _map[status] ?? (status, Colors.grey);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(20)),
      child: Text(label.tr, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
    );
  }
}

class Avatar extends StatelessWidget {
  const Avatar({super.key, this.url, required this.name, this.radius = 24});
  final String? url;
  final String name;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final initials = name.trim().isEmpty ? '?' : name.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty).take(2).map((w) => w[0].toUpperCase()).join();
    return CircleAvatar(
      radius: radius,
      backgroundColor: AppColors.primaryColor.withValues(alpha: 0.15),
      foregroundImage: (url != null && url!.startsWith('http')) ? NetworkImage(url!) : null,
      child: Text(initials, style: const TextStyle(color: AppColors.primaryColor, fontWeight: FontWeight.bold)),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key, this.action, this.onAction});
  final String text;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
        child: Row(children: [
          Expanded(child: Text(text.tr, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold))),
          if (action != null) TextButton(onPressed: onAction, child: Text(action!.tr)),
        ]),
      );
}

Future<bool> confirm(String title, String message, {String ok = 'Ya'}) async {
  final res = await Get.dialog<bool>(AlertDialog(
    title: Text(title.tr),
    content: Text(message.tr),
    actions: [
      TextButton(onPressed: () => Get.back(result: false), child: Text('Batal'.tr)),
      FilledButton(onPressed: () => Get.back(result: true), child: Text(ok.tr)),
    ],
  ));
  return res ?? false;
}
