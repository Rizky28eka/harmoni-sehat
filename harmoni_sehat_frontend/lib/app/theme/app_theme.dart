import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// "Soft" design system: airy white canvas, pastel tinted cards, large friendly type, pill controls.
class AppTheme {
  static const _lightBg = Color(0xFFFBFBFD);
  static const _lightField = Color(0xFFF3F5F8);
  static const _lightLine = Color(0xFFECEFF3);
  static const _darkBg = Color(0xFF0D1311);
  static const _darkSurface = Color(0xFF151D1A);
  static const _darkField = Color(0xFF1C2622);
  static const _darkLine = Color(0xFF26332E);

  static TextTheme _text(Brightness b) {
    final base = b == Brightness.light ? ThemeData.light().textTheme : ThemeData.dark().textTheme;
    final ink = b == Brightness.light ? AppColors.textPrimary : const Color(0xFFEAF2EE);
    return GoogleFonts.plusJakartaSansTextTheme(base).apply(bodyColor: ink, displayColor: ink);
  }

  static ThemeData _build(Brightness b) {
    final light = b == Brightness.light;
    final bg = light ? _lightBg : _darkBg;
    final surface = light ? Colors.white : _darkSurface;
    final field = light ? _lightField : _darkField;
    final line = light ? _lightLine : _darkLine;
    final ink = light ? AppColors.textPrimary : const Color(0xFFEAF2EE);
    final text = _text(b);

    final scheme = ColorScheme.fromSeed(seedColor: AppColors.primaryColor, brightness: b).copyWith(
      primary: AppColors.primaryColor,
      onPrimary: Colors.white,
      secondary: AppColors.secondaryColor,
      error: AppColors.errorColor,
      surface: surface,
      onSurface: ink,
      surfaceContainerHighest: field,
      outline: line,
      outlineVariant: line,
    );

    final stadium = RoundedRectangleBorder(borderRadius: BorderRadius.circular(28));
    const btnPad = EdgeInsets.symmetric(vertical: 16, horizontal: 24);
    final btnText = text.labelLarge!.copyWith(fontSize: 15, fontWeight: FontWeight.w700, letterSpacing: 0.1);

    return ThemeData(
      useMaterial3: true,
      brightness: b,
      colorScheme: scheme,
      scaffoldBackgroundColor: bg,
      primaryColor: AppColors.primaryColor,
      visualDensity: VisualDensity.adaptivePlatformDensity,
      textTheme: text,
      splashFactory: InkRipple.splashFactory,
      dividerTheme: DividerThemeData(color: line, thickness: 1, space: 1),
      appBarTheme: AppBarTheme(
        backgroundColor: bg,
        foregroundColor: ink,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        titleSpacing: 20,
        titleTextStyle: text.titleLarge!.copyWith(fontSize: 22, fontWeight: FontWeight.w700, letterSpacing: -0.4, color: ink),
        iconTheme: IconThemeData(color: ink),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: BorderSide(color: line)),
      ),
      listTileTheme: ListTileThemeData(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)), iconColor: ink),
      elevatedButtonTheme: ElevatedButtonThemeData(style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryColor, foregroundColor: Colors.white, elevation: 0, shape: stadium, padding: btnPad, textStyle: btnText)),
      filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(backgroundColor: AppColors.primaryColor, foregroundColor: Colors.white, elevation: 0, shape: stadium, padding: btnPad, textStyle: btnText)),
      outlinedButtonTheme: OutlinedButtonThemeData(style: OutlinedButton.styleFrom(foregroundColor: ink, side: BorderSide(color: line, width: 1.5), shape: stadium, padding: btnPad, textStyle: btnText)),
      textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(foregroundColor: AppColors.primaryColor, shape: stadium, textStyle: btnText.copyWith(fontSize: 14))),
      iconButtonTheme: IconButtonThemeData(style: IconButton.styleFrom(foregroundColor: ink)),
      floatingActionButtonTheme: FloatingActionButtonThemeData(backgroundColor: AppColors.primaryColor, foregroundColor: Colors.white, elevation: 4, shape: stadium),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: field,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        hintStyle: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w500),
        labelStyle: TextStyle(color: light ? AppColors.textSecondary : const Color(0xFF9DB0A8), fontWeight: FontWeight.w500),
        floatingLabelStyle: const TextStyle(color: AppColors.primaryColor, fontWeight: FontWeight.w600),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: const BorderSide(color: AppColors.primaryColor, width: 1.6)),
        errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: const BorderSide(color: AppColors.errorColor, width: 1.2)),
        focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: const BorderSide(color: AppColors.errorColor, width: 1.6)),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: field,
        selectedColor: AppColors.primaryColor.withValues(alpha: light ? 0.14 : 0.28),
        side: BorderSide.none,
        shape: const StadiumBorder(),
        labelStyle: text.labelLarge!.copyWith(fontWeight: FontWeight.w600, color: ink),
        secondaryLabelStyle: text.labelLarge!.copyWith(fontWeight: FontWeight.w700, color: AppColors.primaryColor),
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        showCheckmark: false,
      ),
      segmentedButtonTheme: SegmentedButtonThemeData(
        style: ButtonStyle(
          shape: WidgetStatePropertyAll(const StadiumBorder()),
          side: WidgetStatePropertyAll(BorderSide.none),
          backgroundColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? AppColors.primaryColor : field),
          foregroundColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? Colors.white : ink),
          textStyle: WidgetStatePropertyAll(text.labelLarge!.copyWith(fontWeight: FontWeight.w700)),
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? Colors.white : (light ? Colors.white : const Color(0xFFB6C2BD))),
        trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? AppColors.primaryColor : (light ? const Color(0xFFD5DAE0) : const Color(0xFF33413B))),
        trackOutlineColor: const WidgetStatePropertyAll(Colors.transparent),
      ),
      snackBarTheme: SnackBarThemeData(behavior: SnackBarBehavior.floating, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)), backgroundColor: ink, contentTextStyle: TextStyle(color: light ? Colors.white : _darkBg)),
      dialogTheme: DialogThemeData(backgroundColor: surface, surfaceTintColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)), titleTextStyle: text.titleLarge!.copyWith(fontWeight: FontWeight.w700, color: ink)),
      bottomSheetTheme: BottomSheetThemeData(backgroundColor: surface, surfaceTintColor: Colors.transparent, shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28)))),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: AppColors.primaryColor),
      badgeTheme: const BadgeThemeData(backgroundColor: AppColors.accentRose, textColor: Colors.white),
      popupMenuTheme: PopupMenuThemeData(color: surface, surfaceTintColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18))),
    );
  }

  static final ThemeData lightTheme = _build(Brightness.light);
  static final ThemeData darkTheme = _build(Brightness.dark);
}
