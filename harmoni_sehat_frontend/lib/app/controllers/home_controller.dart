import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../data/models/data_kesehatan_model.dart';
import '../data/providers/api_provider.dart';

class HomeController extends GetxController {
  final ApiProvider apiProvider = ApiProvider();
  var dataList = <DataKesehatan>[].obs;
  var isLoading = true.obs;

  // Form controllers
  final namaController = TextEditingController();
  final detakJantungController = TextEditingController();
  final suhuTubuhController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    fetchData();
  }

  void fetchData() async {
    try {
      isLoading(true);
      var data = await apiProvider.fetchDataKesehatan();
      dataList.assignAll(data);
    } finally {
      isLoading(false);
    }
  }

  void postData() async {
    if (namaController.text.isEmpty || detakJantungController.text.isEmpty || suhuTubuhController.text.isEmpty) {
        Get.snackbar("Error", "Semua field harus diisi", backgroundColor: Colors.red, colorText: Colors.white);
        return;
    }

    try {
      isLoading(true);
      final newData = DataKesehatan(
        nama: namaController.text,
        detakJantung: int.parse(detakJantungController.text),
        suhuTubuh: double.parse(suhuTubuhController.text),
      );
      await apiProvider.createDataKesehatan(newData);
      
      // Bersihkan form dan refresh data
      namaController.clear();
      detakJantungController.clear();
      suhuTubuhController.clear();
      Get.back(); // Tutup dialog
      fetchData(); // Muat ulang data
      Get.snackbar("Sukses", "Data berhasil ditambahkan", backgroundColor: Colors.green, colorText: Colors.white);

    } catch (e) {
        Get.snackbar("Error", "Gagal menambahkan data: $e", backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
        isLoading(false);
    }
  }
}