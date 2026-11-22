import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:get/get.dart' hide navigator;

import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../core/api_client.dart';
import '../../core/call_state.dart';
import '../../core/format.dart';
import '../../core/socket_service.dart';
import '../../core/ui.dart';

/// Opens the call screen when the other participant rings us (from any screen).
class CallService extends GetxService {
  CallService(this._socket);
  final SocketService _socket;
  StreamSubscription? _sub;
  bool inCall = false;

  @override
  void onInit() {
    super.onInit();
    _sub = _socket.callIncoming.listen((m) {
      if (inCall) {
        // Already busy: let the caller know instead of leaving them ringing.
        _socket.callReject(m['konsultasiId'].toString());
        return;
      }
      Get.toNamed(AppRoutes.call, arguments: {'id': m['konsultasiId'].toString(), 'video': m['video'] != false, 'incoming': true});
    });
  }

  @override
  void onClose() {
    _sub?.cancel();
    super.onClose();
  }
}

class CallController extends GetxController {
  CallController({required this.id, required this.video, required this.incoming});
  final String id;
  final bool video;
  final bool incoming;

  final _api = Get.find<ApiClient>();
  final _socket = Get.find<SocketService>();
  final _service = Get.find<CallService>();
  final machine = CallMachine();

  final phase = CallPhase.idle.obs;
  final peerName = ''.obs;
  final endReason = RxnString();
  final muted = false.obs;
  final cameraOff = false.obs;
  final speakerOn = true.obs;
  final seconds = 0.obs;

  final localRenderer = RTCVideoRenderer();
  final remoteRenderer = RTCVideoRenderer();
  RTCPeerConnection? _pc;
  MediaStream? _local;
  final _pendingCandidates = <RTCIceCandidate>[];
  bool _remoteSet = false;
  final _subs = <StreamSubscription>[];
  Timer? _clock;
  Timer? _ringTimeout;

  void _apply(CallEvent e) {
    machine.apply(e);
    phase.value = machine.phase;
    endReason.value = machine.endReason;
    if (machine.phase == CallPhase.active) {
      _ringTimeout?.cancel();
      _clock ??= Timer.periodic(const Duration(seconds: 1), (_) => seconds.value++);
    }
    if (machine.phase == CallPhase.ended) {
      _teardown();
      Future.delayed(const Duration(milliseconds: 1200), () => Get.back());
    }
  }

  @override
  void onInit() {
    super.onInit();
    _service.inCall = true;
    _start();
  }

  Future<void> _start() async {
    try {
      await localRenderer.initialize();
      await remoteRenderer.initialize();
      final detail = asMap(await _api.get('/booking/consultations/$id'));
      final me = Get.find<SocketService>();
      final other = asMap(detail['dokter_id']).isNotEmpty ? asMap(detail['dokter_id']) : asMap(detail['pasien_id']);
      // The consultation payload names both sides; show whichever isn't us (resolved server-side by scope).
      peerName.value = other.s('nama', 'Konsultasi');
      me.connected.value; // keep the socket instance referenced for lints

      await _socket.joinChat(id);
      _listen();

      final ice = asMap(await _api.get('/booking/ice-servers'));
      await _openMedia();
      _pc = await createPeerConnection({'iceServers': ice['iceServers'] ?? [], 'sdpSemantics': 'unified-plan'});
      _wirePeer();

      if (incoming) {
        _apply(CallEvent.incoming);
        _ringTimeout = Timer(const Duration(seconds: 45), () => _apply(CallEvent.timeout));
      } else {
        final ack = await _socket.callInvite(id, video: video);
        if (ack['ok'] != true) {
          showError(ack['error'] == 'busy' ? 'Panggilan sedang berlangsung' : ack['error'] == 'consultation_not_active' ? 'Konsultasi sudah tidak aktif' : 'Gagal memulai panggilan');
          machine.phase = CallPhase.ended;
          phase.value = CallPhase.ended;
          _teardown();
          Get.back();
          return;
        }
        _apply(CallEvent.invite);
        _ringTimeout = Timer(const Duration(seconds: 45), () => _apply(CallEvent.timeout));
      }
    } catch (e) {
      showError('Tidak dapat mengakses kamera/mikrofon atau memulai panggilan.');
      _apply(CallEvent.failed);
      machine.phase = CallPhase.ended;
      phase.value = CallPhase.ended;
      Get.back();
    }
  }

