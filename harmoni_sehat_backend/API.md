# Dokumentasi RESTful API Harmoni Sehat

Dokumen ini menyediakan daftar lengkap endpoint RESTful API yang tersedia untuk proyek Harmoni Sehat. API ini dirancang untuk memungkinkan interaksi penuh (CRUD) dengan data backend, serta menyediakan endpoint relasional untuk mengakses data yang saling terhubung.

## Struktur URL Dasar

Semua endpoint API memiliki prefiks dasar:

`http://localhost:3000/api` (atau URL dasar server Anda)

## Fitur Umum

-   **Pagination**: Untuk endpoint `GET` yang mengembalikan daftar, Anda dapat menggunakan parameter query `page` dan `limit`.
    Contoh: `GET /api/users?page=1&limit=10`
-   **Filtering/Search**: Untuk endpoint `GET` yang mengembalikan daftar, Anda dapat menggunakan parameter query `search` untuk mencari berdasarkan kolom tertentu (misalnya, nama, email, dll.).
    Contoh: `GET /api/users?search=john`
-   **Error Handling**: Semua error akan dikembalikan dalam format JSON dengan `statusCode` dan `message` yang jelas.
    Contoh respons error:
    ```json
    {
      "statusCode": 404,
      "message": "User not found"
    }
    ```

## Daftar Endpoint

### 1. Spesialisasi (`/api/spesialisasi`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua spesialisasi    | Tidak ada                                         | `[{ "spesialisasi_id": 1, "nama_spesialisasi": "Jantung", ... }]` |
| `GET`  | `/:id`        | Mengambil spesialisasi berdasarkan ID | Tidak ada                                         | `{ "spesialisasi_id": 1, "nama_spesialisasi": "Jantung", ... }` |
| `POST` | `/`           | Membuat spesialisasi baru       | `{ "nama_spesialisasi": "Gigi", "deskripsi": "..." }` | `{ "spesialisasi_id": 2, "nama_spesialisasi": "Gigi", ... }` |
| `PUT`  | `/:id`        | Memperbarui spesialisasi        | `{ "nama_spesialisasi": "Gigi Anak" }`           | `{ "spesialisasi_id": 2, "nama_spesialisasi": "Gigi Anak", ... }` |
| `DELETE`| `/:id`        | Menghapus spesialisasi          | Tidak ada                                         | `Status: 204 No Content`                              |

### 2. Users (`/api/users`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua pengguna        | Tidak ada                                         | `[{ "user_id": 1, "email": "test@example.com", ... }]` |
| `GET`  | `/:id`        | Mengambil pengguna berdasarkan ID | Tidak ada                                         | `{ "user_id": 1, "email": "test@example.com", ... }` |
| `POST` | `/`           | Membuat pengguna baru           | `{ "email": "new@example.com", "password_hash": "password123", "role": "pasien" }` | `{ "user_id": 2, "email": "new@example.com", ... }` |\n| `PUT`  | `/:id`        | Memperbarui pengguna            | `{ "email": "updated@example.com" }`            | `{ "user_id": 1, "email": "updated@example.com", ... }` |
| `DELETE`| `/:id`        | Menghapus pengguna              | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/promos` | Mengambil semua promo yang dimiliki pengguna berdasarkan ID pengguna | `[{ "user_promo_id": 1, "promo_id": 101, "nama_promo": "Diskon Awal Tahun", ... }]` |

### 3. Pasien (`/api/pasien`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data pasien     | Tidak ada                                         | `[{ "pasien_id": 1, "nama_lengkap": "Budi Santoso", ... }]` |
| `GET`  | `/:id`        | Mengambil data pasien berdasarkan ID | Tidak ada                                         | `{ "pasien_id": 1, "nama_lengkap": "Budi Santoso", ... }` |
| `POST` | `/`           | Membuat data pasien baru        | `{ "user_id": 1, "nama_lengkap": "Budi Santoso", "tanggal_lahir": "1990-01-01", "jenis_kelamin": "L", "no_ktp": "1234567890123456" }` | `{ "pasien_id": 2, "nama_lengkap": "Budi Santoso", ... }` |
| `PUT`  | `/:id`        | Memperbarui data pasien         | `{ "nama_lengkap": "Budi Santoso Updated" }`    | `{ "pasien_id": 1, "nama_lengkap": "Budi Santoso Updated", ... }` |
| `DELETE`| `/:id`        | Menghapus data pasien           | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/konsultasi`| Mengambil semua konsultasi yang terkait dengan pasien berdasarkan ID pasien | `[{ "konsultasi_id": 1, "keluhan_utama": "Sakit kepala", ... }]` |

