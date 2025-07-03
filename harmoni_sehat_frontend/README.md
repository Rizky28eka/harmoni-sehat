# Frontend Harmoni Sehat

Aplikasi mobile untuk Proyek Harmoni Sehat, dibangun menggunakan Flutter.

## Fitur

*   Antarmuka untuk melihat, menambah, mengubah, dan menghapus data kesehatan.
*   Visualisasi data kesehatan (misalnya dalam bentuk grafik).
*   Berjalan di platform Android dan iOS.

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
    Pastikan server backend sudah berjalan. Buka file konfigurasi di dalam `lib/` (misalnya `lib/app/data/providers/api_provider.dart` atau file sejenisnya) dan pastikan URL API menunjuk ke alamat server backend yang benar.
    ```dart
    // Contoh
    final String _baseUrl = "http://10.0.2.2:3000/api"; // Gunakan 10.0.2.2 untuk emulator Android
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
    *   `app/`: Direktori utama yang berisi logika aplikasi, dibagi berdasarkan fitur atau lapisan (controllers, models, ui, dll).
*   `pubspec.yaml`: Mendefinisikan dependensi dan aset proyek.
*   `assets/`: Untuk menyimpan file aset seperti gambar dan font.