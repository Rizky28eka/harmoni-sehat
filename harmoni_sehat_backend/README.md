# Backend Harmoni Sehat

Layanan backend untuk aplikasi Harmoni Sehat. Dibangun menggunakan Node.js, Express.js, dan Knex.js dengan arsitektur modular yang skalabel.

## Fitur

*   Menyediakan REST API untuk operasi CRUD (Create, Read, Update, Delete).
*   Manajemen pengguna dan autentikasi berbasis JWT.
*   Struktur proyek yang siap untuk pengembangan skala besar.

## Prasyarat

*   [Node.js](https://nodejs.org/) (versi 16.x atau lebih tinggi)
*   [NPM](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
*   Database MySQL.

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

## API Endpoints

Berikut adalah daftar endpoint API yang tersedia:

### Autentikasi (`/api/auth`)
*   **`POST /api/auth/register`**
    *   **Deskripsi:** Mendaftarkan pengguna baru (role pasien).
    *   **Akses:** Public
    *   **Body Request:**
        ```json
        {
          "nama_lengkap": "Nama Lengkap Pengguna",
          "email": "email@example.com",
          "password": "password123",
          "no_hp": "081234567890"
        }
        ```
    *   **Respons Sukses (201 Created):**
        ```json
        {
          "message": "Registrasi berhasil",
          "userId": 1
        }
        ```
    *   **Respons Error (400 Bad Request / 409 Conflict / 500 Internal Server Error):**
        ```json
        {
          "message": "Pesan kesalahan"
        }
        ```

*   **`POST /api/auth/login`**
    *   **Deskripsi:** Melakukan login pengguna dan mengembalikan token JWT.
    *   **Akses:** Public
    *   **Body Request:**
        ```json
        {
          "email": "email@example.com",
          "password": "password123"
        }
        ```
    *   **Respons Sukses (200 OK):**
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
    *   **Respons Error (400 Bad Request / 401 Unauthorized):**
        ```json
        {
          "message": "Pesan kesalahan"
        }
        ```

### Data Kesehatan (`/api/kesehatan`)
*   **`GET /api/kesehatan`**
    *   **Deskripsi:** Mengambil semua data kesehatan.
    *   **Akses:** Authenticated (Role: `pasien`)
    *   **Header:** `Authorization: Bearer <token_jwt>`
    *   **Respons Sukses (200 OK):**
        ```json
        [
          {
            "id": 1,
            "nama": "John Doe",
            "detakJantung": 75,
            "suhuTubuh": 36.5,
            "tanggal": "2025-07-04T10:00:00.000Z"
          }
        ]
        ```
    *   **Respons Error (401 Unauthorized / 403 Forbidden / 500 Internal Server Error):**
        ```json
        {
          "message": "Pesan kesalahan"
        }
        ```

*   **`POST /api/kesehatan`**
    *   **Deskripsi:** Menambahkan data kesehatan baru.
    *   **Akses:** Authenticated (Any role)
    *   **Header:** `Authorization: Bearer <token_jwt>`
    *   **Body Request:**
        ```json
        {
          "nama": "Jane Doe",
          "detakJantung": 80,
          "suhuTubuh": 37.0
        }
        ```
    *   **Respons Sukses (201 Created):**
        ```json
        {
          "id": 2,
          "nama": "Jane Doe",
          "detakJantung": 80,
          "suhuTubuh": 37.0
        }
        ```
    *   **Respons Error (400 Bad Request / 401 Unauthorized / 500 Internal Server Error):**
        ```json
        {
          "message": "Pesan kesalahan"
        }
        ```