import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../core/api_client.dart';
import '../../shared/widgets/kit.dart';
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
      appBar: AppBar(title: Text('Notifikasi'.tr), actions: [IconButton(tooltip: 'Tandai semua dibaca'.tr, icon: const Icon(Icons.done_all_rounded), onPressed: c.readAll), const SizedBox(width: 8)]),
      body: Obx(() => asyncBody(
            loading: c.loading.value,
            error: c.error.value,
            isEmpty: (c.data.value ?? []).isEmpty,
            emptyText: 'Belum ada notifikasi',
            emptyIcon: Icons.notifications_none_rounded,
            onRetry: c.load,
            builder: () => RefreshIndicator(
              onRefresh: c.load,
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                itemCount: c.data.value!.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (_, i) {
                  final n = c.data.value![i];
                  final unread = n['is_read'] != true;
                  final (icon, tone) = switch (n['tipe']) {
                    'success' => (Icons.check_circle_rounded, Tone.mint),
                    'warning' => (Icons.warning_amber_rounded, Tone.butter),
                    'error' => (Icons.error_rounded, Tone.rose),
                    _ => (Icons.notifications_rounded, Tone.sky),
                  };
                  return SoftCard(
                    tone: unread ? tone : null,
                    blobs: unread,
                    radius: 22,
                    padding: const EdgeInsets.all(14),
                    onTap: () => c.open(n),
                    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      ToneIcon(icon, tone: tone, size: 42),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(n['judul']?.toString() ?? '', style: TextStyle(fontWeight: unread ? FontWeight.w800 : FontWeight.w600)),
                          if ((n['isi'] ?? '').toString().isNotEmpty) Padding(padding: const EdgeInsets.only(top: 2), child: Text('${n['isi']}', style: const TextStyle(color: AppColors.textSecondary, height: 1.3))),
                          Padding(padding: const EdgeInsets.only(top: 6), child: Text(fmtDateTime(n['createdAt']), style: const TextStyle(fontSize: 11, color: AppColors.textMuted))),
                        ]),
                      ),
                    ]),
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
    return Obx(() => Padding(
          padding: const EdgeInsets.only(right: 4),
          child: Material(
            color: Theme.of(context).colorScheme.surfaceContainerHighest,
            shape: const CircleBorder(),
            child: IconButton(
              onPressed: () => Get.toNamed(AppRoutes.notifications),
              icon: Badge(isLabelVisible: socket.unread.value > 0, label: Text('${socket.unread.value}'), child: const Icon(Icons.notifications_none_rounded)),
            ),
          ),
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
