import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';

class NotificationsController extends LoadController<List<Map<String, dynamic>>> {
  final _api = Get.find<ApiClient>();
  final _socket = Get.find<SocketService>();

  @override
  Future<List<Map<String, dynamic>>> fetch() async {
    final list = asList(await _api.get('/notifications', cache: true))..sort((a, b) => '${b['createdAt']}'.compareTo('${a['createdAt']}'));
    _socket.unread.value = list.where((n) => n['is_read'] != true).length;
    return list;
  }

  @override
  void onInit() {
    super.onInit();
    ever(_socket.unread, (_) => load(silent: true));
  }

  Future<void> open(Map<String, dynamic> n) async {
    if (n['is_read'] != true) {
      try {
        await _api.post('/notifications/${n['_id']}/read');
      } catch (_) {}
      load(silent: true);
    }
    final d = asMap(n['data']);
    switch (d['type']) {
      case 'consultation':
        Get.toNamed(AppRoutes.consultation, arguments: d['id']);
      case 'order':
        Get.toNamed(AppRoutes.orderDetail, arguments: d['id']);
      case 'chat':
        Get.toNamed(AppRoutes.consultation, arguments: d['id']);
    }
  }

  Future<void> readAll() async {
    await _api.post('/notifications/read-all');
    _socket.unread.value = 0;
    load(silent: true);
  }
}

class NotificationsView extends StatelessWidget {
  const NotificationsView({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Get.put(NotificationsController());
    return Scaffold(
      appBar: AppBar(title: Text('Notifikasi'.tr), actions: [IconButton(tooltip: 'Tandai semua dibaca'.tr, icon: const Icon(Icons.done_all), onPressed: c.readAll)]),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada notifikasi',
            emptyIcon: Icons.notifications_none,
            onRetry: c.load,
            builder: () => RefreshIndicator(
              onRefresh: c.load,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: c.data.value!.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (_, i) {
                  final n = c.data.value![i];
                  final unread = n['is_read'] != true;
                  final (icon, color, bg) = switch (n['tipe']) {
                    'success' => (Icons.check_circle_outline, AppColors.successColor, AppColors.primaryLight),
                    'warning' => (Icons.warning_amber, AppColors.warningColor, AppColors.accentAmberLight),
                    'error' => (Icons.error_outline, AppColors.errorColor, AppColors.accentRoseLight),
                    _ => (Icons.info_outline, AppColors.secondaryColor, AppColors.secondaryLight),
                  };
                  return Card(
                    color: unread ? AppColors.primaryLight.withValues(alpha: 0.15) : null,
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
                        child: Icon(icon, color: color, size: 22),
                      ),
                      title: Text(n['judul']?.toString() ?? '', style: TextStyle(fontWeight: unread ? FontWeight.bold : FontWeight.w600, fontSize: 14)),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text('${n['isi'] ?? ''}\n${fmtDateTime(n['createdAt'])}', style: const TextStyle(fontSize: 12)),
                      ),
                      isThreeLine: true,
                      onTap: () => c.open(n),
                    ),
                  );
                },
              ),
            ),
          )),
    );
  }
}

/// Bell with unread badge, shown in every shell's app bar.
class NotificationBell extends StatelessWidget {
  const NotificationBell({super.key});

  @override
  Widget build(BuildContext context) {
    final socket = Get.find<SocketService>();
    return Obx(() => IconButton(
          onPressed: () => Get.toNamed(AppRoutes.notifications),
          icon: Badge(isLabelVisible: socket.unread.value > 0, label: Text('${socket.unread.value}'), child: const Icon(Icons.notifications_none_outlined)),
        ));
  }
}

/// Loads the unread count once after sign-in.
Future<void> primeUnreadCount() async {
  try {
    final r = asMap(await Get.find<ApiClient>().get('/notifications/unread-count'));
    Get.find<SocketService>().unread.value = (r['count'] as num?)?.toInt() ?? 0;
  } catch (_) {}
}

String greeting() {
  final h = DateTime.now().hour;
  final name = Get.find<SessionService>().displayName;
  final part = (h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam').tr;
  return '$part, ${name.split(' ').first}';
}