### 4. Doctors (`/api/doctors`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data dokter     | Tidak ada                                         | `[{ "doctor_id": 1, "nama_lengkap": "Dr. Siti Aminah", ... }]` |
| `GET`  | `/:id`        | Mengambil data dokter berdasarkan ID | Tidak ada                                         | `{ "doctor_id": 1, "nama_lengkap": "Dr. Siti Aminah", ... }` |
| `POST` | `/`           | Membuat data dokter baru        | `{ "user_id": 2, "nama_lengkap": "Dr. Budi", "no_sip": "SIP123", "spesialisasi_id": 1, "pengalaman_tahun": 5, "tarif_konsultasi": 150000, "rumah_sakit_id": 1 }` | `{ "doctor_id": 2, "nama_lengkap": "Dr. Budi", ... }` |
| `PUT`  | `/:id`        | Memperbarui data dokter         | `{ "pengalaman_tahun": 7 }`                       | `{ "doctor_id": 1, "pengalaman_tahun": 7, ... }` |
| `DELETE`| `/:id`        | Menghapus data dokter           | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/jadwal` | Mengambil semua jadwal praktik dokter berdasarkan ID dokter | `[{ "jadwal_id": 1, "hari": "senin", "jam_mulai": "09:00:00", ... }]` |
| `GET`  | `/:id/konsultasi`| Mengambil semua konsultasi yang terkait dengan dokter berdasarkan ID dokter | `[{ "konsultasi_id": 1, "keluhan_utama": "Demam", ... }]` |

### 5. Provinsi (`/api/provinsi`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua provinsi        | Tidak ada                                         | `[{ "provinsi_id": 1, "nama_provinsi": "Jawa Barat", ... }]` |
| `GET`  | `/:id`        | Mengambil provinsi berdasarkan ID | Tidak ada                                         | `{ "provinsi_id": 1, "nama_provinsi": "Jawa Barat", ... }` |
| `POST` | `/`           | Membuat provinsi baru           | `{ "nama_provinsi": "Banten", "kode_provinsi": "BT" }` | `{ "provinsi_id": 2, "nama_provinsi": "Banten", ... }` |
| `PUT`  | `/:id`        | Memperbarui provinsi            | `{ "nama_provinsi": "Banten Raya" }`            | `{ "provinsi_id": 2, "nama_provinsi": "Banten Raya", ... }` |
| `DELETE`| `/:id`        | Menghapus provinsi              | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/kota`   | Mengambil semua kota di provinsi berdasarkan ID provinsi | `[{ "kota_id": 1, "nama_kota": "Bandung", ... }]` |

### 6. Kota (`/api/kota`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua kota            | Tidak ada                                         | `[{ "kota_id": 1, "nama_kota": "Bandung", ... }]` |
| `GET`  | `/:id`        | Mengambil kota berdasarkan ID   | Tidak ada                                         | `{ "kota_id": 1, "nama_kota": "Bandung", ... }` |
| `POST` | `/`           | Membuat kota baru               | `{ "provinsi_id": 1, "nama_kota": "Bekasi", "kode_kota": "BKS" }` | `{ "kota_id": 2, "nama_kota": "Bekasi", ... }` |
| `PUT`  | `/:id`        | Memperbarui kota                | `{ "nama_kota": "Bekasi Kota" }`                | `{ "kota_id": 2, "nama_kota": "Bekasi Kota", ... }` |
| `DELETE`| `/:id`        | Menghapus kota                  | Tidak ada                                         | `Status: 204 No Content`                              |

### 7. Admin (`/api/admin`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data admin      | Tidak ada                                         | `[{ "admin_id": 1, "nama_lengkap": "Admin Utama", ... }]` |
| `GET`  | `/:id`        | Mengambil data admin berdasarkan ID | Tidak ada                                         | `{ "admin_id": 1, "nama_lengkap": "Admin Utama", ... }` |
| `POST` | `/`           | Membuat data admin baru         | `{ "user_id": 3, "nama_lengkap": "Admin Baru", "level_akses": "admin" }` | `{ "admin_id": 2, "nama_lengkap": "Admin Baru", ... }` |
| `PUT`  | `/:id`        | Memperbarui data admin          | `{ "level_akses": "super_admin" }`              | `{ "admin_id": 1, "level_akses": "super_admin", ... }` |
| `DELETE`| `/:id`        | Menghapus data admin            | Tidak ada                                         | `Status: 204 No Content`                              |

