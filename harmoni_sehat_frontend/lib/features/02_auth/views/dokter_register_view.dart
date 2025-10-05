import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:harmoni_sehat_frontend/app/theme/app_colors.dart';
import 'package:harmoni_sehat_frontend/features/04_doctor/controllers/dokter_register_controller.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_primary_button.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_text_form_field.dart';

class DokterRegisterView extends GetView<DokterRegisterController> {
  const DokterRegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: Text(
          'Lengkapi Profil Dokter',
          style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Satu langkah lagi untuk menyelesaikan akun Anda.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 32),
                CustomTextFormField(
                  controller: controller.nameController,
                  labelText: 'Nama Lengkap',
                  prefixIcon: Icons.person_outline,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.nomorStrController,
                  labelText: 'Nomor STR',
                  prefixIcon: Icons.medical_services_outlined,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.biayaKonsultasiController,
                  labelText: 'Biaya Konsultasi',
                  prefixIcon: Icons.attach_money_outlined,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.spesialisasiIdController,
                  labelText: 'ID Spesialisasi (Opsional)',
                  prefixIcon: Icons.medical_information_outlined,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.fotoController,
                  labelText: 'URL Foto (Opsional)',
                  prefixIcon: Icons.image_outlined,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.bioController,
                  labelText: 'Biografi (Opsional)',
                  prefixIcon: Icons.description_outlined,
                  maxLines: 3,
                ),
                const SizedBox(height: 32),
                Obx(
                  () => CustomPrimaryButton(
                    onPressed: controller.registerDokter,
                    isLoading: controller.isLoading.value,
                    child: const Text('Selesai & Simpan Profil'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}