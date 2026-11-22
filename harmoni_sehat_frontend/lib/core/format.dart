import 'package:intl/intl.dart';

final _rupiah = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

String rupiah(num? v) => _rupiah.format(v ?? 0);

DateTime? parseDate(dynamic v) => v == null ? null : DateTime.tryParse(v.toString())?.toLocal();

String fmtDate(dynamic v) {
  final d = parseDate(v);
  return d == null ? '-' : DateFormat('d MMM yyyy', 'id_ID').format(d);
}

String fmtDateTime(dynamic v) {
  final d = parseDate(v);
  return d == null ? '-' : DateFormat('EEE, d MMM yyyy • HH:mm', 'id_ID').format(d);
}

String fmtTime(dynamic v) {
  final d = parseDate(v);
  return d == null ? '-' : DateFormat('HH:mm').format(d);
}

/// Safe nested map access for decoded JSON.
extension JsonX on Map<String, dynamic> {
  String s(String k, [String fallback = '']) => this[k]?.toString() ?? fallback;
  num n(String k, [num fallback = 0]) => this[k] is num ? this[k] as num : num.tryParse('${this[k]}') ?? fallback;
  Map<String, dynamic> m(String k) => this[k] is Map ? Map<String, dynamic>.from(this[k] as Map) : <String, dynamic>{};
  List<Map<String, dynamic>> l(String k) =>
      this[k] is List ? (this[k] as List).whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList() : <Map<String, dynamic>>[];
}

List<Map<String, dynamic>> asList(dynamic v) =>
    v is List ? v.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList() : <Map<String, dynamic>>[];

Map<String, dynamic> asMap(dynamic v) => v is Map ? Map<String, dynamic>.from(v) : <String, dynamic>{};