### 8. Apotek (`/api/apotek`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data apotek     | Tidak ada                                         | `[{ "apotek_id": 1, "nama_apotek": "Apotek Sehat", ... }]` |
| `GET`  | `/:id`        | Mengambil data apotek berdasarkan ID | Tidak ada                                         | `{ "apotek_id": 1, "nama_apotek": "Apotek Sehat", ... }` |
| `POST` | `/`           | Membuat data apotek baru        | `{ "nama_apotek": "Apotek Jaya", "alamat": "Jl. Merdeka No. 10" }` | `{ "apotek_id": 2, "nama_apotek": "Apotek Jaya", ... }` |
| `PUT`  | `/:id`        | Memperbarui data apotek         | `{ "no_telepon": "08123456789" }`               | `{ "apotek_id": 1, "no_telepon": "08123456789", ... }` |
| `DELETE`| `/:id`        | Menghapus data apotek           | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/apoteker`| Mengambil semua apoteker yang bekerja di apotek berdasarkan ID apotek | `[{ "apoteker_id": 1, "nama_lengkap": "Budi Apoteker", ... }]` |

### 9. Apoteker (`/api/apoteker`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data apoteker   | Tidak ada                                         | `[{ "apoteker_id": 1, "nama_lengkap": "Budi Apoteker", ... }]` |
| `GET`  | `/:id`        | Mengambil data apoteker berdasarkan ID | Tidak ada                                         | `{ "apoteker_id": 1, "nama_lengkap": "Budi Apoteker", ... }` |
| `POST` | `/`           | Membuat data apoteker baru      | `{ "user_id": 4, "nama_lengkap": "Siti Apoteker", "no_sipa": "SIPA001", "apotek_id": 1 }` | `{ "apoteker_id": 2, "nama_lengkap": "Siti Apoteker", ... }` |
| `PUT`  | `/:id`        | Memperbarui data apoteker       | `{ "is_verified": true }`                       | `{ "apoteker_id": 1, "is_verified": true, ... }` |
| `DELETE`| `/:id`        | Menghapus data apoteker         | Tidak ada                                         | `Status: 204 No Content`                              |

### 10. Kategori Artikel (`/api/kategori_artikel`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua kategori artikel | Tidak ada                                         | `[{ "kategori_id": 1, "nama_kategori": "Kesehatan Umum", ... }]` |
| `GET`  | `/:id`        | Mengambil kategori artikel berdasarkan ID | Tidak ada                                         | `{ "kategori_id": 1, "nama_kategori": "Kesehatan Umum", ... }` |
| `POST` | `/`           | Membuat kategori artikel baru   | `{ "nama_kategori": "Gizi", "deskripsi": "Artikel tentang gizi seimbang" }` | `{ "kategori_id": 2, "nama_kategori": "Gizi", ... }` |
| `PUT`  | `/:id`        | Memperbarui kategori artikel    | `{ "nama_kategori": "Gizi Anak" }`             | `{ "kategori_id": 1, "nama_kategori": "Gizi Anak", ... }` |
| `DELETE`| `/:id`        | Menghapus kategori artikel      | Tidak ada                                         | `Status: 204 No Content`                              |

### 11. Artikel Kesehatan (`/api/artikel_kesehatan`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua artikel kesehatan | Tidak ada                                         | `[{ "artikel_id": 1, "judul": "Manfaat Tidur Cukup", ... }]` |
| `GET`  | `/:id`        | Mengambil artikel kesehatan berdasarkan ID | Tidak ada                                         | `{ "artikel_id": 1, "judul": "Manfaat Tidur Cukup", ... }` |
| `POST` | `/`           | Membuat artikel kesehatan baru  | `{ "judul": "Tips Hidup Sehat", "slug": "tips-hidup-sehat", "konten": "...", "kategori_artikel_id": 1 }` | `{ "artikel_id": 2, "judul": "Tips Hidup Sehat", ... }` |
| `PUT`  | `/:id`        | Memperbarui artikel kesehatan   | `{ "views": 100 }`                               | `{ "artikel_id": 1, "views": 100, ... }` |
| `DELETE`| `/:id`        | Menghapus artikel kesehatan     | Tidak ada                                         | `Status: 204 No Content`                              |

### 12. FAQ (`/api/faq`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua FAQ             | Tidak ada                                         | `[{ "faq_id": 1, "pertanyaan": "Bagaimana cara konsultasi?", ... }]` |
| `GET`  | `/:id`        | Mengambil FAQ berdasarkan ID    | Tidak ada                                         | `{ "faq_id": 1, "pertanyaan": "Bagaimana cara konsultasi?", ... }` |
| `POST` | `/`           | Membuat FAQ baru                | `{ "pertanyaan": "Apa itu telemedisin?", "jawaban": "Telemedisin adalah ..." }` | `{ "faq_id": 2, "pertanyaan": "Apa itu telemedisin?", ... }` |
| `PUT`  | `/:id`        | Memperbarui FAQ                 | `{ "kategori": "Umum" }`                        | `{ "faq_id": 1, "kategori": "Umum", ... }` |
| `DELETE`| `/:id`        | Menghapus FAQ                   | Tidak ada                                         | `Status: 204 No Content`                              |

### 13. Kategori Obat (`/api/kategori_obat`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua kategori obat   | Tidak ada                                         | `[{ "kategori_id": 1, "nama_kategori": "Analgesik", ... }]` |
| `GET`  | `/:id`        | Mengambil kategori obat berdasarkan ID | Tidak ada                                         | `{ "kategori_id": 1, "nama_kategori": "Analgesik", ... }` |
| `POST` | `/`           | Membuat kategori obat baru      | `{ "nama_kategori": "Antibiotik", "deskripsi": "Obat untuk infeksi bakteri" }` | `{ "kategori_id": 2, "nama_kategori": "Antibiotik", ... }` |
| `PUT`  | `/:id`        | Memperbarui kategori obat       | `{ "nama_kategori": "Antibiotik Spektrum Luas" }` | `{ "kategori_id": 1, "nama_kategori": "Antibiotik Spektrum Luas", ... }` |
| `DELETE`| `/:id`        | Menghapus kategori obat         | Tidak ada                                         | `Status: 204 No Content`                              |

### 14. Kurir (`/api/kurir`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data kurir      | Tidak ada                                         | `[{ "kurir_id": 1, "nama_kurir": "Joko Cepat", ... }]` |
| `GET`  | `/:id`        | Mengambil data kurir berdasarkan ID | Tidak ada                                         | `{ "kurir_id": 1, "nama_kurir": "Joko Cepat", ... }` |
| `POST` | `/`           | Membuat data kurir baru         | `{ "nama_kurir": "Bambang Kilat", "no_telepon": "08111222333", "kendaraan": "motor" }` | `{ "kurir_id": 2, "nama_kurir": "Bambang Kilat", ... }` |
| `PUT`  | `/:id`        | Memperbarui data kurir          | `{ "rating": 4.8 }`                               | `{ "kurir_id": 1, "rating": 4.8, ... }` |
| `DELETE`| `/:id`        | Menghapus data kurir            | Tidak ada                                         | `Status: 204 No Content`                              |

### 15. Obat (`/api/obat`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data obat       | Tidak ada                                         | `[{ "obat_id": 1, "nama_obat": "Paracetamol", ... }]` |
| `GET`  | `/:id`        | Mengambil data obat berdasarkan ID | Tidak ada                                         | `{ "obat_id": 1, "nama_obat": "Paracetamol", ... }` |
| `POST` | `/`           | Membuat data obat baru          | `{ "nama_obat": "Amoxicillin", "kategori_obat_id": 2, "bentuk_obat": "kapsul", "harga": 5000 }` | `{ "obat_id": 2, "nama_obat": "Amoxicillin", ... }` |
| `PUT`  | `/:id`        | Memperbarui data obat           | `{ "harga": 6000 }`                               | `{ "obat_id": 1, "harga": 6000, ... }` |
| `DELETE`| `/:id`        | Menghapus data obat             | Tidak ada                                         | `Status: 204 No Content`                              |

### 16. Promo (`/api/promo`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data promo      | Tidak ada                                         | `[{ "promo_id": 1, "kode_promo": "DISKON10", ... }]` |
| `GET`  | `/:id`        | Mengambil data promo berdasarkan ID | Tidak ada                                         | `{ "promo_id": 1, "kode_promo": "DISKON10", ... }` |
| `POST` | `/`           | Membuat data promo baru         | `{ "kode_promo": "GRATISONGKIR", "nama_promo": "Gratis Ongkir", "tipe_diskon": "free_shipping", "nilai_diskon": 0, "tanggal_mulai": "2024-01-01", "tanggal_berakhir": "2024-12-31" }` | `{ "promo_id": 2, "kode_promo": "GRATISONGKIR", ... }` |
| `PUT`  | `/:id`        | Memperbarui data promo          | `{ "is_active": false }`                          | `{ "promo_id": 1, "is_active": false, ... }` |
| `DELETE`| `/:id`        | Menghapus data promo            | Tidak ada                                         | `Status: 204 No Content`                              |

### 17. Rumah Sakit (`/api/rumah_sakit`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data rumah sakit | Tidak ada                                         | `[{ "rumah_sakit_id": 1, "nama_rumah_sakit": "RSUD Sejahtera", ... }]` |
| `GET`  | `/:id`        | Mengambil data rumah sakit berdasarkan ID | Tidak ada                                         | `{ "rumah_sakit_id": 1, "nama_rumah_sakit": "RSUD Sejahtera", ... }` |
| `POST` | `/`           | Membuat data rumah sakit baru   | `{ "nama_rumah_sakit": "RS Harapan", "alamat": "Jl. Damai No. 5", "tipe_rumah_sakit": "swasta", "kelas_rumah_sakit": "B" }` | `{ "rumah_sakit_id": 2, "nama_rumah_sakit": "RS Harapan", ... }` |
| `PUT`  | `/:id`        | Memperbarui data rumah sakit    | `{ "no_telepon": "021-123456" }`                 | `{ "rumah_sakit_id": 1, "no_telepon": "021-123456", ... }` |
| `DELETE`| `/:id`        | Menghapus data rumah sakit      | Tidak ada                                         | `Status: 204 No Content`                              |

### 18. Klinik (`/api/klinik`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data klinik     | Tidak ada                                         | `[{ "klinik_id": 1, "nama_klinik": "Klinik Sehat Bersama", ... }]` |
| `GET`  | `/:id`        | Mengambil data klinik berdasarkan ID | Tidak ada                                         | `{ "klinik_id": 1, "nama_klinik": "Klinik Sehat Bersama", ... }` |
| `POST` | `/`           | Membuat data klinik baru        | `{ "nama_klinik": "Klinik Keluarga", "alamat": "Jl. Bahagia No. 7", "tipe_klinik": "pratama" }` | `{ "klinik_id": 2, "nama_klinik": "Klinik Keluarga", ... }` |
| `PUT`  | `/:id`        | Memperbarui data klinik         | `{ "is_24_jam": true }`                          | `{ "klinik_id": 1, "is_24_jam": true, ... }` |
| `DELETE`| `/:id`        | Menghapus data klinik           | Tidak ada                                         | `Status: 204 No Content`                              |

### 19. Konsultasi (`/api/konsultasi`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data konsultasi | Tidak ada                                         | `[{ "konsultasi_id": 1, "keluhan_utama": "Sakit tenggorokan", ... }]` |
| `GET`  | `/:id`        | Mengambil data konsultasi berdasarkan ID | Tidak ada                                         | `{ "konsultasi_id": 1, "keluhan_utama": "Sakit tenggorokan", ... }` |
| `POST` | `/`           | Membuat data konsultasi baru    | `{ "pasien_id": 1, "doctor_id": 1, "keluhan_utama": "Batuk pilek", "tanggal_konsultasi": "2024-07-05T10:00:00Z", "status": "pending", "jenis_konsultasi": "chat" }` | `{ "konsultasi_id": 2, "keluhan_utama": "Batuk pilek", ... }` |
| `PUT`  | `/:id`        | Memperbarui data konsultasi     | `{ "status": "completed", "diagnosa": "Flu biasa" }` | `{ "konsultasi_id": 1, "status": "completed", ... }` |
| `DELETE`| `/:id`        | Menghapus data konsultasi       | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/resep`  | Mengambil resep yang terkait dengan konsultasi berdasarkan ID konsultasi | `{ "resep_id": 1, "kode_resep": "RSP001", ... }` |
| `GET`  | `/:id/pembayaran`| Mengambil pembayaran yang terkait dengan konsultasi berdasarkan ID konsultasi | `{ "pembayaran_id": 1, "kode_pembayaran": "PAY001", ... }` |

