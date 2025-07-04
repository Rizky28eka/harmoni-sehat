import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/dokter/controllers/dokter_home_controller.dart';

class DokterHomeView extends GetView<DokterHomeController> {
  const DokterHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dokter Home Page')),
      body: const Center(child: Text('Welcome, Dokter!')),
    );
  }
}
