/// Pure state machine for a 1:1 call. The WebRTC plumbing lives in CallController; keeping the
/// rules here makes them unit-testable without a device.
enum CallPhase { idle, calling, ringing, connecting, active, ended }

enum CallEvent { invite, incoming, accepted, rejected, remoteEnded, localEnded, connected, failed, timeout }

class CallMachine {
  CallMachine({this.phase = CallPhase.idle});
  CallPhase phase;

  /// Why the call ended (for the UI): rejected | ended | failed | timeout | busy.
  String? endReason;

  /// Applies [e]; returns true when the phase changed.
  bool apply(CallEvent e) {
    final before = phase;
    switch ((phase, e)) {
      case (CallPhase.idle, CallEvent.invite):
        phase = CallPhase.calling;
      case (CallPhase.idle, CallEvent.incoming):
        phase = CallPhase.ringing;
      // Caller: the callee picked up, so negotiation starts.
      case (CallPhase.calling, CallEvent.accepted):
        phase = CallPhase.connecting;
      // Callee: we accepted locally (triggered by the UI).
      case (CallPhase.ringing, CallEvent.accepted):
        phase = CallPhase.connecting;
      case (CallPhase.connecting, CallEvent.connected):
        phase = CallPhase.active;
      case (CallPhase.calling, CallEvent.rejected):
        _end('rejected');
      case (CallPhase.calling, CallEvent.timeout):
      case (CallPhase.ringing, CallEvent.timeout):
        _end('timeout');
      case (CallPhase.connecting, CallEvent.failed):
      case (CallPhase.active, CallEvent.failed):
        _end('failed');
      case (CallPhase.ended, _):
        break; // terminal
      case (_, CallEvent.remoteEnded):
        _end('ended');
      case (_, CallEvent.localEnded):
        _end('ended');
      default:
        break;
    }
    return phase != before;
  }

  void _end(String reason) {
    phase = CallPhase.ended;
    endReason = reason;
  }

  bool get isLive => phase != CallPhase.idle && phase != CallPhase.ended;
}
