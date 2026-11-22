import 'package:get/get.dart';

import 'translations_en.dart';
import 'translations_id.dart';

/// id (source language, used as the key) → en. Anything missing falls back to the key itself.
class AppTranslations extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {'en_US': enStrings, 'id_ID': idStrings};
}

/// Server messages that embed values (names, counts). Each pattern maps to an English template.
final List<(RegExp, String Function(Match))> _dynamicEn = [
  (RegExp(r'^Stok (.+) tidak mencukupi \(tersisa (\d+)\)$'), (m) => 'Not enough stock for ${m[1]} (${m[2]} left)'),
  (RegExp(r'^Stok (.+) tidak mencukupi$'), (m) => 'Not enough stock for ${m[1]}'),
  (RegExp(r'^(.+) sudah kedaluwarsa$'), (m) => '${m[1]} has expired'),
  (RegExp(r'^(.+) memerlukan resep dokter yang sesuai$'), (m) => '${m[1]} requires a matching doctor prescription'),
  (RegExp(r'^Duplicate value for (.+)$'), (m) => 'Duplicate value for ${m[1]}'),
  (RegExp(r'^Refund ditolak gateway \((\d+)\): (.+)$'), (m) => 'Refund rejected by gateway (${m[1]}): ${m[2]}'),
];

/// Translates a message coming from the API (or an exception) into the active language.
String localizeMessage(String message) {
  if (Get.locale?.languageCode != 'en') return idStrings[message] ?? message;
  final direct = enStrings[message];
  if (direct != null) return direct;
  for (final (re, build) in _dynamicEn) {
    final m = re.firstMatch(message);
    if (m != null) return build(m);
  }
  return message;
}
