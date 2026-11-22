import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../../app/theme/app_colors.dart';
import '../../app/theme/pastel.dart';
import '../../core/api_client.dart';

/// Organic background shapes drawn inside a [SoftCard] (the "blob" look).
class BlobPainter extends CustomPainter {
  const BlobPainter(this.color, {this.variant = 0});
  final Color color;
  final int variant;

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color;
    switch (variant % 3) {
      case 0:
        canvas.drawCircle(Offset(size.width * 0.92, size.height * 0.1), size.shortestSide * 0.62, p);
        canvas.drawCircle(Offset(size.width * 0.78, size.height * 1.05), size.shortestSide * 0.4, p);
      case 1:
        final path = Path()
          ..moveTo(size.width * 0.45, size.height)
          ..quadraticBezierTo(size.width * 0.62, size.height * 0.45, size.width, size.height * 0.5)
          ..lineTo(size.width, size.height)
          ..close();
        canvas.drawPath(path, p);
        canvas.drawCircle(Offset(size.width * 0.05, size.height * 0.05), size.shortestSide * 0.35, p);
      default:
        canvas.drawCircle(Offset(size.width * 0.1, size.height * 0.95), size.shortestSide * 0.55, p);
        canvas.drawCircle(Offset(size.width * 0.95, size.height * 0.2), size.shortestSide * 0.3, p);
    }
  }

  @override
  bool shouldRepaint(BlobPainter old) => old.color != color || old.variant != variant;
}

/// Rounded tinted card. With a [tone] it is a pastel fill with soft blobs; without one it is a white card
/// with a hairline border.
class SoftCard extends StatelessWidget {
  const SoftCard({super.key, this.tone, this.child, this.padding = const EdgeInsets.all(18), this.onTap, this.radius = 26, this.blobs = true, this.variant = 0, this.margin, this.minHeight});
  final Tone? tone;
  final Widget? child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final double radius;
  final bool blobs;
  final int variant;
  final EdgeInsetsGeometry? margin;
  final double? minHeight;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final tc = tone == null ? null : toneOf(context, tone!);
    final shape = BorderRadius.circular(radius);
    return Container(
      margin: margin,
      constraints: minHeight == null ? null : BoxConstraints(minHeight: minHeight!),
      decoration: BoxDecoration(color: tc?.bg ?? scheme.surface, borderRadius: shape, border: tc == null ? Border.all(color: scheme.outline) : null),
      child: Material(
        color: Colors.transparent,
        borderRadius: shape,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Stack(children: [
            if (tc != null && blobs) Positioned.fill(child: CustomPaint(painter: BlobPainter(tc.deco.withValues(alpha: 0.55), variant: variant))),
            Padding(padding: padding, child: child),
          ]),
        ),
      ),
    );
  }
}

/// Icon on a soft rounded square.
class ToneIcon extends StatelessWidget {
  const ToneIcon(this.icon, {super.key, this.tone = Tone.mint, this.size = 46, this.round = false, this.iconSize});
  final IconData icon;
  final Tone tone;
  final double size;
  final bool round;
  final double? iconSize;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, tone);
    // Purely decorative: the adjacent text carries the meaning.
    return ExcludeSemantics(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(round ? size : size * 0.36)),
        child: Icon(icon, color: c.ink, size: iconSize ?? size * 0.5),
      ),
    );
  }
}

/// Small rounded label.
class Pill extends StatelessWidget {
  const Pill(this.label, {super.key, this.tone = Tone.slate, this.icon, this.dense = false});
  final String label;
  final Tone tone;
  final IconData? icon;
  final bool dense;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, tone);
    return Container(
      padding: EdgeInsets.symmetric(horizontal: dense ? 9 : 12, vertical: dense ? 4 : 6),
      decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (icon != null) ...[Icon(icon, size: 13, color: c.ink), const SizedBox(width: 4)],
        Flexible(child: Text(label, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.ink, fontSize: dense ? 11 : 12, fontWeight: FontWeight.w700))),
      ]),
    );
  }
}

/// Large friendly page heading ("Good afternoon, Alan").
class BigGreeting extends StatelessWidget {
  const BigGreeting({super.key, required this.lead, required this.title, this.trailing, this.padding = const EdgeInsets.fromLTRB(22, 8, 16, 6)});
  final String lead;
  final String title;
  final Widget? trailing;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Padding(
      padding: padding,
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(lead, style: t.titleMedium?.copyWith(color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
            const SizedBox(height: 2),
            Text(title, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.headlineMedium?.copyWith(fontWeight: FontWeight.w700, letterSpacing: -0.8, height: 1.1)),
          ]),
        ),
        if (trailing != null) trailing!,
      ]),
    );
  }
}

