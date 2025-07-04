import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:harmoni_sehat_frontend/app/modules/apoteker/controllers/apoteker_home_controller.dart';

class ApotekerHomeView extends GetView<ApotekerHomeController> {
  const ApotekerHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Apoteker Home Page')),
      body: const Center(child: Text('Welcome, Apoteker!')),
    );
  }
}
