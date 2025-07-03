# Backend Harmoni Sehat

Layanan backend untuk aplikasi Harmoni Sehat. Dibangun menggunakan Node.js dan Express.js.

## Fitur

*   Menyediakan REST API untuk operasi CRUD (Create, Read, Update, Delete) pada data kesehatan.
*   Manajemen data pengguna dan autentikasi (jika ada).

## Prasyarat

*   [Node.js](https://nodejs.org/) (versi 14.x atau lebih tinggi)
*   [NPM](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
*   (Sebutkan prasyarat lain jika ada, misal: koneksi ke database)

## Instalasi & Menjalankan Server

1.  **Masuk ke direktori backend:**
    ```bash
    cd harmoni_sehat_backend
    ```

2.  **Install dependensi:**
    Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan.
    ```bash
    npm install
    ```

3.  **Konfigurasi Lingkungan:**
    Buat file `.env` di dalam direktori ini dengan menyalin dari `.env.example` (jika ada) dan sesuaikan variabel di dalamnya, seperti koneksi database dan port server.
    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=secret
    DB_NAME=harmoni_sehat
    ```

4.  **Jalankan server:**
    Untuk memulai server dalam mode development (pengembangan), jalankan:
    ```bash
    npm start
    ```
    Atau jika Anda menggunakan `nodemon` untuk auto-reload:
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

## Struktur API

*   `GET /api/kesehatan`: Mengambil semua data kesehatan.
*   `POST /api/kesehatan`: Menambahkan data kesehatan baru.
*   `GET /api/kesehatan/:id`: Mengambil data kesehatan berdasarkan ID.
*   `PUT /api/kesehatan/:id`: Memperbarui data kesehatan berdasarkan ID.
*   `DELETE /api/kesehatan/:id`: Menghapus data kesehatan berdasarkan ID.
