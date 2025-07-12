# Pendahuluan Backend Harmoni Sehat

Selamat datang di dokumentasi teknis untuk backend aplikasi Harmoni Sehat. Dokumen ini memberikan gambaran umum tentang arsitektur, teknologi yang digunakan, dan struktur proyek backend.

## 1. Gambaran Umum

Backend Harmoni Sehat adalah server RESTful API yang dibangun untuk melayani kebutuhan data dan fungsionalitas aplikasi mobile dan web Harmoni Sehat. Backend ini bertanggung jawab untuk mengelola data pengguna, otentikasi, rekam medis, konsultasi, dan semua fitur inti lainnya.

## 2. Teknologi yang Digunakan

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) dengan [Mongoose ODM](https://mongoosejs.com/)
- **Otentikasi:** JSON Web Tokens (JWT)
- **Validasi:** `express-validator`
- **Testing:** [Jest](https://jestjs.io/)

## 3. Struktur Proyek

Struktur proyek backend diatur berdasarkan fitur untuk memastikan skalabilitas dan kemudahan pemeliharaan.

```
harmoni_sehat_backend/
├── src/
│   ├── api/                  # Modul-modul API (fitur)
│   ├── config/               # Konfigurasi (database, environment)
│   ├── middlewares/          # Middleware Express
│   ├── models/               # Skema database (Mongoose)
│   └── utils/                # Fungsi utilitas
├── tests/                    # File-file pengujian
├── package.json              # Dependensi dan skrip
└── tsconfig.json             # Konfigurasi TypeScript
```

### Penjelasan Direktori

- **`src/api`**: Direktori ini berisi semua logika bisnis yang terkait dengan fitur tertentu. Setiap subdirektori di dalamnya mewakili satu modul fitur (misalnya, `auth`, `user`, `clinic`). Setiap modul memiliki file untuk `controller`, `service`, `routes`, `interface`, dan `validation`.
- **`src/config`**: Mengelola koneksi database dan variabel environment.
- **`src/middlewares`**: Berisi middleware kustom seperti otentikasi (`protect`), otorisasi (`authorize`), dan penanganan error (`errorHandler`).
- **`src/models`**: Mendefinisikan skema data untuk setiap koleksi di MongoDB.
- **`src/utils`**: Kumpulan fungsi pembantu yang dapat digunakan kembali di seluruh aplikasi.

## 4. Alur Kerja API

1.  **Request Masuk**: Klien (aplikasi frontend) mengirim request HTTP ke salah satu endpoint.
2.  **Routing**: Express.js menerima request dan meneruskannya ke router yang sesuai di dalam direktori `src/api`.
3.  **Middleware**: Request melewati middleware yang relevan (misalnya, untuk otentikasi atau validasi input).
4.  **Controller**: Controller menerima request yang telah divalidasi dan memanggil service yang sesuai untuk menjalankan logika bisnis.
5.  **Service**: Service berinteraksi dengan database (melalui Mongoose Models) atau layanan eksternal lainnya.
6.  **Response**: Controller mengembalikan response (data atau pesan error) ke klien dalam format JSON.

Dokumen ini akan dilanjutkan dengan panduan setup, referensi API yang lebih detail, dan skema database.
