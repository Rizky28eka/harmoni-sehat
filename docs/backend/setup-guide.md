
# Panduan Setup Backend Harmoni Sehat

Dokumen ini menjelaskan langkah-langkah untuk menyiapkan dan menjalankan environment development backend Harmoni Sehat di mesin lokal Anda.

---

## 1. Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

-   [Node.js](https://nodejs.org/) (versi 18.x atau lebih tinggi)
-   [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
-   [Git](https://git-scm.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (database server)

---

## 2. Instalasi

1.  **Clone Repository**

    Buka terminal Anda dan clone repository proyek:

    ```bash
    git clone https://github.com/rizky28eka/harmoni-sehat.git
    cd harmoni-sehat/harmoni_sehat_backend
    ```

2.  **Instal Dependensi**

    Instal semua dependensi yang diperlukan menggunakan npm:

    ```bash
    npm install
    ```

---

## 3. Konfigurasi Environment

1.  **Buat File `.env`**

    Salin file `.env.example` menjadi file baru bernama `.env` di root direktori `harmoni_sehat_backend`.

    ```bash
    cp .env.example .env
    ```

2.  **Isi Variabel Environment**

    Buka file `.env` dan isi variabel-variabel berikut sesuai dengan konfigurasi lokal Anda.

    ```env
    # === DATABASE ===
    # Ganti dengan koneksi string MongoDB lokal Anda
    MONGO_URI="mongodb://localhost:27017/harmoni_sehat_dev"

    # === SERVER PORT ===
    PORT=8000

    # === AUTHENTICATION & SECURITY ===
    # Ganti dengan string rahasia yang kuat dan acak
    JWT_SECRET=RahasiaSuperKuat123
    SESSION_SECRET=SesiRahasiaLainnya456
    ENCRYPTION_KEY=KunciEnkripsiYangPanjangDanAman789

    # === GOOGLE GEMINI API ===
    # Masukkan API Key Anda dari Google AI Studio
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # === EMAIL (Nodemailer) ===
    # Konfigurasi untuk mengirim email (misalnya, untuk reset password)
    # Anda bisa menggunakan layanan seperti Gmail (dengan App Password) atau Mailtrap
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USERNAME=your.email@gmail.com
    EMAIL_PASSWORD=your_gmail_app_password
    EMAIL_FROM="Harmoni Sehat <no-reply@harmoni-sehat.com>"

    # === FRONTEND URL ===
    # URL aplikasi frontend untuk membuat link yang benar (misal: dalam email)
    FRONTEND_URL=http://localhost:3000
    ```

    **Catatan:** Variabel seperti `TWILIO` dan `GOOGLE_OAUTH` dapat dikosongkan jika fitur terkait tidak digunakan dalam development.

---

## 4. Menjalankan Aplikasi

Setelah instalasi dan konfigurasi selesai, Anda dapat menjalankan server development.

```bash
npm run dev
```

Server akan berjalan dalam *watch mode* menggunakan `nodemon`, yang berarti server akan otomatis restart setiap kali ada perubahan pada file kode sumber.

Anda akan melihat output seperti ini di terminal, yang menandakan server berhasil berjalan:

```
[nodemon] starting `ts-node src/index.ts`
Server is running on port 8000
MongoDB connected successfully
```

Server sekarang siap menerima request di `http://localhost:8000`.

---

## 5. Skrip NPM Lainnya

Proyek ini dilengkapi dengan beberapa skrip NPM yang berguna:

-   `npm run build`: Meng-compile kode TypeScript menjadi JavaScript di direktori `dist/`.
-   `npm run start`: Menjalankan aplikasi dari kode yang sudah di-build (mode produksi).
-   `npm run lint`: Memeriksa kualitas kode menggunakan ESLint.
-   `npm run format`: Memformat semua file kode menggunakan Prettier.
-   `npm run seed`: Menjalankan seeder untuk mengisi database dengan data awal (jika ada).
