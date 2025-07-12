
# Referensi API Harmoni Sehat

Dokumen ini berisi detail semua endpoint API yang tersedia di backend Harmoni Sehat. Semua response dikembalikan dalam format JSON.

---

## Daftar Isi

1.  [Otentikasi (`/api/auth`)](#otentikasi-apiauth)
2.  [Pengguna (`/api/users`)](#pengguna-apiusers)

---

## 1. Otentikasi (`/api/auth`)

Endpoint ini menangani semua proses yang terkait dengan otentikasi pengguna, seperti registrasi, login, dan manajemen password.

### **POST** `/api/auth/register`

Mendaftarkan pengguna baru.

-   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "role": "60d5f1f2a1b2c3d4e5f6g7h8" // ID dari role
    }
    ```

-   **Response Sukses (201):**

    ```json
    {
      "status": "success",
      "token": "jwt.token.string",
      "data": {
        "user": {
          "_id": "...",
          "email": "user@example.com",
          "role": "...",
          "is_active": true
        }
      }
    }
    ```

-   **Response Error:**
    -   `400 Bad Request`: Jika data yang dikirim tidak valid.
    -   `409 Conflict`: Jika email sudah terdaftar.

### **POST** `/api/auth/login`

Login pengguna untuk mendapatkan token JWT.

-   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "token": "jwt.token.string",
      "data": {
        "user": {
          "_id": "...",
          "email": "user@example.com"
        }
      }
    }
    ```

-   **Response Error:**
    -   `400 Bad Request`: Jika email atau password tidak disediakan.
    -   `401 Unauthorized`: Jika email atau password salah.

### **POST** `/api/auth/forgot-password`

Mengirim token reset password ke email pengguna.

-   **Request Body:**

    ```json
    {
      "email": "user@example.com"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "message": "Password reset token sent to email"
    }
    ```

### **POST** `/api/auth/verify-reset-token`

Memverifikasi validitas token reset password.

-   **Request Body:**

    ```json
    {
      "token": "reset.token.string"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "message": "Token verified successfully"
    }
    ```

### **POST** `/api/auth/reset-password`

Mengatur ulang password pengguna menggunakan token yang valid.

-   **Request Body:**

    ```json
    {
      "token": "reset.token.string",
      "newPassword": "NewPassword123!"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "message": "Password reset successfully"
    }
    ```

---

## 2. Pengguna (`/api/users`)

---

## 3. Klinik (`/api/clinics`)

Endpoint untuk mengelola data klinik.

### **GET** `/api/clinics`

Mendapatkan daftar semua klinik.

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": [
            {
                "_id": "...",
                "nama": "Klinik Sehat Jaya",
                "alamat": "Jl. Kesehatan No. 1",
                "status": "active"
            }
        ],
        "message": "Daftar klinik berhasil diambil"
    }
    ```

### **GET** `/api/clinics/:id`

Mendapatkan detail satu klinik berdasarkan ID.

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": {
            "_id": "...",
            "nama": "Klinik Sehat Jaya",
            "alamat": "Jl. Kesehatan No. 1",
            "no_telepon": "021-1234567",
            "email": "info@kliniksehatjaya.com",
            "status": "active"
        },
        "message": "Klinik berhasil ditemukan"
    }
    ```

### **POST** `/api/clinics`

Membuat klinik baru (memerlukan hak akses **admin**).

-   **Request Body:**

    ```json
    {
        "nama": "Klinik Medika Utama",
        "alamat": "Jl. Merdeka No. 10",
        "no_telepon": "021-7654321",
        "email": "contact@medikautama.com"
    }
    ```

-   **Response Sukses (201):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data klinik yang baru dibuat
        "message": "Klinik berhasil ditambahkan"
    }
    ```

### **PUT** `/api/clinics/:id`

Memperbarui data klinik (memerlukan hak akses **admin**).

-   **Request Body:**

    ```json
    {
        "nama": "Klinik Medika Utama Updated",
        "status": "inactive"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data klinik yang sudah diupdate
        "message": "Data klinik berhasil diperbarui"
    }
    ```

### **DELETE** `/api/clinics/:id`

Menghapus klinik (memerlukan hak akses **admin**).

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": null,
        "message": "Klinik berhasil dihapus"
    }
    ```

---

## 4. Dokter (`/api/doctors`)

Endpoint untuk mengelola data dokter.

### **GET** `/api/doctors`

Mendapatkan daftar semua dokter.

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": [
            {
                "_id": "...",
                "nama": "Dr. Budi Santoso",
                "nomor_str": "123456789012",
                "spesialisasi_id": "...",
                "status": "active"
            }
        ],
        "message": "Daftar dokter berhasil diambil"
    }
    ```

### **GET** `/api/doctors/:id`

Mendapatkan detail satu dokter berdasarkan ID.

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Detail lengkap data dokter
        "message": "Dokter berhasil ditemukan"
    }
    ```

### **POST** `/api/doctors`

Membuat profil dokter baru (memerlukan otentikasi sebagai **user** dengan role dokter).

-   **Request Body:**

    ```json
    {
        "nama": "Dr. Citra Lestari",
        "nomor_str": "098765432109",
        "spesialisasi_id": "...",
        "biaya_konsultasi": 150000,
        "bio": "Dokter spesialis anak."
    }
    ```