### 20. Resep (`/api/resep`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data resep      | Tidak ada                                         | `[{ "resep_id": 1, "kode_resep": "RSP001", ... }]` |
| `GET`  | `/:id`        | Mengambil data resep berdasarkan ID | Tidak ada                                         | `{ "resep_id": 1, "kode_resep": "RSP001", ... }` |
| `POST` | `/`           | Membuat data resep baru         | `{ "konsultasi_id": 1, "doctor_id": 1, "pasien_id": 1, "kode_resep": "RSP002", "status": "pending" }` | `{ "resep_id": 2, "kode_resep": "RSP002", ... }` |
| `PUT`  | `/:id`        | Memperbarui data resep          | `{ "status": "delivered" }`                     | `{ "resep_id": 1, "status": "delivered", ... }` |
| `DELETE`| `/:id`        | Menghapus data resep            | Tidak ada                                         | `Status: 204 No Content`                              |

**Endpoint Relasional:**

| Method | Endpoint      | Deskripsi                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :-------------------------------------- | :---------------------------------------------------- |
| `GET`  | `/:id/detail_resep`| Mengambil detail resep yang terkait dengan resep berdasarkan ID resep | `[{ "detail_id": 1, "obat_id": 1, "jumlah": 2, ... }]` |
| `GET`  | `/:id/pembayaran`| Mengambil pembayaran yang terkait dengan resep berdasarkan ID resep | `{ "pembayaran_id": 1, "kode_pembayaran": "PAY001", ... }` |

