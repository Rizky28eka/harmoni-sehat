# Harmoni Sehat Backend API

Aplikasi backend untuk proyek Harmoni Sehat, dibangun dengan Express.js, TypeScript, dan MongoDB. API ini dirancang untuk mendukung aplikasi frontend yang komprehensif untuk manajemen kesehatan, janji temu, rekam medis, dan e-commerce farmasi.

## Fitur

*   **Manajemen Pengguna & Peran:**
    *   Manajemen pengguna (registrasi, login, profil).
    *   Sistem peran (Pasien, Dokter, Apoteker, Admin) dengan otentikasi berbasis token.
    *   Manajemen profil pengguna (foto, bio).
*   **Klinik & Jadwal:**
    *   Manajemen data klinik.
    *   Manajemen spesialisasi dokter.
    *   Penjadwalan praktik dokter di berbagai klinik.
*   **Modul Konsultasi & Rekam Medis:**
    *   Manajemen konsultasi (penjadwalan, status, keluhan, diagnosis, tindakan).
    *   Pesan obrolan terkait konsultasi.
    *   Ulasan dokter oleh pasien.
    *   Manajemen rekam medis pasien (riwayat penyakit, alergi, riwayat vaksinasi).
*   **Modul Farmasi & E-commerce:**
    *   Manajemen data obat (nama, deskripsi, kategori, harga, stok, resep).
    *   Keranjang obat untuk pasien.
    *   Manajemen pesanan obat dan detailnya.
    *   Manajemen resep dan obat-obatan yang diresepkan.
*   **Sistem Pendukung:**
    *   Pencatatan aktivitas pengguna.
    *   Manajemen media (URL, tipe MIME, ukuran).
    *   Manajemen token refresh untuk otentikasi.
    *   Sistem notifikasi.
    *   Manajemen artikel kesehatan (penulis, status publikasi).
    *   Manajemen metode pembayaran.
    *   Pencatatan transaksi dengan referensi polimorfik ke konsultasi atau pesanan obat.

## Struktur Proyek

```
harmoni_sehat_backend/
├── src/
│   ├── api/
│   │   ├── medicalRecord/
│   │   │   ├── medicalRecord.controller.ts
│   │   │   ├── medicalRecord.interface.ts
│   │   │   ├── medicalRecord.routes.ts
│   │   │   └── medicalRecord.service.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.routes.ts
│   │       └── user.service.ts
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── models/
│   │   ├── ActivityLog.ts
│   │   ├── Admin.ts
│   │   ├── ChatMessage.ts
│   │   ├── Clinic.ts
│   │   ├── Consultation.ts
│   │   ├── Doctor.ts
│   │   ├── DoctorClinic.ts
│   │   ├── DoctorReview.ts
│   │   ├── Drug.ts
│   │   ├── DrugCart.ts
│   │   ├── DrugOrder.ts
│   │   ├── DrugOrderDetail.ts
│   │   ├── HealthArticle.ts
│   │   ├── Media.ts
│   │   ├── MedicalRecord.ts
│   │   ├── Notification.ts
│   │   ├── Patient.ts
│   │   ├── PaymentMethod.ts
│   │   ├── Pharmacist.ts
│   │   ├── PracticeSchedule.ts
│   │   ├── Prescription.ts
│   │   ├── PrescriptionDrug.ts
│   │   ├── RefreshToken.ts
│   │   ├── Role.ts
│   │   ├── Specialization.ts
│   │   ├── Transaction.ts
│   │   ├── User.ts
│   │   ├── UserProfile.ts
│   │   └── UserRole.ts
│   ├── utils/
│   │   ├── ApiResponse.ts
│   │   ├── AppError.ts
│   │   └── seeder.ts
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Memulai

### Prasyarat

*   Node.js (v18 atau lebih tinggi)
*   npm (v8 atau lebih tinggi)
*   MongoDB (berjalan secara lokal atau dapat diakses melalui string koneksi)

### Instalasi

1.  Navigasi ke direktori `harmoni_sehat_backend`:
    ```bash
    cd harmoni_sehat_backend
    ```

2.  Instal dependensi:
    ```bash
    npm install
    ```

### Variabel Lingkungan

Buat file `.env` di direktori `harmoni_sehat_backend` dengan konten berikut:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/harmoni_sehat
```

*   `PORT`: Port di mana server akan berjalan.
*   `MONGO_URI`: String koneksi MongoDB Anda. Jika berjalan secara lokal, pastikan MongoDB berjalan pada port default atau perbarui URI sesuai kebutuhan.

### Menjalankan Aplikasi

#### Mode Pengembangan

Untuk menjalankan server dalam mode pengembangan dengan `nodemon` (otomatis restart saat ada perubahan file):

```bash
npm run dev
```

API akan dapat diakses di `http://localhost:5000` (atau PORT yang Anda tentukan).

#### Membangun untuk Produksi

Untuk mengkompilasi kode TypeScript ke JavaScript:

```bash
npm run build
```

Ini akan menghasilkan file JavaScript yang dikompilasi ke direktori `dist`.

#### Mode Produksi

Untuk memulai aplikasi yang telah dikompilasi:

```bash
npm run start
```

### Seeding Data

Untuk mengisi database Anda dengan data dummy (berguna untuk pengujian):

```bash
npm run seed
```

**Peringatan:** Perintah ini akan menghapus semua data yang ada di database sebelum mengisi data baru. Gunakan dengan hati-hati di lingkungan produksi.

## Endpoint API

URL dasar API adalah `http://localhost:PORT/api`.

*Catatan: Endpoint spesifik untuk setiap modul akan diimplementasikan di dalam folder `src/api/`.*

### Manajemen Pengguna

*   `/api/users`
*   `/api/roles`
*   `/api/user-profiles`
*   `/api/admins`
*   `/api/doctors`
*   `/api/patients`
*   `/api/pharmacists`

### Klinik & Jadwal

*   `/api/clinics`
*   `/api/specializations`
*   `/api/doctor-clinics`
*   `/api/practice-schedules`

### Konsultasi & Rekam Medis

*   `/api/consultations`
*   `/api/chat-messages`
*   `/api/doctor-reviews`
*   `/api/medical-records`

### Farmasi & E-commerce

*   `/api/drugs`
*   `/api/drug-carts`
*   `/api/drug-orders`
*   `/api/prescriptions`

### Sistem Pendukung

*   `/api/activity-logs`
*   `/api/media`
*   `/api/refresh-tokens`
*   `/api/notifications`
*   `/api/health-articles`
*   `/api/payment-methods`
*   `/api/transactions`

## Kontribusi

Jangan ragu untuk berkontribusi pada proyek ini. Pastikan kode Anda mematuhi gaya dan konvensi yang ada.

## Lisensi

[Tentukan Lisensi Anda di sini, misal: MIT License]