-   **Response Sukses (201):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data dokter yang baru dibuat
        "message": "Dokter berhasil ditambahkan"
    }
    ```

### **PUT** `/api/doctors/:id`

Memperbarui data dokter (hanya bisa dilakukan oleh dokter yang bersangkutan atau **admin**).

-   **Request Body:**

    ```json
    {
        "biaya_konsultasi": 175000,
        "status": "inactive"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data dokter yang sudah diupdate
        "message": "Data dokter berhasil diperbarui"
    }
    ```

### **DELETE** `/api/doctors/:id`

Menghapus data dokter (memerlukan hak akses **admin**).

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": null,
        "message": "Dokter berhasil dihapus"
    }
    ```

---

## 5. Pasien (`/api/patients`)

Endpoint untuk mengelola data pasien.

### **GET** `/api/patients`

Mendapatkan daftar semua pasien (memerlukan hak akses **admin**).

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": [
            {
                "_id": "...",
                "nama": "Rina Amelia",
                "nik": "...",
                "no_telepon": "081234567890"
            }
        ],
        "message": "Daftar pasien berhasil diambil"
    }
    ```

### **GET** `/api/patients/:id`

Mendapatkan detail satu pasien berdasarkan ID (hanya bisa diakses oleh pasien yang bersangkutan atau **admin**).

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Detail lengkap data pasien
        "message": "Pasien berhasil ditemukan"
    }
    ```

### **POST** `/api/patients`

Membuat profil pasien baru (memerlukan otentikasi sebagai **user** dengan role pasien).

-   **Request Body:**

    ```json
    {
        "nama": "Budi Hartono",
        "nik": "1234567890123456",
        "tanggal_lahir": "1990-01-15",
        "jenis_kelamin": "Laki-laki",
        "alamat": "Jl. Sejahtera No. 20",
        "no_telepon": "089876543210"
    }
    ```

-   **Response Sukses (201):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data pasien yang baru dibuat
        "message": "Pasien berhasil ditambahkan"
    }
    ```

### **PUT** `/api/patients/:id`

Memperbarui data pasien (hanya bisa dilakukan oleh pasien yang bersangkutan atau **admin**).

-   **Request Body:**

    ```json
    {
        "alamat": "Jl. Bahagia No. 30",
        "no_telepon": "081122334455"
    }
    ```

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": { ... }, // Data pasien yang sudah diupdate
        "message": "Data pasien berhasil diperbarui"
    }
    ```

### **DELETE** `/api/patients/:id`

Menghapus data pasien (memerlukan hak akses **admin**).

-   **Response Sukses (200):**

    ```json
    {
        "status": "success",
        "data": null,
        "message": "Pasien berhasil dihapus"
    }
    ```


Endpoint untuk mengelola data pengguna. Memerlukan hak akses **admin**.

### **GET** `/api/users`

Mendapatkan daftar semua pengguna dengan paginasi, filter, dan sorting.

-   **Query Params (Opsional):**
    -   `page`: Nomor halaman.
    -   `limit`: Jumlah data per halaman.
    -   `sort`: Field untuk sorting (misal: `createdAt`, `-email`).
    -   `email[regex]`: Filter berdasarkan email.

-   **Headers:**
    -   `Authorization`: `Bearer <jwt.token.string>`

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "data": {
        "data": [
          {
            "_id": "...",
            "email": "admin@example.com",
            "role": { "nama_peran": "admin" },
            "is_active": true
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 10
      },
      "message": "Users berhasil diambil"
    }
    ```

### **GET** `/api/users/:id`

Mendapatkan detail satu pengguna berdasarkan ID.

-   **Headers:**
    -   `Authorization`: `Bearer <jwt.token.string>`

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "data": {
        "_id": "...",
        "email": "user@example.com",
        "role": { "nama_peran": "pasien" },
        "is_active": true
      },
      "message": "User berhasil ditemukan"
    }
    ```

-   **Response Error:**
    -   `404 Not Found`: Jika user dengan ID tersebut tidak ditemukan.

### **POST** `/api/users`

Membuat pengguna baru (biasanya dilakukan oleh admin).

-   **Request Body:** (Sama seperti register)
-   **Headers:**
    -   `Authorization`: `Bearer <jwt.token.string>`

-   **Response Sukses (201):**

    ```json
    {
      "status": "success",
      "data": { ... },
      "message": "User berhasil ditambahkan"
    }
    ```

### **PUT** `/api/users/:id`

Memperbarui data pengguna.

-   **Request Body:**

    ```json
    {
      "email": "new.email@example.com",
      "is_active": false
    }
    ```

-   **Headers:**
    -   `Authorization`: `Bearer <jwt.token.string>`

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "data": { ... }, // Data user yang sudah diupdate
      "message": "User berhasil diperbarui"
    }
    ```

### **DELETE** `/api/users/:id`

Menghapus pengguna.

-   **Headers:**
    -   `Authorization`: `Bearer <jwt.token.string>`

-   **Response Sukses (200):**

    ```json
    {
      "status": "success",
      "data": null,
      "message": "User berhasil dihapus"
    }
    ```
