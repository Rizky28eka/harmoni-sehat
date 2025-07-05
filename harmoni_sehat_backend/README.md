# Dokumentasi Backend Harmoni Sehat

Dokumentasi ini menjelaskan tentang proyek backend untuk aplikasi Harmoni Sehat, yang dibangun menggunakan Node.js dengan framework Express.js dan database MySQL.

## Deskripsi Umum

Backend ini berfungsi sebagai tulang punggung aplikasi Harmoni Sehat, menyediakan RESTful API untuk mengelola berbagai entitas seperti pengguna, dokter, pasien, apotek, obat-obatan, konsultasi, pembayaran, dan banyak lagi. Dibangun dengan modularitas, backend ini dirancang untuk skalabilitas dan kemudahan pemeliharaan.

- **Framework:** Express.js
- **Bahasa:** JavaScript (Node.js)
- **Database:** MySQL (melalui Knex.js ORM)
- **Manajemen Paket:** npm

## Instalasi dan Menjalankan di Local Development

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek backend di lingkungan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

- [Node.js](https://nodejs.org/en/download/) (disarankan versi LTS)
- [npm](https://www.npmjs.com/get-npm) (biasanya terinstal bersama Node.js)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (atau akses ke instance MySQL)

### Langkah-langkah Instalasi

1.  **Clone Repositori:**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd harmoni_sehat_project/harmoni_sehat_backend
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env` di root direktori `harmoni_sehat_backend` berdasarkan contoh `.env.example`.

    ```dotenv
    # Database Configuration
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=harmoni_sehat_db

    # Application Configuration
    PORT=3000
    FRONTEND_URL=http://localhost:3000 # Ganti dengan URL frontend Anda
    JWT_SECRET=your_jwt_secret_key # Ganti dengan kunci rahasia yang kuat
    # Tambahkan variabel lingkungan lainnya sesuai kebutuhan
    ```
    Ganti nilai `your_mysql_user`, `your_mysql_password`, `harmoni_sehat_db`, dan `your_jwt_secret_key` dengan kredensial database dan kunci rahasia Anda.

4.  **Jalankan Migrasi Database:**
    Ini akan membuat tabel-tabel database sesuai skema yang didefinisikan.
    ```bash
    npm run migrate
    ```

5.  **Seed Data Dummy (Opsional):**
    Untuk mengisi database dengan data contoh menggunakan `faker-js`:
    ```bash
    npm run seed
    ```

6.  **Jalankan Server Backend:**
    ```bash
    npm start
    ```
    Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

## Struktur Folder Backend

Struktur direktori backend diatur secara modular untuk memisahkan tanggung jawab dan memudahkan pengembangan:

```
harmoni_sehat_backend/
├───db/                     # Konfigurasi database, migrasi, dan seeder
│   ├───migrations/         # Skema perubahan database
│   ├───seeds/              # Skrip untuk mengisi data dummy
│   └───knexfile.js         # Konfigurasi Knex.js
├───src/                    # Kode sumber aplikasi
│   ├───api/                # Modul-modul API (per entitas/tabel)
│   │   ├───[entity_name]/  # Contoh: users, doctors, pasien, dll.
│   │   │   ├───[entity_name].controller.js # Logika request/response
│   │   │   ├───[entity_name].service.js    # Logika bisnis & interaksi DB
│   │   │   ├───[entity_name].route.js      # Definisi endpoint API
│   │   │   └───[entity_name].validation.js # Validasi input dengan express-validator
│   │   └───index.js        # Mengumpulkan semua rute API
│   ├───config/             # Konfigurasi aplikasi (mis. koneksi DB)
│   ├───middleware/         # Middleware Express.js (mis. error handling, auth)
│   ├───utils/              # Fungsi utilitas (mis. ApiError, ApiResponse)
│   └───app.js              # Konfigurasi utama aplikasi Express.js
├───.env.example            # Contoh file environment variables
├───package.json            # Metadata proyek & dependensi
├───server.js               # Titik masuk utama aplikasi
└───README.md               # Dokumentasi proyek ini
```

## Perintah Penting

-   **`npm install`**: Menginstal semua dependensi proyek.
-   **`npm start`**: Menjalankan server backend dalam mode produksi.
-   **`npm run dev`**: Menjalankan server backend dalam mode pengembangan dengan `nodemon` (auto-restart).
-   **`npm run migrate`**: Menjalankan semua migrasi database yang belum diterapkan.
-   **`npm run migrate:make [nama_migrasi]`**: Membuat file migrasi baru.
-   **`npm run migrate:rollback`**: Mengembalikan migrasi terakhir.
-   **`npm run seed`**: Menjalankan semua seeder untuk mengisi data dummy.
-   **`npm run seed:make [nama_seeder]`**: Membuat file seeder baru.

## Penanganan Error

Backend ini menggunakan penanganan error terpusat untuk memberikan respons error yang konsisten. Error akan dikembalikan dalam format JSON dengan `statusCode` dan `message` yang relevan.

## Kontribusi

Untuk berkontribusi pada proyek ini, silakan ikuti struktur folder dan panduan kode yang ada. Pastikan untuk menjalankan tes dan migrasi sebelum membuat pull request.