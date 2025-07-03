# Frontend Harmoni Sehat

Aplikasi mobile untuk Proyek Harmoni Sehat, dibangun menggunakan Flutter.

## Fitur

*   Antarmuka untuk melihat, menambah, mengubah, dan menghapus data kesehatan.
*   Visualisasi data kesehatan (misalnya dalam bentuk grafik).
*   Berjalan di platform Android dan iOS.
*   Manajemen state menggunakan GetX.

## Prasyarat

*   [Flutter SDK](https://flutter.dev/docs/get-started/install) (versi 3.x atau lebih tinggi)
*   [Dart SDK](https://dart.dev/get-dart) (terinstal bersama Flutter)
*   Emulator Android atau iOS, atau perangkat fisik untuk pengujian.

## Instalasi & Menjalankan Aplikasi

1.  **Masuk ke direktori frontend:**
    ```bash
    cd harmoni_sehat_frontend
    ```

2.  **Install dependensi:**
    Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan.
    ```bash
    flutter pub get
    ```

3.  **Konfigurasi Backend:**
    Pastikan server backend sudah berjalan. Buka file konfigurasi di dalam `lib/app/data/providers/api_constants.dart` dan pastikan URL API menunjuk ke alamat server backend yang benar.
    ```dart
    // lib/app/data/providers/api_constants.dart
    class ApiConstants {
      static const String baseUrl = 'http://10.0.2.2:5000/api'; // Gunakan 10.0.2.2 untuk emulator Android, atau IP lokal Anda
    }
    ```

4.  **Jalankan aplikasi:**
    Pastikan Anda memiliki perangkat yang terhubung atau emulator yang sedang berjalan.
    ```bash
    flutter run
    ```
    Aplikasi akan di-build dan diinstal pada perangkat/emulator yang dipilih.

## Struktur Direktori Penting

*   `lib/`: Berisi semua kode sumber Dart aplikasi.
    *   `main.dart`: Titik masuk utama aplikasi.
    *   `app/`: Direktori utama yang berisi logika aplikasi, dibagi berdasarkan fitur atau lapisan.
        *   `bindings/`: Mengelola dependensi dan inisialisasi controller (Get.put, Get.lazyPut).
        *   `controllers/`: Berisi logika bisnis dan state aplikasi.
        *   `data/`: Berisi models, providers (untuk interaksi API), dan services.
        *   `routes/`: Mendefinisikan rute navigasi aplikasi.
        *   `ui/`: Berisi widget dan halaman UI.
*   `pubspec.yaml`: Mendefinisikan dependensi dan aset proyek.
*   `assets/`: Untuk menyimpan file aset seperti gambar dan font.
