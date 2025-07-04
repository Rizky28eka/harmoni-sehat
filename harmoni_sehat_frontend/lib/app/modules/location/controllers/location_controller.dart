import 'dart:async';

import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationController extends GetxController {
  // Variabel reaktif untuk UI
  var currentLocation = 'Mencari lokasi...'.obs;
  var isLoadingLocation = true.obs;

  // Stream subscription untuk mengelola aliran data lokasi
  StreamSubscription<Position>? _locationStreamSubscription;

  @override
  void onInit() {
    super.onInit();
    _subscribeToLocationUpdates();
  }

  @override
  void onClose() {
    // Sangat penting untuk membatalkan subscription saat controller ditutup
    // untuk mencegah kebocoran memori (memory leaks).
    _locationStreamSubscription?.cancel();
    super.onClose();
  }

  // Metode utama untuk memulai stream lokasi
  Future<void> _subscribeToLocationUpdates() async {
    isLoadingLocation.value = true;

    // 1. Cek apakah layanan lokasi di perangkat aktif.
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      currentLocation.value = 'Layanan lokasi mati.';
      isLoadingLocation.value = false;
      // Anda bisa menambahkan logika untuk meminta pengguna mengaktifkan GPS di sini
      return;
    }

    // 2. Cek dan minta izin dari pengguna.
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        currentLocation.value = 'Izin lokasi ditolak.';
        isLoadingLocation.value = false;
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      currentLocation.value = 'Izin lokasi ditolak permanen.';
      isLoadingLocation.value = false;
      // Anda bisa menambahkan logika untuk membuka pengaturan aplikasi di sini
      return;
    }

    // 3. Jika izin diberikan, mulai dengarkan stream lokasi.
    _locationStreamSubscription = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Update setiap pergerakan 10 meter
      ),
    ).listen((Position position) {
      // Setiap kali ada posisi baru, konversi ke alamat
      _getAddressFromCoordinates(position);
      if (isLoadingLocation.value) {
        isLoadingLocation.value = false; // Matikan loading setelah update pertama
      }
    }, onError: (error) {
      currentLocation.value = 'Gagal mendapatkan lokasi: $error';
      isLoadingLocation.value = false;
    });
  }

  // Metode helper untuk mengubah Lat/Long menjadi alamat
  Future<void> _getAddressFromCoordinates(Position position) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        // Format alamat yang lebih informatif
        currentLocation.value = '${place.locality}, ${place.subAdministrativeArea}';
      } else {
        currentLocation.value = 'Alamat tidak ditemukan';
      }
    } catch (e) {
      currentLocation.value = "Gagal mengubah koordinat";
    }
  }

  // Metode publik untuk mencoba lagi jika terjadi error
  void retryGettingLocation() {
    // Batalkan stream lama jika ada, lalu mulai lagi
    _locationStreamSubscription?.cancel();
    _subscribeToLocationUpdates();
  }
}