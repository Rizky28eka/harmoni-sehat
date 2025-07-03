// lib/app/ui/pages/home/home_page.dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../controllers/auth_controller.dart';

class HomePage extends GetView<AuthController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              controller.logout();
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to Harmoni Sehat!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            Obx(() => Text(
                  controller.currentUser.value != null
                      ? 'Logged in as: ${controller.currentUser.value!.email}'
                      : 'Not logged in',
                  style: TextStyle(fontSize: 18),
                )),
          ],
        ),
      ),
    );
  }
}
