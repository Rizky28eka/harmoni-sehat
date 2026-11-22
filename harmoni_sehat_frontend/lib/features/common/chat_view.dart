import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../app/routes/app_routes.dart';

import '../../app/theme/pastel.dart';
import '../../shared/widgets/kit.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/format.dart';
import '../../core/session.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';

class ChatController extends GetxController {
  ChatController(this.consultationId, this.title);
  final String consultationId;
  final String title;

  final _api = Get.find<ApiClient>();
  final _socket = Get.find<SocketService>();
  final _me = Get.find<SessionService>().user.value!.id;

  final messages = <Map<String, dynamic>>[].obs;
  final loading = true.obs;
  final error = RxnString();
  final peerTyping = false.obs;
  final input = TextEditingController();
  final scroll = ScrollController();
  final sending = false.obs;

  final _subs = <StreamSubscription>[];
  Timer? _typingTimer;
  Timer? _peerTypingTimer;

  String get me => _me;

  @override
  void onInit() {
    super.onInit();
    _init();
  }

  Future<void> _init() async {
    try {
      messages.assignAll(asList(await _api.get('/booking/consultations/$consultationId/messages')));
      final joined = await _socket.joinChat(consultationId);
      if (joined['ok'] != true && joined['error'] == 'forbidden') {
        error.value = 'Anda tidak memiliki akses ke obrolan ini.';
      }
      _subs.add(_socket.chatMessages.listen((m) {
        if (m['konsultasi_id']?.toString() != consultationId) return;
        if (!messages.any((x) => x['_id'] == m['_id'])) messages.add(m);
        _scrollDown();
        if (m['pengirim_id']?.toString() != _me) _socket.markRead(consultationId);
      }));
      _subs.add(_socket.typing.listen((t) {
        if (t['konsultasiId'] != consultationId || t['userId'] == _me) return;
        peerTyping.value = t['typing'] == true;
        _peerTypingTimer?.cancel();
        _peerTypingTimer = Timer(const Duration(seconds: 4), () => peerTyping.value = false);
      }));
      _subs.add(_socket.reads.listen((r) {
        if (r['konsultasiId'] != consultationId) return;
        for (var i = 0; i < messages.length; i++) {
          if (messages[i]['pengirim_id']?.toString() == _me) messages[i] = {...messages[i], 'is_read': true};
        }
      }));
      _socket.markRead(consultationId);
      _scrollDown();
    } catch (e) {
      error.value = e is ApiException ? e.message : 'Gagal memuat obrolan';
    } finally {
      loading.value = false;
    }
  }

  void _scrollDown() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (scroll.hasClients) scroll.animateTo(scroll.position.maxScrollExtent + 80, duration: const Duration(milliseconds: 200), curve: Curves.easeOut);
      });

  void onChanged(String _) {
    _socket.setTyping(consultationId, true);
    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(seconds: 2), () => _socket.setTyping(consultationId, false));
  }

  Future<void> send({String? text, String type = 'text', String? fileUrl}) async {
    final body = (text ?? input.text).trim();
    if (body.isEmpty || sending.value) return;
    sending.value = true;
    final res = await _socket.sendMessage(consultationId, body, type: type, fileUrl: fileUrl);
    sending.value = false;
    if (res['ok'] == true) {
      input.clear();
    } else {
      showError(switch (res['error']) {
        'consultation_not_active' => 'Konsultasi sudah tidak aktif.',
        'offline' => 'Tidak terhubung. Coba lagi.',
        _ => 'Pesan gagal dikirim.',
      });
    }
  }

  Future<void> attachImage() async {
    final file = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80, maxWidth: 1600);
    if (file == null) return;
    try {
      final media = asMap(await _api.upload('/media/upload', file.path));
      await send(text: 'Foto', type: 'image', fileUrl: media['url']?.toString());
    } catch (e) {
      showError(e);
    }
  }

  @override
  void onClose() {
    for (final s in _subs) {
      s.cancel();
    }
    _typingTimer?.cancel();
    _peerTypingTimer?.cancel();
    input.dispose();
    scroll.dispose();
    super.onClose();
  }
}

class ChatView extends StatelessWidget {
  const ChatView({super.key});

