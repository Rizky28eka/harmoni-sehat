import 'package:flutter_test/flutter_test.dart';
import 'package:harmoni_sehat_frontend/core/call_state.dart';
import 'package:harmoni_sehat_frontend/core/reminder_plan.dart';

Map<String, dynamic> reminder(String id, List<String> times, {bool active = true, String? start, String? end}) =>
    {'_id': id, 'nama_obat': 'Amoxicillin', 'dosis': '500mg', 'jam': times, 'is_active': active, if (start != null) 'tanggal_mulai': start, if (end != null) 'tanggal_selesai': end};

void main() {
  // 2026-03-10 05:00 UTC == 12:00 WIB.
  final now = DateTime.utc(2026, 3, 10, 5, 0);

  group('planAlarms', () {
    test('open-ended reminders become one repeating alarm per time', () {
      final plan = planAlarms([reminder('r1', ['08:00', '20:00'])], now);
      expect(plan, hasLength(2));
      expect(plan.every((a) => a.date == null), isTrue);
      expect(plan.map((a) => '${a.hour}:${a.minute}'), ['8:0', '20:0']);
      expect(plan.first.body, 'Amoxicillin — 500mg');
    });

    test('inactive reminders and invalid times are ignored', () {
      expect(planAlarms([reminder('r1', ['08:00'], active: false)], now), isEmpty);
      expect(planAlarms([reminder('r1', ['25:99', 'abc'])], now), isEmpty);
    });

    test('reminders with an end date expand into dated one-offs, skipping times already past today', () {
      final plan = planAlarms([reminder('r1', ['08:00', '20:00'], end: '2026-03-12T10:00:00.000Z')], now);
      // Today 08:00 WIB has passed (it is 12:00 WIB); 20:00 today, then 11th and 12th (both times).
      expect(plan.map((a) => '${a.date} ${a.hour}'), ['2026-03-10 20', '2026-03-11 8', '2026-03-11 20', '2026-03-12 8', '2026-03-12 20']);
    });

    test('an ended reminder produces nothing', () {
      expect(planAlarms([reminder('r1', ['08:00'], end: '2026-03-01T00:00:00.000Z')], now), isEmpty);
    });

    test('a future start date defers the first alarm', () {
      final plan = planAlarms([reminder('r1', ['08:00'], start: '2026-03-15T00:00:00.000Z', end: '2026-03-16T10:00:00.000Z')], now);
      expect(plan.first.date, '2026-03-15');
    });

    test('uses the WIB calendar day, not UTC', () {
      // 18:30 UTC on the 10th is already 01:30 WIB on the 11th.
      final late = DateTime.utc(2026, 3, 10, 18, 30);
      final plan = planAlarms([reminder('r1', ['08:00'], end: '2026-03-12T10:00:00.000Z')], late);
      expect(plan.first.date, '2026-03-11');
    });

    test('never exceeds the platform pending-notification budget, keeping daily alarms first', () {
      final many = [
        for (var i = 0; i < 5; i++) reminder('d$i', ['07:00', '12:00', '19:00']), // 15 daily
        for (var i = 0; i < 5; i++) reminder('e$i', ['07:00', '12:00', '19:00'], end: '2026-12-31T00:00:00.000Z'),
      ];
      final plan = planAlarms(many, now);
      expect(plan.length, maxPendingAlarms);
      expect(plan.where((a) => a.date == null), hasLength(15));
      expect(plan.map((a) => a.id).toSet().length, plan.length, reason: 'ids must be unique');
    });

    test('ids are stable across runs and differ per time/date', () {
      expect(stableId('r1', '08:00'), stableId('r1', '08:00'));
      expect(stableId('r1', '08:00'), isNot(stableId('r1', '20:00')));
      expect(stableId('r1', '08:00', '2026-03-10'), isNot(stableId('r1', '08:00', '2026-03-11')));
      expect(stableId('r1', '08:00'), lessThan(0x80000000));
    });
  });

  group('CallMachine', () {
    test('outgoing happy path', () {
      final m = CallMachine();
      expect(m.apply(CallEvent.invite), isTrue);
      expect(m.phase, CallPhase.calling);
      m.apply(CallEvent.accepted);
      expect(m.phase, CallPhase.connecting);
      m.apply(CallEvent.connected);
      expect(m.phase, CallPhase.active);
      m.apply(CallEvent.localEnded);
      expect(m.phase, CallPhase.ended);
      expect(m.endReason, 'ended');
      expect(m.isLive, isFalse);
    });

    test('incoming call: ringing -> accepted -> connected', () {
      final m = CallMachine()..apply(CallEvent.incoming);
      expect(m.phase, CallPhase.ringing);
      m.apply(CallEvent.accepted);
      m.apply(CallEvent.connected);
      expect(m.phase, CallPhase.active);
    });

    test('rejection and timeouts end the call with a reason', () {
      expect((CallMachine()..apply(CallEvent.invite)..apply(CallEvent.rejected)).endReason, 'rejected');
      expect((CallMachine()..apply(CallEvent.invite)..apply(CallEvent.timeout)).endReason, 'timeout');
      expect((CallMachine()..apply(CallEvent.incoming)..apply(CallEvent.timeout)).endReason, 'timeout');
    });

    test('connection failure ends an active call', () {
      final m = CallMachine()..apply(CallEvent.invite)..apply(CallEvent.accepted)..apply(CallEvent.connected)..apply(CallEvent.failed);
      expect(m.phase, CallPhase.ended);
      expect(m.endReason, 'failed');
    });

    test('ended is terminal and impossible transitions are ignored', () {
      final m = CallMachine()..apply(CallEvent.invite)..apply(CallEvent.remoteEnded);
      expect(m.apply(CallEvent.accepted), isFalse);
      expect(m.phase, CallPhase.ended);
      expect(CallMachine().apply(CallEvent.connected), isFalse); // cannot connect from idle
      expect(CallMachine().apply(CallEvent.accepted), isFalse);
    });
  });
}
