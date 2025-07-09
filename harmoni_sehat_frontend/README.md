# Harmoni Sehat Frontend Application

Aplikasi frontend untuk proyek Harmoni Sehat, dibangun dengan React, TypeScript, dan Vite. Aplikasi ini menyediakan antarmuka pengguna yang intuitif untuk mengelola berbagai aspek kesehatan, termasuk janji temu dokter, rekam medis pribadi, pemesanan obat, dan akses ke artikel kesehatan.

## Fitur Utama

*   **Otentikasi Pengguna:** Registrasi, login, dan manajemen sesi untuk berbagai peran (Pasien, Dokter, Apoteker, Admin).
*   **Dasbor Interaktif:** Dasbor yang dipersonalisasi untuk setiap peran pengguna, menampilkan informasi dan tindakan yang relevan.
*   **Pencarian & Pemesanan Dokter:** Fungsionalitas untuk mencari dokter berdasarkan spesialisasi dan menjadwalkan janji temu.
*   **Manajemen Rekam Medis:** Melihat dan mengelola rekam medis pribadi, riwayat penyakit, alergi, dan riwayat vaksinasi.
*   **Pemesanan Obat:** Menjelajahi katalog obat, menambahkan ke keranjang, dan melakukan pemesanan, termasuk upload resep.
*   **Konsultasi Online:** Antarmuka untuk konsultasi video dan obrolan dengan dokter.
*   **Notifikasi:** Menerima notifikasi real-time terkait janji temu, pesanan, dan pembaruan sistem.
*   **Artikel Kesehatan:** Mengakses dan membaca artikel kesehatan informatif.
*   **Manajemen Profil:** Memperbarui informasi profil pengguna, foto, dan bio.

## Teknologi yang Digunakan

*   **Frontend Framework:** React.js
*   **Bahasa:** TypeScript
*   **Build Tool:** Vite
*   **Manajemen Paket:** npm
*   **Styling:** (Asumsi: CSS Modules, atau Tailwind CSS, atau Bootstrap/Material UI jika akan diimplementasikan)

## Struktur Proyek

```
harmoni_sehat_frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/ # Komponen UI yang dapat digunakan kembali
│   ├── pages/      # Halaman-halaman utama aplikasi
│   ├── services/   # Logika untuk berinteraksi dengan API backend
│   ├── utils/      # Utilitas dan helper functions
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Memulai

### Prasyarat

*   Node.js (v18 atau lebih tinggi)
*   npm (v8 atau lebih tinggi)

### Instalasi

1.  Navigasi ke direktori `harmoni_sehat_frontend`:
    ```bash
    cd harmoni_sehat_frontend
    ```

2.  Instal dependensi:
    ```bash
    npm install
    ```

### Variabel Lingkungan

Jika aplikasi frontend Anda perlu terhubung ke API backend, Anda mungkin perlu membuat file `.env` di root direktori `harmoni_sehat_frontend` dengan variabel lingkungan yang sesuai, misalnya:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode pengembangan:

```bash
npm run dev
```

Aplikasi akan dapat diakses di `http://localhost:5173` (atau port yang ditentukan oleh Vite).

## Kontribusi

Jangan ragu untuk berkontribusi pada proyek ini. Pastikan kode Anda mematuhi gaya dan konvensi yang ada.

## Lisensi

[Tentukan Lisensi Anda di sini, misal: MIT License]