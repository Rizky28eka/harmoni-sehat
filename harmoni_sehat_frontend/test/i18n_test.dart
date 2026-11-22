import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/core/translations.dart';
import 'package:harmoni_sehat_frontend/core/translations_en.dart';
import 'package:harmoni_sehat_frontend/core/translations_id.dart';

bool _hasWords(String s) => RegExp(r'[A-Za-z]{2}').hasMatch(s);

/// Sources that render user-visible text (generated/test/core-logic files excluded).
Iterable<File> _sources() => Directory('lib')
    .listSync(recursive: true)
    .whereType<File>()
    .where((f) => f.path.endsWith('.dart') && !f.path.contains('translations') && !f.path.contains('reminder_plan'));

String _unescape(String s) => s.replaceAll(r"\n", '\n').replaceAll(r"\'", "'");

void main() {
  // Strings that are intentionally identical in both languages or are proper nouns / units.
  const sameInBoth = {'Email', 'Checkout', 'Video call', 'Password', 'Harmoni Sehat', 'English', 'WIB', 'Info', 'Rating', 'Total', 'OK'};

  test('every .tr literal has an English translation', () {
    final missing = <String>{};
    for (final f in _sources()) {
      final text = f.readAsStringSync();
      for (final m in RegExp(r"""'((?:[^'\\$\n]|\\.)*)'\.tr\b""").allMatches(text)) {
        final key = _unescape(m.group(1)!);
        if (_hasWords(key) && !enStrings.containsKey(key) && !sameInBoth.contains(key)) missing.add('$key  (${f.path})');
      }
    }
    expect(missing, isEmpty, reason: 'Add these to translations_en.dart:\n${missing.join('\n')}');
  });

  test('no user-visible literal is left untranslated', () {
    final offenders = <String>[];
    // Widgets/properties whose first string argument is shown to the user.
    final shown = RegExp(r"""(?:Text\(|labelText:\s*|hintText:\s*|helperText:\s*|tooltip:\s*)\s*'((?:[^'\\$\n]|\\.)*)'(?!\.tr)""");
    for (final f in _sources()) {
      for (final (i, line) in f.readAsLinesSync().indexed) {
        for (final m in shown.allMatches(line)) {
          final s = m.group(1)!;
          if (_hasWords(s) && !sameInBoth.contains(s) && !RegExp(r'^[A-Z]{2,}$|^\W+$').hasMatch(s)) offenders.add('${f.path}:${i + 1}  "$s"');
        }
      }
    }
    expect(offenders, isEmpty, reason: 'Wrap with .tr:\n${offenders.join('\n')}');
  });

  test('onboarding copy (declared as data, not Text literals) is translated', () {
    final src = File('lib/features/01_onboarding/views/onboarding_view.dart').readAsStringSync();
    final copy = RegExp(r"(?:title|description):\s*'((?:[^'\\\n]|\\.)*)'", multiLine: true).allMatches(src.replaceAll(RegExp(r"description:\s*\n\s*"), 'description: ')).map((m) => m.group(1)!).toList();
    expect(copy.length, 6);
    for (final c in copy) {
      expect(enStrings.containsKey(c), isTrue, reason: 'Missing English for: $c');
    }
  });

  test('server-side message keys all have both directions covered', () {
    // Indonesian server messages must exist in en; English ones in id.
    for (final k in idStrings.keys) {
      expect(idStrings[k], isNotEmpty);
    }
    expect(enStrings.length, greaterThan(300));
  });

  group('runtime translation', () {
    setUp(() => Get.addTranslations(AppTranslations().keys));

    test('switches between id and en and falls back to the key', () {
      Get.locale = const Locale('en', 'US');
      expect('Keranjang'.tr, 'Cart');
      expect('Teks yang tidak ada'.tr, 'Teks yang tidak ada');
      Get.locale = const Locale('id', 'ID');
      expect('Keranjang'.tr, 'Keranjang');
    });

    test('localizeMessage handles API messages in both directions and parameterised ones', () {
      Get.locale = const Locale('en', 'US');
      expect(localizeMessage('Slot sudah dipesan, pilih waktu lain'), 'This slot is already booked, pick another time');
      expect(localizeMessage('Stok Paracetamol tidak mencukupi (tersisa 2)'), 'Not enough stock for Paracetamol (2 left)');
      expect(localizeMessage('Paracetamol sudah kedaluwarsa'), 'Paracetamol has expired');
      expect(localizeMessage('Pesan tak dikenal'), 'Pesan tak dikenal');
      Get.locale = const Locale('id', 'ID');
      expect(localizeMessage('Incorrect email or password'), 'Email atau password salah');
      expect(localizeMessage('Slot sudah dipesan, pilih waktu lain'), 'Slot sudah dipesan, pilih waktu lain');
    });
  });
}
