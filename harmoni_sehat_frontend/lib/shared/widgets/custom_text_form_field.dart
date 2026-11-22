import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';

class CustomTextFormField extends StatelessWidget {
  final TextEditingController controller;
  final String labelText;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final void Function()? onTap;
  final bool readOnly;
  final int maxLines;

  const CustomTextFormField({
    super.key,
    required this.controller,
    required this.labelText,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.keyboardType,
    this.validator,
    this.onTap,
    this.readOnly = false,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      textInputAction: maxLines > 1 ? TextInputAction.newline : TextInputAction.next,
      validator: validator,
      onTap: onTap,
      readOnly: readOnly,
      maxLines: obscureText ? 1 : maxLines,
      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
      // Fill, radius and focus colours come from the app-wide InputDecorationTheme.
      decoration: InputDecoration(
        labelText: labelText,
        prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: AppColors.textMuted, size: 22) : null,
        suffixIcon: suffixIcon,
      ),
    );
  }
}