### 21. Pembayaran (`/api/pembayaran`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data pembayaran | Tidak ada                                         | `[{ "pembayaran_id": 1, "kode_pembayaran": "PAY001", ... }]` |
| `GET`  | `/:id`        | Mengambil data pembayaran berdasarkan ID | Tidak ada                                         | `{ "pembayaran_id": 1, "kode_pembayaran": "PAY001", ... }` |
| `POST` | `/`           | Membuat data pembayaran baru    | `{ "pasien_id": 1, "kode_pembayaran": "PAY002", "jenis_pembayaran": "konsultasi", "jumlah_bayar": 100000, "total_bayar": 100000, "metode_pembayaran": "transfer", "status_pembayaran": "pending" }` | `{ "pembayaran_id": 2, "kode_pembayaran": "PAY002", ... }` |
| `PUT`  | `/:id`        | Memperbarui data pembayaran     | `{ "status_pembayaran": "success" }`           | `{ "pembayaran_id": 1, "status_pembayaran": "success", ... }` |
| `DELETE`| `/:id`        | Menghapus data pembayaran       | Tidak ada                                         | `Status: 204 No Content`                              |

### 22. System Settings (`/api/system_settings`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua pengaturan sistem | Tidak ada                                         | `[{ "setting_id": 1, "setting_key": "APP_NAME", ... }]` |
| `GET`  | `/:id`        | Mengambil pengaturan sistem berdasarkan ID | Tidak ada                                         | `{ "setting_id": 1, "setting_key": "APP_NAME", ... }` |
| `POST` | `/`           | Membuat pengaturan sistem baru  | `{ "setting_key": "MAX_USERS", "setting_value": "1000", "setting_type": "number" }` | `{ "setting_id": 2, "setting_key": "MAX_USERS", ... }` |
| `PUT`  | `/:id`        | Memperbarui pengaturan sistem   | `{ "setting_value": "2000" }`                   | `{ "setting_id": 1, "setting_value": "2000", ... }` |
| `DELETE`| `/:id`        | Menghapus pengaturan sistem     | Tidak ada                                         | `Status: 204 No Content`                              |