/// Horizontal 7-day strip. Days with something planned get a dot.
class WeekStrip extends StatelessWidget {
  const WeekStrip({super.key, required this.selected, required this.onSelect, this.marked = const {}, this.days = 7});
  final DateTime selected;
  final ValueChanged<DateTime> onSelect;
  final Set<DateTime> marked; // date-only values
  final int days;

  static DateTime dayOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final today = dayOnly(DateTime.now());
    final start = today.subtract(Duration(days: today.weekday % 7)); // week starts Sunday, like the reference
    final lang = Get.locale?.languageCode == 'en' ? 'en_US' : 'id_ID';
    return Row(children: [
      for (var i = 0; i < days; i++)
        Expanded(
          child: Builder(builder: (_) {
            final d = start.add(Duration(days: i));
            final sel = dayOnly(selected) == d;
            final isToday = d == today;
            return Semantics(
              button: true,
              selected: sel,
              label: DateFormat('EEEE, d MMMM', lang).format(d) + (marked.contains(d) ? ', ${'ada jadwal'.tr}' : ''),
              excludeSemantics: true,
              child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onSelect(d),
              child: Column(children: [
                Text(DateFormat('E', lang).format(d).substring(0, 1).toUpperCase(), style: TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  width: 40,
                  height: 40,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: sel ? AppColors.primaryColor : (isToday ? AppColors.primaryColor.withValues(alpha: 0.12) : Colors.transparent)),
                  child: Text('${d.day}', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: sel ? Colors.white : (isToday ? AppColors.primaryColor : scheme.onSurface))),
                ),
                const SizedBox(height: 5),
                Container(width: 5, height: 5, decoration: BoxDecoration(shape: BoxShape.circle, color: marked.contains(d) ? AppColors.accentRose : Colors.transparent)),
              ]),
            ));
          }),
        ),
    ]);
  }
}

class NavItem {
  const NavItem(this.icon, this.selectedIcon, this.label, {this.badge = 0});
  final int badge;
  final IconData icon;
  final IconData selectedIcon;
  final String label;
}

/// Floating pill navigation bar with an optional raised centre action.
class FloatingNavBar extends StatelessWidget {
  const FloatingNavBar({super.key, required this.items, required this.index, required this.onChanged, this.centerIcon, this.onCenter, this.centerTooltip});
  final List<NavItem> items;
  final int index;
  final ValueChanged<int> onChanged;
  final IconData? centerIcon;
  final VoidCallback? onCenter;
  final String? centerTooltip;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final dark = Theme.of(context).brightness == Brightness.dark;
    final hasCenter = centerIcon != null;
    final half = hasCenter ? items.length ~/ 2 : items.length;

    Widget tab(int i) {
      final it = items[i];
      final sel = i == index;
      return Expanded(
        child: Semantics(
          button: true,
          selected: sel,
          label: it.badge > 0 ? '${it.label}, ${it.badge}' : it.label,
          excludeSemantics: true,
          child: InkResponse(
          onTap: () => onChanged(i),
          radius: 36,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                decoration: BoxDecoration(color: sel ? AppColors.primaryColor.withValues(alpha: dark ? 0.28 : 0.13) : Colors.transparent, borderRadius: BorderRadius.circular(16)),
                child: Badge(isLabelVisible: it.badge > 0, label: Text('${it.badge}'), child: Icon(sel ? it.selectedIcon : it.icon, size: 24, color: sel ? AppColors.primaryColor : AppColors.textMuted)),
              ),
              const SizedBox(height: 2),
              Text(it.label, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 11, fontWeight: sel ? FontWeight.w700 : FontWeight.w500, color: sel ? AppColors.primaryColor : AppColors.textMuted)),
            ]),
          ),
        )),
      );
    }

    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: Stack(clipBehavior: Clip.none, alignment: Alignment.topCenter, children: [
          Container(
            margin: EdgeInsets.only(top: hasCenter ? 26 : 0),
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: scheme.outline),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: dark ? 0.35 : 0.07), blurRadius: 24, offset: const Offset(0, 8))],
            ),
            child: Row(children: [
              for (var i = 0; i < half; i++) tab(i),
              if (hasCenter) const SizedBox(width: 72),
              if (hasCenter) for (var i = half; i < items.length; i++) tab(i),
            ]),
          ),
          if (hasCenter)
            Positioned(
              top: 0,
              child: Semantics(
                button: true,
                label: centerTooltip,
                child: GestureDetector(
                  onTap: onCenter,
                  child: Container(
                    width: 62,
                    height: 62,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(colors: [Color(0xFF14B885), AppColors.primaryColor], begin: Alignment.topLeft, end: Alignment.bottomRight),
                      border: Border.all(color: scheme.surface, width: 5),
                      boxShadow: [BoxShadow(color: AppColors.primaryColor.withValues(alpha: 0.4), blurRadius: 16, offset: const Offset(0, 6))],
                    ),
                    child: Icon(centerIcon, color: Colors.white, size: 28),
                  ),
                ),
              ),
            ),
        ]),
      ),
    );
  }
}

