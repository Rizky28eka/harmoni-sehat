/// Pure scheduling logic for medication reminders (no platform calls, fully unit-testable).
///
/// Reminder times are expressed in WIB (UTC+7), the same zone the server uses.
class PlannedAlarm {
  const PlannedAlarm({required this.id, required this.title, required this.body, required this.hour, required this.minute, this.date, this.payload});

  /// Stable 31-bit id so rescheduling replaces rather than duplicates.
  final int id;
  final String title;
  final String body;
  final int hour;
  final int minute;

  /// `null` = repeat every day at hour:minute (open-ended reminder).
  /// Otherwise a one-off alarm on this WIB calendar date (yyyy-MM-dd).
  final String? date;
  final String? payload;

  @override
  String toString() => 'PlannedAlarm($id ${date ?? 'daily'} $hour:$minute)';
}

/// iOS keeps at most 64 pending local notifications; stay below it.
const int maxPendingAlarms = 60;

int stableId(String reminderId, String time, [String? date]) {
  // FNV-1a, folded to a positive 31-bit int.
  var h = 0x811c9dc5;
  for (final c in '$reminderId|$time|${date ?? ''}'.codeUnits) {
    h ^= c;
    h = (h * 0x01000193) & 0xffffffff;
  }
  return h & 0x7fffffff;
}

String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

/// Builds the alarms to register for [reminders] (server JSON) at instant [now].
///
/// * Open-ended reminders become one daily-repeating alarm per time (cheap: 1 slot each).
/// * Reminders with an end date become one-off alarms for each remaining day, nearest first,
///   until [maxPendingAlarms] is reached.
/// * Inactive reminders and past end dates produce nothing.
List<PlannedAlarm> planAlarms(List<Map<String, dynamic>> reminders, DateTime now, {int horizonDays = 30}) {
  final wibNow = now.toUtc().add(const Duration(hours: 7));
  final today = DateTime.utc(wibNow.year, wibNow.month, wibNow.day);
  final nowMinutes = wibNow.hour * 60 + wibNow.minute;

  final daily = <PlannedAlarm>[];
  final dated = <(DateTime, PlannedAlarm)>[];

  for (final r in reminders) {
    if (r['is_active'] != true) continue;
    final id = r['_id'].toString();
    final name = (r['nama_obat'] ?? '').toString();
    final dose = (r['dosis'] ?? '').toString();
    final body = dose.isEmpty ? name : '$name — $dose';
    final times = (r['jam'] as List? ?? []).map((e) => e.toString()).where((t) => RegExp(r'^([01]\d|2[0-3]):[0-5]\d$').hasMatch(t));

    final startRaw = DateTime.tryParse('${r['tanggal_mulai'] ?? ''}')?.toUtc().add(const Duration(hours: 7));
    final endRaw = DateTime.tryParse('${r['tanggal_selesai'] ?? ''}')?.toUtc().add(const Duration(hours: 7));
    final start = startRaw == null ? today : DateTime.utc(startRaw.year, startRaw.month, startRaw.day);
    final end = endRaw == null ? null : DateTime.utc(endRaw.year, endRaw.month, endRaw.day);
    if (end != null && end.isBefore(today)) continue;

    for (final t in times) {
      final h = int.parse(t.substring(0, 2));
      final m = int.parse(t.substring(3));
      if (end == null && !start.isAfter(today)) {
        daily.add(PlannedAlarm(id: stableId(id, t), title: 'Waktunya minum obat', body: body, hour: h, minute: m, payload: id));
        continue;
      }
      final first = start.isAfter(today) ? start : today;
      for (var i = 0; i <= horizonDays; i++) {
        final day = first.add(Duration(days: i));
        if (end != null && day.isAfter(end)) break;
        if (day == today && h * 60 + m <= nowMinutes) continue; // already passed today
        final date = _ymd(day);
        dated.add((day.add(Duration(hours: h, minutes: m)), PlannedAlarm(id: stableId(id, t, date), title: 'Waktunya minum obat', body: body, hour: h, minute: m, date: date, payload: id)));
      }
    }
  }

  dated.sort((a, b) => a.$1.compareTo(b.$1));
  final room = (maxPendingAlarms - daily.length).clamp(0, maxPendingAlarms);
  return [...daily.take(maxPendingAlarms), ...dated.take(room).map((e) => e.$2)];
}
