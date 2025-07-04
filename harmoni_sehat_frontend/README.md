# Harmoni Sehat Frontend

![Flutter Version](https://img.shields.io/badge/Flutter-3.8.1-blue?logo=flutter)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)

Aplikasi mobile `Harmoni Sehat` adalah platform kesehatan yang dibangun menggunakan Flutter dengan arsitektur GetX. Aplikasi ini dirancang untuk memfasilitasi interaksi antara pasien, dokter, dan apoteker, menyediakan fitur-fitur penting untuk manajemen kesehatan yang terintegrasi.

## Fitur Utama

*   **Autentikasi Pengguna**: Sistem login, registrasi, dan verifikasi OTP yang aman.
*   **Navigasi Berbasis Role**: Pengguna akan diarahkan ke dashboard yang sesuai setelah login (Pasien, Dokter, Apoteker).
*   **Manajemen Profil**: Pengguna dapat mengelola informasi profil mereka.
*   **Konsultasi Online**: (Fitur yang akan dikembangkan/dijelaskan lebih lanjut)
*   **Manajemen Resep**: (Fitur yang akan dikembangkan/dijelaskan lebih lanjut)
*   **Informasi Obat**: (Fitur yang akan dikembangkan/dijelaskan lebih lanjut)

## Struktur Folder

Proyek ini mengikuti arsitektur modular dengan GetX, memisahkan fitur berdasarkan role pengguna untuk kemudahan pengembangan dan pemeliharaan.

```
lib/
├── main.dart
└── app/
    ├── data/             # Repositories, providers, models, dll.
    ├── modules/          # Modul utama aplikasi, dibagi berdasarkan role
    │   ├── pasien/       # Modul untuk role Pasien
    │   │   ├── bindings/
    │   │   ├── controllers/
    │   │   └── views/
    │   ├── dokter/       # Modul untuk role Dokter
    │   │   ├── bindings/
    │   │   ├── controllers/
    │   │   └── views/
    │   └── apoteker/     # Modul untuk role Apoteker
    │       ├── bindings/
    │       ├── controllers/
    │       └── views/
    ├── routes/           # Definisi rute aplikasi (AppPages, AppRoutes)
    └── shared/           # Komponen, utilitas, konstanta, tema yang digunakan bersama
        ├── widgets/
        ├── utils/
        ├── constants/
        └── theme/
```

## Cara Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek `Harmoni Sehat Frontend` di lingkungan lokal Anda.

### Prasyarat

*   [Flutter SDK](https://flutter.dev/docs/get-started/install) (Versi 3.8.1 atau lebih tinggi direkomendasikan)
*   [Android Studio](https://developer.android.com/studio) atau [Xcode](https://developer.apple.com/xcode/) (untuk pengembangan mobile)
*   Editor kode seperti [VS Code](https://code.visualstudio.com/) dengan ekstensi Flutter.

### Langkah-langkah

1.  **Clone Repositori**:
    ```bash
    git clone https://github.com/your-username/harmoni_sehat_project.git
    cd harmoni_sehat_project/harmoni_sehat_frontend
    ```

2.  **Install Dependensi**:
    Jalankan perintah berikut di terminal untuk mengunduh semua dependensi yang diperlukan:
    ```bash
    flutter pub get
    ```

3.  **Setup Android (Opsional)**:
    *   Pastikan Anda memiliki Android SDK yang terinstal dan emulator atau perangkat fisik yang terhubung.
    *   Jalankan `flutter doctor` untuk memeriksa konfigurasi Android Anda.

4.  **Setup iOS (Opsional)**:
    *   Pastikan Anda memiliki Xcode yang terinstal.
    *   Jalankan `pod install` di direktori `ios/` jika ada masalah dengan dependensi CocoaPods:
        ```bash
        cd ios
        pod install
        cd ..
        ```
    *   Jalankan `flutter doctor` untuk memeriksa konfigurasi iOS Anda.

5.  **Jalankan Aplikasi**:
    Setelah semua dependensi terinstal dan setup platform selesai, Anda bisa menjalankan aplikasi:
    ```bash
    flutter run
    ```
    Pilih perangkat atau emulator yang tersedia saat diminta.

## Dependensi Penting

Berikut adalah daftar dependensi utama yang digunakan dalam proyek ini:

*   `get`: ^4.7.2 - Framework untuk manajemen state, injeksi dependensi, dan manajemen rute.
*   `http`: ^1.4.0 - Untuk melakukan HTTP requests.
*   `shared_preferences`: ^2.2.3 - Untuk menyimpan data sederhana secara lokal.
*   `font_awesome_flutter`: ^10.7.0 - Icon set Font Awesome untuk Flutter.
*   `geolocator`: ^12.0.0 - Untuk mendapatkan lokasi geografis perangkat.
*   `geocoding`: ^3.0.0 - Untuk geocoding dan reverse geocoding.
*   `get_storage`: ^2.1.1 - Solusi penyimpanan key-value yang cepat dan mudah digunakan, dibangun di atas GetX.
*   `cupertino_icons`: ^1.0.8 - Icon set gaya iOS.

## Kontribusi

(Bagian ini dapat ditambahkan nanti jika ada panduan kontribusi)

## Lisensi

(Bagian ini dapat ditambahkan nanti jika ada informasi lisensi)