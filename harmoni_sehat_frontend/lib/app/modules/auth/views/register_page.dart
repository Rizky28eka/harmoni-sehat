import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/auth/controllers/auth_controller.dart';

class RegisterPage extends GetView<AuthController> {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Get.back(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Create Your Account',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Create your personal account now to access all the exclusive benefits we have to offer.',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            _buildRoleSelector(),
            const SizedBox(height: 32),
            Obx(() => _buildFormForRole(controller.selectedRole.value)),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: controller.register,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                backgroundColor: const Color(0xFF1c8086),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Register',
                style: TextStyle(color: Colors.white),
              ),
            ),
            const SizedBox(height: 24),
            _buildDivider(),
            const SizedBox(height: 24),
            _buildSocialButtons(),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("Already have an account?"),
                TextButton(
                  onPressed: () => Get.back(),
                  child: const Text(
                    'Login',
                    style: TextStyle(color: Color(0xFF1c8086)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleSelector() {
    return Obx(
      () => Container(
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            _buildRoleButton('Pasien'),
            _buildRoleButton('Dokter'),
            _buildRoleButton('Apoteker'),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleButton(String role) {
    return Expanded(
      child: GestureDetector(
        onTap: () => controller.selectRole(role),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: controller.selectedRole.value == role
                ? const Color(0xFF1c8086)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            role,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: controller.selectedRole.value == role
                  ? Colors.white
                  : Colors.black,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormForRole(String role) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextField(controller.nameController, 'Full Name'),
        _buildTextField(controller.emailController, 'Email'),
        _buildTextField(
          controller.passwordController,
          'Password',
          isObscure: true,
        ),
        _buildTextField(
          controller.confirmPasswordController,
          'Confirm Password',
          isObscure: true,
        ),
        if (role == 'Dokter') ...[
          _buildTextField(controller.strController, 'STR Number'),
          _buildTextField(
            controller.specializationController,
            'Specialization',
          ),
        ],
        if (role == 'Apoteker') ...[
          _buildTextField(controller.straController, 'STRA Number'),
          _buildTextField(controller.pharmacyNameController, 'Pharmacy Name'),
        ],
      ],
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    bool isObscure = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            obscureText: isObscure,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Colors.grey[200],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return const Row(
      children: [
        Expanded(child: Divider()),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.0),
          child: Text('Or continue with', style: TextStyle(color: Colors.grey)),
        ),
        Expanded(child: Divider()),
      ],
    );
  }

  Widget _buildSocialButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildSocialButton(
          FontAwesomeIcons.google,
          () => controller.signInWithGoogle(),
        ),
        const SizedBox(width: 20),
        _buildSocialButton(FontAwesomeIcons.apple, () {
          Get.dialog(
            AlertDialog(
              title: const Text('Coming Soon'),
              content: const Text(
                'This feature will be available in the next update.',
              ),
              actions: [
                TextButton(
                  onPressed: () => Get.back(),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildSocialButton(IconData icon, VoidCallback onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(10),
        ),
        child: FaIcon(icon, size: 40),
      ),
    );
  }
}
