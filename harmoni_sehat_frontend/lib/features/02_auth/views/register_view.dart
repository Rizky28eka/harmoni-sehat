import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../app/routes/app_routes.dart';
import '../controllers/auth_controller.dart';

class RegisterView extends GetView<AuthController> {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register'), centerTitle: true),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Buat Akun Baru',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 32),
              Obx(
                () => DropdownButtonFormField<String>(
                  value: controller.selectedRegisterRole.value,
                  decoration: const InputDecoration(
                    labelText: 'Daftar Sebagai',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  items: <String>['pasien', 'dokter', 'farmasi']
                      .map<DropdownMenuItem<String>>((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value.capitalizeFirst!),
                        );
                      })
                      .toList(),
                  onChanged: (String? newValue) {
                    if (newValue != null) {
                      controller.selectedRegisterRole.value = newValue;
                    }
                  },
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.nameController,
                decoration: const InputDecoration(
                  labelText: 'Nama Lengkap',
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: controller.emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              Obx(
                () => TextFormField(
                  controller: controller.passwordController,
                  obscureText: !controller.isPasswordVisible.value,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        controller.isPasswordVisible.value
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                      ),
                      onPressed: controller.togglePasswordVisibility,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Obx(() {
                if (controller.selectedRegisterRole.value == 'pasien') {
                  return Column(
                    children: [
                      TextFormField(
                        controller: controller.nikController,
                        decoration: const InputDecoration(
                          labelText: 'NIK',
                          prefixIcon: Icon(Icons.credit_card),
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.tanggalLahirController,
                        decoration: const InputDecoration(
                          labelText: 'Tanggal Lahir (YYYY-MM-DD)',
                          prefixIcon: Icon(Icons.calendar_today),
                        ),
                        keyboardType: TextInputType.datetime,
                        onTap: () async {
                          FocusScope.of(context).requestFocus(new FocusNode());
                          DateTime? pickedDate = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime(1900),
                            lastDate: DateTime.now(),
                          );
                          if (pickedDate != null) {
                            controller.tanggalLahirController.text = pickedDate
                                .toIso8601String()
                                .split('T')[0];
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: controller.jenisKelaminController.text.isEmpty
                            ? null
                            : controller.jenisKelaminController.text,
                        decoration: const InputDecoration(
                          labelText: 'Jenis Kelamin',
                          prefixIcon: Icon(Icons.people),
                        ),
                        items: <String>['Laki-laki', 'Perempuan']
                            .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value),
                              );
                            })
                            .toList(),
                        onChanged: (String? newValue) {
                          if (newValue != null) {
                            controller.jenisKelaminController.text = newValue;
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.alamatController,
                        decoration: const InputDecoration(
                          labelText: 'Alamat',
                          prefixIcon: Icon(Icons.location_on_outlined),
                        ),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.noTeleponController,
                        decoration: const InputDecoration(
                          labelText: 'Nomor Telepon',
                          prefixIcon: Icon(Icons.phone),
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                    ],
                  );
                } else if (controller.selectedRegisterRole.value == 'dokter') {
                  return Column(
                    children: [
                      TextFormField(
                        controller: controller.nomorStrController,
                        decoration: const InputDecoration(
                          labelText: 'Nomor STR',
                          prefixIcon: Icon(Icons.badge),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.spesialisasiIdController,
                        decoration: const InputDecoration(
                          labelText: 'Spesialisasi ID (Placeholder)',
                          prefixIcon: Icon(Icons.medical_services),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.biayaKonsultasiController,
                        decoration: const InputDecoration(
                          labelText: 'Biaya Konsultasi',
                          prefixIcon: Icon(Icons.attach_money),
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.fotoController,
                        decoration: const InputDecoration(
                          labelText: 'URL Foto (Placeholder)',
                          prefixIcon: Icon(Icons.image),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: controller.bioController,
                        decoration: const InputDecoration(
                          labelText: 'Bio (Placeholder)',
                          prefixIcon: Icon(Icons.description),
                        ),
                        maxLines: 3,
                      ),
                    ],
                  );
                } else if (controller.selectedRegisterRole.value == 'farmasi') {
                  return Column(
                    children: [
                      TextFormField(
                        controller: controller.nomorSipaController,
                        decoration: const InputDecoration(
                          labelText: 'Nomor SIPA',
                          prefixIcon: Icon(Icons.local_pharmacy),
                        ),
                      ),
                    ],
                  );
                }
                return const SizedBox.shrink();
              }),
              const SizedBox(height: 24),
              Obx(
                () => SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: controller.isLoading.value
                        ? null
                        : controller.register,
                    child: controller.isLoading.value
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Daftar', style: TextStyle(fontSize: 16)),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Sudah punya akun?"),
                  TextButton(
                    onPressed: () {
                      Get.toNamed(AppRoutes.login);
                    },
                    child: const Text("Login di sini"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
