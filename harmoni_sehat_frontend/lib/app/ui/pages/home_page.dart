import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/home_controller.dart';

class HomePage extends StatelessWidget {
  final HomeController controller = Get.put(HomeController());

  HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Harmoni Sehat'),
        centerTitle: true,
      ),
      body: Obx(() {
        if (controller.isLoading.value && controller.dataList.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }
        if (controller.dataList.isEmpty) {
          return const Center(child: Text("Belum ada data."));
        }
        return RefreshIndicator(
          onRefresh: () async => controller.fetchData(),
          child: ListView.builder(
            itemCount: controller.dataList.length,
            itemBuilder: (context, index) {
              final data = controller.dataList[index];
              return Card(
                margin: const EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(data.nama, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Suhu: ${data.suhuTubuh}°C'),
                  trailing: Text('Detak Jantung: ${data.detakJantung} bpm'),
                ),
              );
            },
          ),
        );
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDataDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddDataDialog(BuildContext context) {
    Get.dialog(
      AlertDialog(
        title: const Text('Tambah Data Baru'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: controller.namaController, decoration: const InputDecoration(labelText: 'Nama')),
              TextField(controller: controller.detakJantungController, decoration: const InputDecoration(labelText: 'Detak Jantung (bpm)'), keyboardType: TextInputType.number),
              TextField(controller: controller.suhuTubuhController, decoration: const InputDecoration(labelText: 'Suhu Tubuh (°C)'), keyboardType: const TextInputType.numberWithOptions(decimal: true)),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Get.back(), child: const Text('Batal')),
          ElevatedButton(onPressed: controller.postData, child: const Text('Simpan')),
        ],
      ),
    );
  }
}