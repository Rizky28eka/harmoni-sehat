import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';

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
    return Scaffold(
      appBar: AppBar(
        title: Obx(() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(c.title, style: const TextStyle(fontSize: 16)),
              if (c.peerTyping.value) const Text('sedang mengetik…', style: TextStyle(fontSize: 11)),
            ])),
        actions: [
          if (args['video'] != null)
            IconButton(
              tooltip: 'Video call',
              icon: const Icon(Icons.videocam_outlined),
              onPressed: () => launchUrl(Uri.parse(args['video'] as String), mode: LaunchMode.externalApplication),
            ),
        ],
      ),
      body: Obx(() {
        if (c.loading.value) return const Center(child: CircularProgressIndicator());
        if (c.error.value != null) return Center(child: Text(c.error.value!));
        return Column(children: [
          Expanded(
            child: c.messages.isEmpty
                ? const Center(child: Text('Mulai percakapan dengan menyapa 👋'))
                : ListView.builder(
                    controller: c.scroll,
                    padding: const EdgeInsets.all(12),
                    itemCount: c.messages.length,
                    itemBuilder: (_, i) => _Bubble(m: c.messages[i], mine: c.messages[i]['pengirim_id']?.toString() == c.me),
                  ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 8, 8),
              child: Row(children: [
                IconButton(icon: const Icon(Icons.image_outlined), onPressed: c.attachImage),
                Expanded(
                  child: TextField(
                    controller: c.input,
                    minLines: 1,
                    maxLines: 4,
                    textCapitalization: TextCapitalization.sentences,
                    onChanged: c.onChanged,
                    decoration: InputDecoration(hintText: 'Tulis pesan…', filled: true, contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10), border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none)),
                  ),
                ),
                const SizedBox(width: 6),
                Obx(() => IconButton.filled(onPressed: c.sending.value ? null : () => c.send(), icon: const Icon(Icons.send))),
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
    final bg = mine ? AppColors.primaryColor : Theme.of(context).colorScheme.surfaceContainerHighest;
    final fg = mine ? Colors.white : Theme.of(context).colorScheme.onSurface;
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 3),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(14)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          if (isImage)
            ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.network(m['file_url'].toString(), width: 220, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.broken_image)))
          else
            Text(m['isi']?.toString() ?? '', style: TextStyle(color: fg)),
          const SizedBox(height: 2),
          Row(mainAxisSize: MainAxisSize.min, children: [
            Text(fmtTime(m['timestamp']), style: TextStyle(color: fg.withValues(alpha: 0.7), fontSize: 10)),
            if (mine) ...[const SizedBox(width: 4), Icon(m['is_read'] == true ? Icons.done_all : Icons.done, size: 12, color: fg.withValues(alpha: 0.8))],
          ]),
        ]),
      ),
    );
  }
}
