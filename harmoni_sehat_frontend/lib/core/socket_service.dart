import 'dart:async';

import 'package:get/get.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import 'config.dart';
import 'session.dart';

/// Realtime channel: chat rooms and live notifications.
class SocketService extends GetxService {
  SocketService(this._session);
  final SessionService _session;

  io.Socket? _socket;
  final connected = false.obs;
  final unread = 0.obs;

  final _chat = StreamController<Map<String, dynamic>>.broadcast();
  final _notif = StreamController<Map<String, dynamic>>.broadcast();
  final _typing = StreamController<Map<String, dynamic>>.broadcast();
  final _read = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get chatMessages => _chat.stream;
  Stream<Map<String, dynamic>> get notifications => _notif.stream;
  Stream<Map<String, dynamic>> get typing => _typing.stream;
  Stream<Map<String, dynamic>> get reads => _read.stream;

  void connect() {
    final token = _session.accessToken;
    if (token == null || (_socket?.connected ?? false)) return;
    _socket?.dispose();
    final s = _socket = io.io(
      AppConfig.socketUrl,
      io.OptionBuilder().setTransports(['websocket']).setAuth({'token': token}).enableReconnection().disableAutoConnect().build(),
    );
    s.onConnect((_) => connected.value = true);
    s.onDisconnect((_) => connected.value = false);
    // Reconnects reuse the original auth payload; refresh it with the latest token first.
    s.onReconnectAttempt((_) => s.auth = {'token': _session.accessToken});
    s.on('chat:message', (d) => _chat.add(Map<String, dynamic>.from(d as Map)));
    s.on('chat:typing', (d) => _typing.add(Map<String, dynamic>.from(d as Map)));
    s.on('chat:read', (d) => _read.add(Map<String, dynamic>.from(d as Map)));
    s.on('notification', (d) {
      unread.value++;
      _notif.add(Map<String, dynamic>.from(d as Map));
    });
    s.connect();
  }

  void disconnect() {
    _socket?.dispose();
    _socket = null;
    connected.value = false;
    unread.value = 0;
  }

  Future<Map<String, dynamic>> _emit(String event, Map<String, dynamic> payload) {
    final c = Completer<Map<String, dynamic>>();
    final s = _socket;
    if (s == null || !s.connected) {
      c.complete({'ok': false, 'error': 'offline'});
    } else {
      s.emitWithAck(event, payload, ack: (res) => c.complete(res is Map ? Map<String, dynamic>.from(res) : {'ok': false}));
      Future.delayed(const Duration(seconds: 10), () {
        if (!c.isCompleted) c.complete({'ok': false, 'error': 'timeout'});
      });
    }
    return c.future;
  }

  Future<Map<String, dynamic>> joinChat(String consultationId) => _emit('chat:join', {'konsultasiId': consultationId});

  Future<Map<String, dynamic>> sendMessage(String consultationId, String text, {String type = 'text', String? fileUrl}) =>
      _emit('chat:send', {'konsultasiId': consultationId, 'isi': text, 'tipe': type, if (fileUrl != null) 'file_url': fileUrl});

  void markRead(String consultationId) => _socket?.emit('chat:read', {'konsultasiId': consultationId});
  void setTyping(String consultationId, bool typing) => _socket?.emit('chat:typing', {'konsultasiId': consultationId, 'typing': typing});

  @override
  void onClose() {
    _socket?.dispose();
    _chat.close();
    _notif.close();
    _typing.close();
    _read.close();
    super.onClose();
  }
}