### 23. Stok Obat (`/api/stok_obat`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua stok obat       | Tidak ada                                         | `[{ "stok_id": 1, "obat_id": 1, "apotek_id": 1, "jumlah_stok": 100, ... }]` |
| `GET`  | `/:id`        | Mengambil stok obat berdasarkan ID | Tidak ada                                         | `{ "stok_id": 1, "obat_id": 1, "apotek_id": 1, "jumlah_stok": 100, ... }` |
| `POST` | `/`           | Membuat stok obat baru          | `{ "obat_id": 2, "apotek_id": 1, "jumlah_stok": 50 }` | `{ "stok_id": 2, "obat_id": 2, "apotek_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui stok obat           | `{ "jumlah_stok": 75 }`                           | `{ "stok_id": 1, "jumlah_stok": 75, ... }` |
| `DELETE`| `/:id`        | Menghapus stok obat             | Tidak ada                                         | `Status: 204 No Content`                              |

### 24. Pengiriman (`/api/pengiriman`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua data pengiriman | Tidak ada                                         | `[{ "pengiriman_id": 1, "resep_id": 1, "status_pengiriman": "pending", ... }]` |
| `GET`  | `/:id`        | Mengambil data pengiriman berdasarkan ID | Tidak ada                                         | `{ "pengiriman_id": 1, "resep_id": 1, "status_pengiriman": "pending", ... }` |
| `POST` | `/`           | Membuat data pengiriman baru    | `{ "resep_id": 2, "alamat_pengiriman": "Jl. Contoh No. 1", "status_pengiriman": "pending" }` | `{ "pengiriman_id": 2, "resep_id": 2, ... }` |
| `PUT`  | `/:id`        | Memperbarui data pengiriman     | `{ "status_pengiriman": "delivered" }`         | `{ "pengiriman_id": 1, "status_pengiriman": "delivered", ... }` |
| `DELETE`| `/:id`        | Menghapus data pengiriman       | Tidak ada                                         | `Status: 204 No Content`                              |

### 25. Detail Resep (`/api/detail_resep`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua detail resep    | Tidak ada                                         | `[{ "detail_id": 1, "resep_id": 1, "obat_id": 1, "jumlah": 2, ... }]` |
| `GET`  | `/:id`        | Mengambil detail resep berdasarkan ID | Tidak ada                                         | `{ "detail_id": 1, "resep_id": 1, "obat_id": 1, "jumlah": 2, ... }` |
| `POST` | `/`           | Membuat detail resep baru       | `{ "resep_id": 1, "obat_id": 2, "jumlah": 1, "dosis": "1x sehari" }` | `{ "detail_id": 2, "resep_id": 1, "obat_id": 2, ... }` |
| `PUT`  | `/:id`        | Memperbarui detail resep        | `{ "jumlah": 3 }`                                 | `{ "detail_id": 1, "jumlah": 3, ... }` |
| `DELETE`| `/:id`        | Menghapus detail resep          | Tidak ada                                         | `Status: 204 No Content`                              |

### 26. Medical Record (`/api/medical_record`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua rekam medis     | Tidak ada                                         | `[{ "record_id": 1, "pasien_id": 1, "doctor_id": 1, "tanggal_rekam": "2024-07-01", ... }]` |
| `GET`  | `/:id`        | Mengambil rekam medis berdasarkan ID | Tidak ada                                         | `{ "record_id": 1, "pasien_id": 1, "doctor_id": 1, "tanggal_rekam": "2024-07-01", ... }` |
| `POST` | `/`           | Membuat rekam medis baru        | `{ "pasien_id": 1, "doctor_id": 1, "tanggal_rekam": "2024-07-06", "anamnesis": "Pasien mengeluh pusing" }` | `{ "record_id": 2, "pasien_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui rekam medis         | `{ "diagnosa_utama": "Vertigo" }`               | `{ "record_id": 1, "diagnosa_utama": "Vertigo", ... }` |
| `DELETE`| `/:id`        | Menghapus rekam medis           | Tidak ada                                         | `Status: 204 No Content`                              |

### 27. Vital Signs (`/api/vital_signs`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua tanda vital     | Tidak ada                                         | `[{ "vital_id": 1, "pasien_id": 1, "tanggal_periksa": "2024-07-01T09:00:00Z", ... }]` |
| `GET`  | `/:id`        | Mengambil tanda vital berdasarkan ID | Tidak ada                                         | `{ "vital_id": 1, "pasien_id": 1, "tanggal_periksa": "2024-07-01T09:00:00Z", ... }` |
| `POST` | `/`           | Membuat tanda vital baru        | `{ "pasien_id": 1, "tanggal_periksa": "2024-07-06T10:00:00Z", "tekanan_darah_sistolik": 120, "tekanan_darah_diastolik": 80, "denyut_nadi": 75, "suhu_tubuh": 36.5, "respiratory_rate": 18, "berat_badan": 60.5, "tinggi_badan": 170.0, "bmi": 20.9, "saturasi_oksigen": 98.0 }` | `{ "vital_id": 2, "pasien_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui tanda vital         | `{ "suhu_tubuh": 37.0 }`                         | `{ "vital_id": 1, "suhu_tubuh": 37.0, ... }` |
| `DELETE`| `/:id`        | Menghapus tanda vital           | Tidak ada                                         | `Status: 204 No Content`                              |

### 28. Notifikasi (`/api/notifikasi`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua notifikasi      | Tidak ada                                         | `[{ "notifikasi_id": 1, "user_id": 1, "judul": "Konsultasi Baru", ... }]` |
| `GET`  | `/:id`        | Mengambil notifikasi berdasarkan ID | Tidak ada                                         | `{ "notifikasi_id": 1, "user_id": 1, "judul": "Konsultasi Baru", ... }` |
| `POST` | `/`           | Membuat notifikasi baru         | `{ "user_id": 1, "judul": "Promo Spesial", "isi": "Dapatkan diskon 20%", "tipe": "promo" }` | `{ "notifikasi_id": 2, "user_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui notifikasi          | `{ "is_read": true }`                             | `{ "notifikasi_id": 1, "is_read": true, ... }` |
| `DELETE`| `/:id`        | Menghapus notifikasi            | Tidak ada                                         | `Status: 204 No Content`                              |

### 29. Review Rating (`/api/review_rating`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua review rating   | Tidak ada                                         | `[{ "review_id": 1, "konsultasi_id": 1, "reviewer_id": 1, "rating": 5, ... }]` |
| `GET`  | `/:id`        | Mengambil review rating berdasarkan ID | Tidak ada                                         | `{ "review_id": 1, "konsultasi_id": 1, "reviewer_id": 1, "rating": 5, ... }` |
| `POST` | `/`           | Membuat review rating baru      | `{ "konsultasi_id": 1, "reviewer_id": 1, "reviewed_id": 2, "rating": 4, "review_type": "doctor" }` | `{ "review_id": 2, "konsultasi_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui review rating       | `{ "review_text": "Sangat membantu" }`          | `{ "review_id": 1, "review_text": "Sangat membantu", ... }` |
| `DELETE`| `/:id`        | Menghapus review rating         | Tidak ada                                         | `Status: 204 No Content`                              |

### 30. Feedback (`/api/feedback`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua feedback        | Tidak ada                                         | `[{ "feedback_id": 1, "user_id": 1, "tipe_feedback": "bug", ... }]` |
| `GET`  | `/:id`        | Mengambil feedback berdasarkan ID | Tidak ada                                         | `{ "feedback_id": 1, "user_id": 1, "tipe_feedback": "bug", ... }` |
| `POST` | `/`           | Membuat feedback baru           | `{ "user_id": 1, "tipe_feedback": "suggestion", "judul": "Fitur baru", "deskripsi": "Tambahkan fitur ..." }` | `{ "feedback_id": 2, "user_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui feedback            | `{ "status": "resolved" }`                      | `{ "feedback_id": 1, "status": "resolved", ... }` |
| `DELETE`| `/:id`        | Menghapus feedback              | Tidak ada                                         | `Status: 204 No Content`                              |

### 31. Chat Messages (`/api/chat_messages`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua pesan chat      | Tidak ada                                         | `[{ "message_id": 1, "konsultasi_id": 1, "sender_id": 1, "message_text": "Halo dokter", ... }]` |
| `GET`  | `/:id`        | Mengambil pesan chat berdasarkan ID | Tidak ada                                         | `{ "message_id": 1, "konsultasi_id": 1, "sender_id": 1, "message_text": "Halo dokter", ... }` |
| `POST` | `/`           | Membuat pesan chat baru         | `{ "konsultasi_id": 1, "sender_id": 1, "message_text": "Bagaimana kabar Anda?", "message_type": "text" }` | `{ "message_id": 2, "konsultasi_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui pesan chat          | `{ "is_read": true }`                             | `{ "message_id": 1, "is_read": true, ... }` |
| `DELETE`| `/:id`        | Menghapus pesan chat            | Tidak ada                                         | `Status: 204 No Content`                              |

### 32. Jadwal Doctor (`/api/jadwal_doctor`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua jadwal dokter   | Tidak ada                                         | `[{ "jadwal_id": 1, "doctor_id": 1, "hari": "senin", "jam_mulai": "09:00:00", ... }]` |
| `GET`  | `/:id`        | Mengambil jadwal dokter berdasarkan ID | Tidak ada                                         | `{ "jadwal_id": 1, "doctor_id": 1, "hari": "senin", "jam_mulai": "09:00:00", ... }` |
| `POST` | `/`           | Membuat jadwal dokter baru      | `{ "doctor_id": 1, "hari": "selasa", "jam_mulai": "10:00:00", "jam_selesai": "12:00:00" }` | `{ "jadwal_id": 2, "doctor_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui jadwal dokter       | `{ "is_available": false }`                      | `{ "jadwal_id": 1, "is_available": false, ... }` |
| `DELETE`| `/:id`        | Menghapus jadwal dokter         | Tidak ada                                         | `Status: 204 No Content`                              |

### 33. Appointment (`/api/appointment`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua janji temu      | Tidak ada                                         | `[{ "appointment_id": 1, "pasien_id": 1, "doctor_id": 1, "tanggal_appointment": "2024-07-10", ... }]` |
| `GET`  | `/:id`        | Mengambil janji temu berdasarkan ID | Tidak ada                                         | `{ "appointment_id": 1, "pasien_id": 1, "doctor_id": 1, "tanggal_appointment": "2024-07-10", ... }` |
| `POST` | `/`           | Membuat janji temu baru         | `{ "pasien_id": 1, "doctor_id": 1, "tanggal_appointment": "2024-07-15", "jam_appointment": "14:00:00", "keluhan": "Sakit gigi", "status": "scheduled" }` | `{ "appointment_id": 2, "pasien_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui janji temu          | `{ "status": "confirmed" }`                     | `{ "appointment_id": 1, "status": "confirmed", ... }` |
| `DELETE`| `/:id`        | Menghapus janji temu            | Tidak ada                                         | `Status: 204 No Content`                              |

### 34. Logs (`/api/logs`)

| Method | Endpoint      | Deskripsi                       | Request Body (JSON)                               | Contoh Respons (Sukses)                               |
| :----- | :------------ | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------- |
| `GET`  | `/`           | Mengambil semua log             | Tidak ada                                         | `[{ "log_id": 1, "user_id": 1, "action": "login", ... }]` |
| `GET`  | `/:id`        | Mengambil log berdasarkan ID    | Tidak ada                                         | `{ "log_id": 1, "user_id": 1, "action": "login", ... }` |
| `POST` | `/`           | Membuat log baru                | `{ "user_id": 1, "action": "create_user", "table_name": "users", "record_id": 5 }` | `{ "log_id": 2, "user_id": 1, ... }` |
| `PUT`  | `/:id`        | Memperbarui log                 | `{ "action": "update_user" }`                   | `{ "log_id": 1, "action": "update_user", ... }` |
| `DELETE`| `/:id`        | Menghapus log                   | Tidak ada                                         | `Status: 204 No Content`                              |
