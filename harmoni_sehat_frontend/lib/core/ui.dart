import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../app/theme/app_colors.dart';
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
  if (loading) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: CircularProgressIndicator(strokeWidth: 3),
      ),
    );
  }
  if (error != null) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.errorColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.cloud_off_outlined, size: 44, color: AppColors.errorColor),
            ),
            const SizedBox(height: 16),
            Text(
              localizeMessage(error),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh, size: 18),
              label: Text('Coba lagi'.tr),
            ),
          ],
        ),
      ),
    );
  }
  if (isEmpty) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.primaryLight.withValues(alpha: 0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(emptyIcon, size: 48, color: AppColors.primaryColor.withValues(alpha: 0.7)),
            ),
            const SizedBox(height: 16),
            Text(
              emptyText.tr,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
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
    'scheduled': ('Terjadwal', Color(0xFF0284C7)),
    'ongoing': ('Berlangsung', Color(0xFF0E9F6E)),
    'completed': ('Selesai', Color(0xFF10B981)),
    'cancelled': ('Dibatalkan', Color(0xFFEF4444)),
    'processing': ('Diproses', Color(0xFF0284C7)),
    'shipped': ('Dikirim', Color(0xFF6366F1)),
    'delivered': ('Diterima', Color(0xFF10B981)),
    'failed': ('Gagal', Color(0xFFEF4444)),
    'expired': ('Kedaluwarsa', Colors.grey),
    'refunded': ('Dana kembali', Colors.purple),
  };

  @override
  Widget build(BuildContext context) {
    final (label, color) = _map[status] ?? (status, Colors.grey);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.25), width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            margin: const EdgeInsets.only(right: 5),
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          Text(
            label.tr,
            style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600),
          ),
        ],
      ),
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
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.primaryLight, width: 2),
      ),
      child: CircleAvatar(
        radius: radius,
        backgroundColor: AppColors.primaryLight,
        foregroundImage: (url != null && url!.startsWith('http')) ? NetworkImage(url!) : null,
        child: Text(
          initials,
          style: TextStyle(
            color: AppColors.primaryColor,
            fontWeight: FontWeight.bold,
            fontSize: radius * 0.72,
          ),
        ),
      ),
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
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
        child: Row(
          children: [
            Container(
              width: 3.5,
              height: 16,
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                color: AppColors.primaryColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Expanded(
              child: Text(
                text.tr,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
            ),
            if (action != null)
              TextButton(
                onPressed: onAction,
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  action!.tr,
                  style: const TextStyle(
                    color: AppColors.primaryColor,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
          ],
        ),
      );
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
