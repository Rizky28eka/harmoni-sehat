import 'dart:io';

import 'package:integration_test/integration_test_driver_extended.dart';

/// Saves every screenshot taken by `integration_test/screenshots_test.dart` into `docs/screenshots/`.
Future<void> main() async {
  await integrationDriver(
    onScreenshot: (String name, List<int> bytes, [Map<String, Object?>? args]) async {
      final File file = File('docs/screenshots/$name.png');
      await file.create(recursive: true);
      await file.writeAsBytes(bytes);
      return true;
    },
  );
}