  Future<void> _openMedia() async {
    _local = await navigator.mediaDevices.getUserMedia({
      'audio': {'echoCancellation': true, 'noiseSuppression': true},
      'video': video ? {'facingMode': 'user', 'width': {'ideal': 640}, 'height': {'ideal': 480}} : false,
    });
    localRenderer.srcObject = _local;
  }

  void _wirePeer() {
    final pc = _pc!;
    for (final t in _local!.getTracks()) {
      pc.addTrack(t, _local!);
    }
    pc.onIceCandidate = (c) {
      if (c.candidate == null) return;
      _socket.callSignal(id, 'candidate', {'candidate': c.candidate, 'sdpMid': c.sdpMid, 'sdpMLineIndex': c.sdpMLineIndex});
    };
    pc.onTrack = (e) {
      if (e.streams.isNotEmpty) remoteRenderer.srcObject = e.streams.first;
    };
    pc.onConnectionState = (s) {
      if (s == RTCPeerConnectionState.RTCPeerConnectionStateConnected) _apply(CallEvent.connected);
      if (s == RTCPeerConnectionState.RTCPeerConnectionStateFailed) _apply(CallEvent.failed);
    };
  }

  void _listen() {
    _subs.add(_socket.callAccepted.listen((m) async {
      if (m['konsultasiId'] != id || incoming) return;
      _apply(CallEvent.accepted);
      // The caller creates the offer once the callee has picked up.
      final offer = await _pc!.createOffer({'offerToReceiveAudio': 1, 'offerToReceiveVideo': video ? 1 : 0});
      await _pc!.setLocalDescription(offer);
      _socket.callSignal(id, 'offer', {'sdp': offer.sdp, 'type': offer.type});
    }));
    _subs.add(_socket.callSignals.listen((m) async {
      if (m['konsultasiId'] != id) return;
      final data = asMap(m['data']);
      switch (m['type']) {
        case 'offer':
          await _pc!.setRemoteDescription(RTCSessionDescription(data['sdp'] as String?, data['type'] as String?));
          _remoteSet = true;
          await _flushCandidates();
          final answer = await _pc!.createAnswer();
          await _pc!.setLocalDescription(answer);
          _socket.callSignal(id, 'answer', {'sdp': answer.sdp, 'type': answer.type});
        case 'answer':
          await _pc!.setRemoteDescription(RTCSessionDescription(data['sdp'] as String?, data['type'] as String?));
          _remoteSet = true;
          await _flushCandidates();
        case 'candidate':
          final c = RTCIceCandidate(data['candidate'] as String?, data['sdpMid'] as String?, (data['sdpMLineIndex'] as num?)?.toInt());
          // Candidates can outrun the offer/answer; hold them until the remote description exists.
          _remoteSet ? await _pc!.addCandidate(c) : _pendingCandidates.add(c);
      }
    }));
    _subs.add(_socket.callEnded.listen((m) {
      if (m['konsultasiId'] != id) return;
      _apply(m['reason'] == 'timeout' ? CallEvent.timeout : m['reason'] == 'rejected' ? CallEvent.rejected : CallEvent.remoteEnded);
    }));
  }

  Future<void> _flushCandidates() async {
    for (final c in _pendingCandidates) {
      await _pc!.addCandidate(c);
    }
    _pendingCandidates.clear();
  }

  /// Callee taps "Terima".
  Future<void> accept() async {
    final ack = await _socket.callAccept(id);
    if (ack['ok'] != true) {
      showError('Panggilan sudah berakhir');
      _apply(CallEvent.remoteEnded);
      return;
    }
    _ringTimeout?.cancel();
    _apply(CallEvent.accepted);
  }

  void decline() {
    _socket.callReject(id);
    _apply(CallEvent.localEnded);
  }

  void hangUp() {
    _socket.callEnd(id);
    _apply(CallEvent.localEnded);
  }

  void toggleMute() {
    muted.toggle();
    for (final t in _local?.getAudioTracks() ?? <MediaStreamTrack>[]) {
      t.enabled = !muted.value;
    }
  }

  void toggleCamera() {
    cameraOff.toggle();
    for (final t in _local?.getVideoTracks() ?? <MediaStreamTrack>[]) {
      t.enabled = !cameraOff.value;
    }
  }

  Future<void> switchCamera() async {
    final tracks = _local?.getVideoTracks() ?? [];
    if (tracks.isNotEmpty) await Helper.switchCamera(tracks.first);
  }

  Future<void> toggleSpeaker() async {
    speakerOn.toggle();
    await Helper.setSpeakerphoneOn(speakerOn.value);
  }