/// Shimmering placeholder block.
class Skeleton extends StatefulWidget {
  const Skeleton({super.key, this.height = 16, this.width, this.radius = 14});
  final double height;
  final double? width;
  final double radius;

  @override
  State<Skeleton> createState() => _SkeletonState();
}

class _SkeletonState extends State<Skeleton> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1300))..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final base = dark ? const Color(0xFF1C2622) : const Color(0xFFEEF1F5);
    final hi = dark ? const Color(0xFF26332E) : const Color(0xFFF8FAFC);
    return AnimatedBuilder(
      animation: _c,
      builder: (_, __) => Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(widget.radius),
          gradient: LinearGradient(begin: Alignment(-1 + 2 * _c.value - 1, 0), end: Alignment(1 + 2 * _c.value - 1, 0), colors: [base, hi, base], stops: const [0.25, 0.5, 0.75]),
        ),
      ),
    );
  }
}

/// A list-shaped loading placeholder.
class SkeletonList extends StatelessWidget {
  const SkeletonList({super.key, this.count = 4, this.itemHeight = 92});
  final int count;
  final double itemHeight;

  @override
  Widget build(BuildContext context) => ListView.separated(
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
        itemCount: count,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) => Skeleton(height: itemHeight, radius: 24),
      );
}

/// Soft section heading with an optional trailing action.
class SectionHeading extends StatelessWidget {
  const SectionHeading(this.text, {super.key, this.action, this.onAction, this.padding = const EdgeInsets.fromLTRB(22, 22, 22, 10)});
  final String text;
  final String? action;
  final VoidCallback? onAction;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) => Padding(
        padding: padding,
        child: Row(children: [
          Expanded(child: Text(text, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700, letterSpacing: -0.4))),
          if (action != null) GestureDetector(onTap: onAction, child: Text(action!, style: const TextStyle(color: AppColors.primaryColor, fontWeight: FontWeight.w700, fontSize: 13))),
        ]),
      );
}

/// Gentle circular gradient behind big hero icons.
class GlowAvatar extends StatelessWidget {
  const GlowAvatar({super.key, required this.child, this.size = 80, this.tone = Tone.mint});
  final Widget child;
  final double size;
  final Tone tone;

  @override
  Widget build(BuildContext context) {
    final c = toneOf(context, tone);
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(shape: BoxShape.circle, gradient: LinearGradient(colors: [c.deco, c.bg], begin: Alignment.topLeft, end: Alignment.bottomRight)),
      child: Center(child: child),
    );
  }
}

double ease(double t) => 1 - math.pow(1 - t, 3).toDouble();

/// Slim banner shown while the API is unreachable; the data below may come from the offline cache.
class OfflineBanner extends StatelessWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context) {
    if (!Get.isRegistered<ApiClient>()) return const SizedBox.shrink();
    final api = Get.find<ApiClient>();
    final c = toneOf(context, Tone.butter);
    return Obx(() => AnimatedSize(
          duration: const Duration(milliseconds: 200),
          child: api.offline.value
              ? Container(
                  width: double.infinity,
                  color: c.bg,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: SafeArea(
                    bottom: false,
                    child: Row(children: [
                      Icon(Icons.cloud_off_rounded, size: 16, color: c.ink),
                      const SizedBox(width: 8),
                      Expanded(child: Text('Anda sedang offline. Data mungkin tidak terbaru.'.tr, style: TextStyle(color: c.ink, fontSize: 12.5, fontWeight: FontWeight.w700))),
                    ]),
                  ),
                )
              : const SizedBox(width: double.infinity),
        ));
  }
}

/// Grid cell height that grows with the user's text size (fixed aspect ratios clip large text).
double scaledExtent(BuildContext context, double base) => base * MediaQuery.textScalerOf(context).scale(1).clamp(1.0, 2.0);

SliverGridDelegate twoColumnGrid(BuildContext context, double baseHeight) => SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, mainAxisExtent: scaledExtent(context, baseHeight));
