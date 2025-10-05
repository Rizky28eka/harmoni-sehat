import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:harmoni_sehat_frontend/app/theme/app_colors.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_primary_button.dart';
import 'package:harmoni_sehat_frontend/shared/widgets/custom_text_form_field.dart';
import '../controllers/pasien_register_controller.dart';

class PasienRegisterView extends GetView<PasienRegisterController> {
  const PasienRegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: Text(
          'Lengkapi Profil Pasien',
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
                  controller: controller.nikController,
                  labelText: 'NIK',
                  prefixIcon: Icons.credit_card_outlined,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.tanggalLahirController,
                  labelText: 'Tanggal Lahir',
                  prefixIcon: Icons.calendar_today_outlined,
                  readOnly: true,
                  onTap: () => controller.selectDate(context),
                ),
                const SizedBox(height: 16),
                Obx(
                  () => DropdownButtonFormField<String>(
                    value: controller.jenisKelamin.value,
                    decoration: InputDecoration(
                      labelText: 'Jenis Kelamin',
                      prefixIcon: const Icon(Icons.wc_outlined, color: AppColors.textSecondary),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.borderColor),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.borderColor),
                      ),
                    ),
                    items: <String>['Laki-laki', 'Perempuan']
                        .map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        controller.jenisKelamin.value = newValue;
                      }
                    },
                  ),
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.alamatController,
                  labelText: 'Alamat',
                  prefixIcon: Icons.location_on_outlined,
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                CustomTextFormField(
                  controller: controller.noTeleponController,
                  labelText: 'Nomor Telepon',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 32),
                Obx(
                  () => CustomPrimaryButton(
                    onPressed: controller.registerPasien,
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
