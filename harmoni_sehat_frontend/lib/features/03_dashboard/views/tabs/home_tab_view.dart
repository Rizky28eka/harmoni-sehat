import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:harmoni_sehat_frontend/app/theme/app_colors.dart';

class HomeTabView extends StatelessWidget {
  const HomeTabView({super.key});

  @override
  Widget build(BuildContext context) {
    // A more realistic user name would be fetched from storage/API
    final userName = 'Pengguna';

    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Selamat Datang,',
              style: GoogleFonts.montserrat(
                fontSize: 16,
                color: AppColors.textSecondary,
              ),
            ),
            Text(
              userName,
              style: GoogleFonts.montserrat(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              backgroundColor: AppColors.primaryColor.withAlpha((255 * 0.2).round()),
              child: IconButton(
                icon: const Icon(Icons.notifications_none_outlined, color: AppColors.primaryColor),
                onPressed: () {
                  // TODO: Implement notification view
                },
              ),
            ),
          ),
        ],
      ),
      body: const Center(
        child: Text('Konten Beranda Pasien di sini'),
      ),
    );
  }
}
