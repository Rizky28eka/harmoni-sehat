import 'package:flutter/material.dart';

/// Soft pastel "tones" used to colour-code features (appointments, pharmacy, records, AI…).
/// Light mode: pastel fill + saturated ink. Dark mode: a translucent wash of the ink on the surface.
enum Tone { peach, mint, sky, lilac, rose, butter, slate }

class ToneColors {
  const ToneColors({required this.bg, required this.ink, required this.deco});
  final Color bg; // card fill
  final Color ink; // text/icon colour on the fill
  final Color deco; // decorative blobs
}

const _light = {
  Tone.peach: ToneColors(bg: Color(0xFFFFEFD9), ink: Color(0xFF9A4A0B), deco: Color(0xFFFFD9A8)),
  Tone.mint: ToneColors(bg: Color(0xFFDDF4E8), ink: Color(0xFF046C4E), deco: Color(0xFFB7E8D0)),
  Tone.sky: ToneColors(bg: Color(0xFFE0EDFF), ink: Color(0xFF1E4FC2), deco: Color(0xFFBFD7FF)),
  Tone.lilac: ToneColors(bg: Color(0xFFEBE6FF), ink: Color(0xFF5B2FC9), deco: Color(0xFFD3C8FF)),
  Tone.rose: ToneColors(bg: Color(0xFFFFE3E3), ink: Color(0xFFB4233E), deco: Color(0xFFFFC4C4)),
  Tone.butter: ToneColors(bg: Color(0xFFFFF4C9), ink: Color(0xFF8A5A06), deco: Color(0xFFFFE58F)),
  Tone.slate: ToneColors(bg: Color(0xFFEEF1F5), ink: Color(0xFF334155), deco: Color(0xFFDDE3EA)),
};

const _darkInk = {
  Tone.peach: Color(0xFFFFB866),
  Tone.mint: Color(0xFF5FD3A3),
  Tone.sky: Color(0xFF7FB0FF),
  Tone.lilac: Color(0xFFB39CFF),
  Tone.rose: Color(0xFFFF8FA3),
  Tone.butter: Color(0xFFFFD863),
  Tone.slate: Color(0xFFB6C2D2),
};

ToneColors toneOf(BuildContext context, Tone tone) {
  if (Theme.of(context).brightness == Brightness.light) return _light[tone]!;
  final ink = _darkInk[tone]!;
  return ToneColors(bg: Color.alphaBlend(ink.withValues(alpha: 0.14), const Color(0xFF151D1A)), ink: ink, deco: ink.withValues(alpha: 0.12));
}
