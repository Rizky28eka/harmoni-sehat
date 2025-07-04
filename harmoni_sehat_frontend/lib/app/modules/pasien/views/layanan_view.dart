import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/pasien/controllers/layanan_controller.dart';

class LayananView extends GetView<LayananController> {
  const LayananView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Layanan Page')),
      body: const Center(child: Text('Ini adalah halaman Layanan.')),
    );
  }
}