  void _teardown() {
    _clock?.cancel();
    _ringTimeout?.cancel();
    for (final s in _subs) {
      s.cancel();
    }
    _subs.clear();
    for (final t in _local?.getTracks() ?? <MediaStreamTrack>[]) {
      t.stop();
    }
    _local?.dispose();
    _local = null;
    _pc?.close();
    _pc = null;
  }

  @override
  void onClose() {
    if (machine.isLive) _socket.callEnd(id);
    _teardown();
    _service.inCall = false;
    localRenderer.dispose();
    remoteRenderer.dispose();
    super.onClose();
  }
}

class CallView extends StatelessWidget {
  const CallView({super.key});

  @override
  Widget build(BuildContext context) {
    final a = asMap(Get.arguments);
    final c = Get.put(CallController(id: a['id'].toString(), video: a['video'] != false, incoming: a['incoming'] == true), tag: a['id'].toString());
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) c.hangUp();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF020617)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: SafeArea(
            child: Obx(() {
              final phase = c.phase.value;
              final live = phase == CallPhase.active || phase == CallPhase.connecting;
              return Stack(children: [
                if (c.video && live) Positioned.fill(child: RTCVideoView(c.remoteRenderer, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover)) else const SizedBox.shrink(),
                if (!(c.video && phase == CallPhase.active))
                  Center(
                    child: Column(mainAxisSize: MainAxisSize.min, children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryColor.withValues(alpha: 0.25),
                              blurRadius: 36,
                              spreadRadius: 8,
                            ),
                          ],
                        ),
                        child: Avatar(name: c.peerName.value, radius: 56),
                      ),
                      const SizedBox(height: 20),
                      Text(c.peerName.value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: -0.3)),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(_status(c), style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                      ),
                    ]),
                  ),
                if (c.video && live)
                  Positioned(
                    right: 16,
                    top: 16,
                    width: 110,
                    height: 150,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        decoration: BoxDecoration(border: Border.all(color: Colors.white24, width: 2), borderRadius: BorderRadius.circular(16)),
                        child: ClipRRect(borderRadius: BorderRadius.circular(14), child: RTCVideoView(c.localRenderer, mirror: true, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover)),
                      ),
                    ),
                  ),
                if (phase == CallPhase.active)
                  Positioned(
                    top: 16,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.successColor, shape: BoxShape.circle)),
                          const SizedBox(width: 6),
                          Text(_clock(c.seconds.value), style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 24,
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: _controls(c, phase),
                  ),
                ),
              ]);
            }),
          ),
        ),
      ),
    );
  }

  String _status(CallController c) => switch (c.phase.value) {
        CallPhase.calling => 'Memanggil…'.tr,
        CallPhase.ringing => (c.video ? 'Panggilan video masuk' : 'Panggilan suara masuk').tr,
        CallPhase.connecting => 'Menghubungkan…'.tr,
        CallPhase.active => 'Terhubung'.tr,
        CallPhase.ended => switch (c.endReason.value) {
            'rejected' => 'Panggilan ditolak'.tr,
            'timeout' => 'Tidak dijawab'.tr,
            'failed' => 'Koneksi terputus'.tr,
            _ => 'Panggilan berakhir'.tr,
          },
        _ => 'Menyiapkan…'.tr,
      };

  String _clock(int s) => '${(s ~/ 60).toString().padLeft(2, '0')}:${(s % 60).toString().padLeft(2, '0')}';

  Widget _controls(CallController c, CallPhase phase) {
    Widget round(IconData icon, VoidCallback onTap, {Color color = Colors.white24, Color fg = Colors.white}) =>
        Padding(padding: const EdgeInsets.symmetric(horizontal: 10), child: CircleAvatar(radius: 28, backgroundColor: color, child: IconButton(icon: Icon(icon, color: fg), onPressed: onTap)));
    if (phase == CallPhase.ringing) {
      return Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        round(Icons.call_end, c.decline, color: Colors.red),
        const SizedBox(width: 40),
        round(Icons.call, c.accept, color: Colors.green),
      ]);
    }
    if (phase == CallPhase.ended) return const SizedBox.shrink();
    return Row(mainAxisAlignment: MainAxisAlignment.center, children: [
      round(c.muted.value ? Icons.mic_off : Icons.mic, c.toggleMute),
      if (c.video) round(c.cameraOff.value ? Icons.videocam_off : Icons.videocam, c.toggleCamera),
      if (c.video) round(Icons.cameraswitch, c.switchCamera),
      round(c.speakerOn.value ? Icons.volume_up : Icons.volume_down, c.toggleSpeaker),
      round(Icons.call_end, c.hangUp, color: Colors.red),
    ]);
  }
}
