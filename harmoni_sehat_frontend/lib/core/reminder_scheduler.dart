import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:get/get.dart';
import 'package:timezone/data/latest_all.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

import 'reminder_plan.dart';

/// Schedules on-device alarms for medication reminders, so they ring even when the app is closed
/// or offline. The server list is the source of truth: every sync cancels and re-registers all.
class ReminderScheduler extends GetxService {
  ReminderScheduler([FlutterLocalNotificationsPlugin? plugin]) : _plugin = plugin ?? FlutterLocalNotificationsPlugin();
  final FlutterLocalNotificationsPlugin _plugin;
  bool _ready = false;

  static const _channel = AndroidNotificationDetails(
    'medication_reminders',
    'Pengingat obat',
    channelDescription: 'Alarm untuk waktu minum obat',
    importance: Importance.high,
    priority: Priority.high,
  );

  Future<void> init() async {
    if (_ready || kIsWeb) return;
    tzdata.initializeTimeZones();
    // Reminder times are defined in WIB, independent of the phone's current zone.
    tz.setLocalLocation(tz.getLocation('Asia/Jakarta'));
    await _plugin.initialize(const InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      iOS: DarwinInitializationSettings(requestAlertPermission: false, requestBadgePermission: false, requestSoundPermission: false),
    ));
    _ready = true;
  }

  /// Asks for the notification permission (Android 13+, iOS). Returns whether alarms may be shown.
  Future<bool> requestPermission() async {
    await init();
    final android = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    final ios = _plugin.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>();
    final a = await android?.requestNotificationsPermission();
    final i = await ios?.requestPermissions(alert: true, badge: true, sound: true);
    return (a ?? i ?? true);
  }

  /// Replaces every registered alarm with the plan derived from [reminders]. Returns the count.
  Future<int> sync(List<Map<String, dynamic>> reminders) async {
    if (kIsWeb) return 0;
    await init();
    await _plugin.cancelAll();
    final plan = planAlarms(reminders, DateTime.now());
    for (final a in plan) {
      final when = a.date == null
          ? _nextDaily(a.hour, a.minute)
          : tz.TZDateTime(tz.local, int.parse(a.date!.substring(0, 4)), int.parse(a.date!.substring(5, 7)), int.parse(a.date!.substring(8, 10)), a.hour, a.minute);
      await _plugin.zonedSchedule(
        a.id,
        a.title,
        a.body,
        when,
        const NotificationDetails(android: _channel, iOS: DarwinNotificationDetails(presentAlert: true, presentSound: true)),
        // Inexact alarms avoid the SCHEDULE_EXACT_ALARM permission; delivery is within a few minutes.
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
        matchDateTimeComponents: a.date == null ? DateTimeComponents.time : null,
        payload: a.payload,
      );
    }
    return plan.length;
  }

  Future<void> clear() async {
    if (kIsWeb) return;
    await init();
    await _plugin.cancelAll();
  }

  tz.TZDateTime _nextDaily(int h, int m) {
    final now = tz.TZDateTime.now(tz.local);
    var t = tz.TZDateTime(tz.local, now.year, now.month, now.day, h, m);
    if (!t.isAfter(now)) t = t.add(const Duration(days: 1));
    return t;
  }
}
