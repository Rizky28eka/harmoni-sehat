# Backend Harmoni Sehat

Layanan backend untuk aplikasi Harmoni Sehat. Dibangun menggunakan Node.js, Express.js, dan Knex.js dengan arsitektur modular yang skalabel.

## Fitur

*   Menyediakan REST API untuk operasi CRUD (Create, Read, Update, Delete).
*   Manajemen pengguna dan autentikasi berbasis JWT.
*   Struktur proyek yang siap untuk pengembangan skala besar.

## Prasyarat

*   [Node.js](https://nodejs.org/) (versi 16.x atau lebih tinggi)
*   [NPM](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
*   Database MySQL atau database lain yang didukung Knex.js.

## Instalasi & Menjalankan Server

1.  **Masuk ke direktori backend:**
    ```bash
    cd harmoni_sehat_backend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Lingkungan:**
    Buat file `.env` di root proyek dengan menyalin dari `.env.example` (jika ada). Sesuaikan variabel di dalamnya, seperti koneksi database, port server, dan secret key untuk JWT.
    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=secret
    DB_NAME=harmoni_sehat
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Jalankan Migrasi Database:**
    Pastikan konfigurasi database di `knexfile.js` dan `.env` sudah benar. Jalankan perintah berikut untuk membuat tabel-tabel yang dibutuhkan.
    ```bash
    npx knex migrate:latest
    ```

5.  **Jalankan server:**
    Untuk memulai server dalam mode development dengan `nodemon` (auto-reload):
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:5000` (atau port yang Anda tentukan di `.env`).

## Struktur Proyek

Proyek ini mengadopsi arsitektur modular berbasis fitur untuk memastikan skalabilitas dan kemudahan maintenance. Semua kode aplikasi berada di dalam direktori `src/`.

```
src/
├── api/               # Folder utama untuk semua modul/fitur API
│   ├── auth/          # Contoh: Modul Autentikasi
│   │   ├── auth.controller.js
│   │   ├── auth.route.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   └── index.js       # Entry point untuk semua rute API
├── app.js             # Konfigurasi utama Express (middleware, routes)
├── config/            # Konfigurasi (database, variabel env)
├── db/                # Migrasi dan seed database Knex
├── middleware/        # Middleware kustom (auth, error handler)
└── utils/             # Utilitas dan helper (ApiError, ApiResponse)
```

### Alur Kerja (Workflow)
1.  **`server.js`**: Memuat `dotenv`, menginisialisasi koneksi database, dan menjalankan aplikasi dari `src/app.js`.
2.  **`src/app.js`**: Mengonfigurasi Express, menerapkan middleware global (CORS, body-parser), dan mendaftarkan semua rute dari `src/api/index.js`.
3.  **`src/api/index.js`**: Menggabungkan semua file `*.route.js` dari setiap modul fitur.
4.  **Rute (`*.route.js`)**: Mendefinisikan endpoint API dan meneruskannya ke controller yang sesuai.
5.  **Controller (`*.controller.js`)**: Memvalidasi input, memanggil service untuk eksekusi logika bisnis, dan mengirimkan respons ke klien menggunakan `ApiResponse`.
6.  **Service (`*.service.js`)**: Berisi logika bisnis murni, berinteraksi dengan database (melalui model atau Knex), dan tidak terikat dengan HTTP request/response.
7.  **Error Handling**: Semua error ditangkap dan diproses oleh middleware error handler global untuk memastikan format respons error yang konsisten.