  @override
  Widget build(BuildContext context) {
    final args = Get.arguments as Map<String, dynamic>;
    final c = Get.put(ChatController(args['id'] as String, args['title']?.toString() ?? 'Konsultasi'), tag: args['id'] as String);
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(children: [
          Avatar(name: c.title, radius: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Obx(() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(c.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  Text(c.peerTyping.value ? 'sedang mengetik…'.tr : 'Aktif'.tr, style: TextStyle(fontSize: 11.5, color: c.peerTyping.value ? AppColors.primaryColor : AppColors.textMuted, fontWeight: FontWeight.w600)),
                ])),
          ),
        ]),
        actions: [
          if (args['canCall'] == true) ...[
            IconButton.filledTonal(tooltip: 'Panggilan suara'.tr, icon: const Icon(Icons.call_outlined), onPressed: () => Get.toNamed(AppRoutes.call, arguments: {'id': args['id'], 'video': false})),
            IconButton.filledTonal(tooltip: 'Video call'.tr, icon: const Icon(Icons.videocam_outlined), onPressed: () => Get.toNamed(AppRoutes.call, arguments: {'id': args['id'], 'video': true})),
            const SizedBox(width: 8),
          ],
        ],
      ),
      body: Obx(() {
        if (c.loading.value) return const SkeletonList(count: 5, itemHeight: 56);
        if (c.error.value != null) return Center(child: Padding(padding: const EdgeInsets.all(24), child: Text(c.error.value!, textAlign: TextAlign.center)));
        return Column(children: [
          Expanded(
            child: c.messages.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(mainAxisSize: MainAxisSize.min, children: [
                        GlowAvatar(size: 96, tone: Tone.sky, child: Icon(Icons.waving_hand_rounded, size: 40, color: toneOf(context, Tone.sky).ink)),
                        const SizedBox(height: 16),
                        Text('Mulai percakapan dengan menyapa 👋'.tr, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
                      ]),
                    ),
                  )
                : ListView.builder(
                    controller: c.scroll,
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                    itemCount: c.messages.length,
                    itemBuilder: (_, i) {
                      final m = c.messages[i];
                      final day = parseDate(m['timestamp']);
                      final prev = i > 0 ? parseDate(c.messages[i - 1]['timestamp']) : null;
                      final newDay = day != null && (prev == null || !DateUtils.isSameDay(prev, day));
                      return Column(children: [
                        if (newDay) Padding(padding: const EdgeInsets.symmetric(vertical: 10), child: Pill(dayHeading(day), tone: Tone.slate, dense: true)),
                        _Bubble(m: m, mine: m['pengirim_id']?.toString() == c.me),
                      ]);
                    },
                  ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 10),
              child: Row(children: [
                IconButton.filledTonal(icon: const Icon(Icons.add_photo_alternate_outlined), onPressed: c.attachImage),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: c.input,
                    minLines: 1,
                    maxLines: 4,
                    textCapitalization: TextCapitalization.sentences,
                    onChanged: c.onChanged,
                    decoration: InputDecoration(
                      hintText: 'Tulis pesan…'.tr,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide(color: scheme.primary, width: 1.6)),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Obx(() => IconButton.filled(style: IconButton.styleFrom(minimumSize: const Size(52, 52)), onPressed: c.sending.value ? null : () => c.send(), icon: const Icon(Icons.send_rounded))),
              ]),
            ),
          ),
        ]);
      }),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.m, required this.mine});
  final Map<String, dynamic> m;
  final bool mine;

  @override
  Widget build(BuildContext context) {
    final isImage = m['tipe'] == 'image' && m['file_url'] != null;
    final theirs = toneOf(context, Tone.slate);
    final fg = mine ? Colors.white : Theme.of(context).colorScheme.onSurface;
    final radius = BorderRadius.only(topLeft: const Radius.circular(22), topRight: const Radius.circular(22), bottomLeft: Radius.circular(mine ? 22 : 6), bottomRight: Radius.circular(mine ? 6 : 22));
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 3),
        padding: isImage ? const EdgeInsets.all(4) : const EdgeInsets.fromLTRB(16, 10, 14, 8),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        decoration: BoxDecoration(color: mine ? null : theirs.bg, gradient: mine ? const LinearGradient(colors: [Color(0xFF14B885), AppColors.primaryColor], begin: Alignment.topLeft, end: Alignment.bottomRight) : null, borderRadius: radius),
        child: Column(crossAxisAlignment: CrossAxisAlignment.end, mainAxisSize: MainAxisSize.min, children: [
          if (isImage)
            ClipRRect(borderRadius: BorderRadius.circular(18), child: Image.network(m['file_url'].toString(), width: 230, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Padding(padding: EdgeInsets.all(24), child: Icon(Icons.broken_image_rounded))))
          else
            Align(alignment: Alignment.centerLeft, child: Text(m['isi']?.toString() ?? '', style: TextStyle(color: fg, height: 1.35, fontSize: 15))),
          const SizedBox(height: 3),
          Row(mainAxisSize: MainAxisSize.min, children: [
            Text(fmtTime(m['timestamp']), style: TextStyle(color: fg.withValues(alpha: 0.7), fontSize: 10.5)),
            if (mine) ...[const SizedBox(width: 4), Icon(m['is_read'] == true ? Icons.done_all_rounded : Icons.done_rounded, size: 14, color: Colors.white.withValues(alpha: 0.9))],
          ]),
        ]),
      ),
    );
  }
}

/// "Today" / "Yesterday" / date, for chat and notification groupings.
String dayHeading(DateTime d) {
  final today = DateUtils.dateOnly(DateTime.now());
  final diff = today.difference(DateUtils.dateOnly(d)).inDays;
  if (diff == 0) return 'Hari ini'.tr;
  if (diff == 1) return 'Kemarin'.tr;
  return fmtDate(d.toIso8601String());
}
