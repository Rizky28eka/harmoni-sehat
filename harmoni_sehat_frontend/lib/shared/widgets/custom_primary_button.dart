import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';

class CustomPrimaryButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Widget child;
  final bool isLoading;

  const CustomPrimaryButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryColor,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.primaryColor.withValues(alpha: 0.6),
          disabledForegroundColor: Colors.white,
          elevation: 0,
          shadowColor: AppColors.primaryColor.withValues(alpha: 0.4),
          shape: const StadiumBorder(),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.1),
        ),
        child: isLoading ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5)) : child,
      ),
    );
  }
}
