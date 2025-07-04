# Backend Harmoni Sehat

Selamat datang di dokumentasi resmi untuk backend aplikasi **Harmoni Sehat**. Proyek ini dibangun menggunakan Node.js dan Express.js, dengan fokus pada arsitektur yang bersih, modular, dan scalable untuk mendukung pengembangan fitur kesehatan digital yang andal.

## Fitur Utama

Berikut adalah rangkuman fitur-fitur utama yang sudah tersedia di backend:

1.  **Autentikasi Pengguna Berbasis JWT**:
    *   Sistem registrasi dan login yang aman untuk pengguna (pasien).
    *   Menggunakan JSON Web Tokens (JWT) untuk mengelola sesi pengguna setelah login berhasil.
    *   Password disimpan dengan aman menggunakan hashing `bcryptjs`.

2.  **Autentikasi Sosial & OTP (Siap Dikembangkan)**:
    *   Endpoint untuk **Login dengan Google** sudah terintegrasi.
    *   Struktur endpoint untuk **Login dengan Apple** dan **Login via OTP (nomor telepon)** sudah disiapkan, mempermudah integrasi di masa depan.
    *   Semua metode login (tradisional, sosial, OTP) menghasilkan JWT yang sama, menjaga konsistensi sistem otorisasi.

3.  **Sistem Otorisasi Berbasis Peran (Role-Based)**:
    *   Middleware otorisasi untuk memproteksi rute tertentu.
    *   Memastikan hanya pengguna dengan peran (role) yang sesuai (misalnya `pasien`, `dokter`, `admin`) yang dapat mengakses endpoint tertentu.

4.  **Integrasi Payment Gateway (Siap Dikembangkan)**:
    *   Infrastruktur untuk mengelola pembayaran sudah disiapkan menggunakan **Midtrans**.
    *   Endpoint untuk membuat transaksi dan menangani notifikasi pembayaran (webhook) sudah tersedia.

5.  **Struktur Proyek Profesional & Scalable**:
    *   **Modular**: Kode dipecah menjadi modul-modul logis (`auth`, `payment`, dll.) di dalam direktori `src/api/`.
    *   **Pemisahan Tanggung Jawab**: Mengikuti pola desain *Controller-Service* (`auth.controller.js` untuk menangani request/response dan `auth.service.js` untuk logika bisnis).
    *   **Manajemen Konfigurasi**: Kunci API, kredensial database, dan variabel lingkungan lainnya dikelola melalui file `.env` untuk keamanan.

6.  **Standardisasi Respons API**:
    *   Menggunakan utility `ApiResponse` untuk format respons sukses yang konsisten.
    *   Menggunakan `ApiError` untuk penanganan kesalahan yang terstruktur dan informatif.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:
*   Node.js (v18 atau lebih tinggi)
*   NPM atau Yarn
*   Database MySQL yang sedang berjalan

## Instalasi & Konfigurasi

1.  **Clone repository ini:**
    ```bash
    git clone <URL_REPOSITORY>
    cd harmoni_sehat_backend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment:**
    *   Salin file `.env.example` menjadi `.env`.
    *   Isi semua variabel yang dibutuhkan seperti kredensial database, kunci API Google, Twilio, dan Midtrans.
    ```bash
    cp .env.example .env
    ```

4.  **Jalankan Migrasi Database:**
    Perintah ini akan membuat semua tabel yang dibutuhkan dalam database Anda sesuai dengan skema yang didefinisikan di direktori `db/migrations`.
    ```bash
    npm run migrate
    ```

5.  **Jalankan Server:**
    *   Untuk mode development dengan hot-reloading:
        ```bash
        npm run dev
        ```
    *   Untuk mode produksi:
        ```bash
        npm start
        ```
    Server akan berjalan di `http://localhost:PORT` (sesuai konfigurasi di `.env` atau default).

## Struktur Folder

```
/Users/rizky28eka/Development/flutterDev/harmoni_sehat_project/harmoni_sehat_backend/
├───.env                # File konfigurasi environment (JANGAN DI-COMMIT)
├───knexfile.js         # Konfigurasi Knex untuk migrasi dan seed
├───package.json        # Daftar dependensi dan skrip proyek
├───server.js           # Entry point aplikasi
└───src/
    ├───app.js          # Konfigurasi utama Express (middleware, router)
    ├───api/
    │   ├───index.js    # Router utama yang menggabungkan semua rute API
    │   └───auth/       # Modul autentikasi
    │       ├───auth.controller.js  # Logika request/response (HTTP layer)
    │       ├───auth.route.js       # Definisi endpoint untuk autentikasi
    │       └───auth.service.js     # Logika bisnis (berinteraksi dengan database)
    ├───config/
    │   └───db.js       # Konfigurasi koneksi database (Knex)
    ├───db/
    │   └───migrations/ # Skema database
    ├───middleware/
    │   └───auth.middleware.js # Middleware untuk validasi JWT dan otorisasi
    └───utils/
        ├───ApiError.js # Kelas untuk standardisasi error
        └───ApiResponse.js# Kelas untuk standardisasi respons sukses
```

## Dokumentasi API

Berikut adalah daftar endpoint utama yang sudah tersedia.

### Modul Autentikasi (`/api/auth`)

| Method | Endpoint               | Deskripsi                                    | Akses   |
|--------|------------------------|----------------------------------------------|---------|
| `POST` | `/register`            | Registrasi pengguna baru (pasien).           | Publik  |
| `POST` | `/login`               | Login dengan email dan password.             | Publik  |
| `POST` | `/google/login`        | Login atau registrasi menggunakan Akun Google. | Publik  |
| `POST` | `/apple/login`         | (Tersedia) Login dengan Apple ID.            | Publik  |
| `POST` | `/otp/send`            | (Tersedia) Mengirim kode OTP ke nomor telepon. | Publik  |
| `POST` | `/otp/verify`          | (Tersedia) Verifikasi OTP untuk login/reg.   | Publik  |

---

Dokumentasi ini diharapkan dapat menjadi panduan yang jelas bagi tim developer dalam melanjutkan pengembangan backend Harmoni Sehat.
