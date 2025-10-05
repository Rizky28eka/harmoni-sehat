import 'package:flutter/material.dart';

class AppointmentsTabView extends StatelessWidget {
  const AppointmentsTabView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Janji Temu'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text('Daftar Janji Temu di sini'),
      ),
    );
  }
}
