
# Skema Database Harmoni Sehat

Dokumen ini memberikan detail lengkap mengenai setiap koleksi (tabel) dalam database MongoDB yang digunakan oleh aplikasi Harmoni Sehat. Setiap skema didefinisikan menggunakan Mongoose.

---

## Daftar Isi

1.  [ActivityLog](#activitylog)
2.  [Admin](#admin)
3.  [Apoteker](#apoteker)
4.  [ChatMessage](#chatmessage)
5.  [Clinic](#clinic)
6.  [Consultation](#consultation)
7.  [DoctorClinic](#doctorclinic)
8.  [DoctorReview](#doctorreview)
9.  [Dokter](#dokter)
10. [Drug](#drug)
11. [DrugCart](#drugcart)
12. [DrugOrder](#drugorder)
13. [DrugOrderDetail](#drugorderdetail)
14. [HealthArticle](#healtharticle)
15. [Media](#media)
16. [MedicalRecord](#medicalrecord)
17. [Notification](#notification)
18. [Pasien](#pasien)
19. [PaymentMethod](#paymentmethod)
20. [Pharmacist](#pharmacist)
21. [PracticeSchedule](#practiceschedule)
22. [Prescription](#prescription)
23. [PrescriptionDrug](#prescriptiondrug)
24. [RefreshToken](#refreshtoken)
25. [Role](#role)
26. [Specialization](#specialization)
27. [Transaction](#transaction)
28. [User](#user)
29. [UserProfile](#userprofile)
30. [UserRole](#userrole)

---

## 1. `ActivityLog`

Mencatat semua aktivitas penting yang dilakukan oleh pengguna dalam sistem.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID pengguna yang melakukan aktivitas. | `ref: 'User'`, `required` |
| `aksi` | `String` | Jenis aksi yang dilakukan (misal: "LOGIN", "CREATE_USER"). | `required` |
| `deskripsi` | `String` | Deskripsi detail dari aktivitas. | Opsional |
| `timestamp` | `Date` | Waktu saat aktivitas dicatat. | `default: Date.now` |

---

## 2. `Admin`

Menyimpan data administrator sistem.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | ID unik untuk admin (custom). | `default: generateCustomId('04', ...)` |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `nama` | `String` | Nama lengkap admin. | `required` |

---

## 3. `Apoteker`

Menyimpan data apoteker.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | ID unik untuk apoteker (custom). | `default: generateCustomId('20', ...)` |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `nama` | `String` | Nama lengkap apoteker. | `required` |
| `nomor_sipa` | `String` | Nomor Surat Izin Praktek Apoteker. | `required`, `unique` |

---

## 4. `ChatMessage`

Menyimpan riwayat pesan dalam sebuah sesi konsultasi.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `konsultasi_id` | `ObjectId` | ID dari sesi konsultasi. | `ref: 'Consultation'`, `required` |
| `pengirim_id` | `ObjectId` | ID pengguna (pasien/dokter) yang mengirim pesan. | `ref: 'User'`, `required` |
| `isi` | `String` | Konten pesan. | `required` |
| `tipe` | `String` | Tipe pesan. | `enum: ['text', 'image', 'file']` |
| `file_url` | `String` | URL file jika tipe bukan 'text'. | Opsional |
| `is_read` | `Boolean` | Status apakah pesan sudah dibaca. | `default: false` |
| `timestamp` | `Date` | Waktu pesan dikirim. | `default: Date.now` |

---

## 5. `Clinic`

Menyimpan data klinik atau rumah sakit tempat dokter praktek.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `nama` | `String` | Nama klinik. | `required`, `unique` |
| `alamat` | `String` | Alamat lengkap klinik. | `required` |
| `no_telepon` | `String` | Nomor telepon klinik. | `required` |
| `email` | `String` | Alamat email klinik. | `unique`, opsional |
| `status` | `String` | Status operasional klinik. | `enum: ['active', 'inactive']`, `default: 'active'` |

---

## 6. `Consultation`

Menyimpan data sesi konsultasi antara pasien dan dokter.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pasien_id` | `ObjectId` | ID pasien yang berkonsultasi. | `ref: 'Pasien'`, `required` |
| `dokter_id` | `ObjectId` | ID dokter yang melayani. | `ref: 'Dokter'`, `required` |
| `jadwal_id` | `ObjectId` | ID jadwal praktek yang digunakan. | `ref: 'PracticeSchedule'`, `required` |
| `tanggal` | `Date` | Tanggal dan waktu konsultasi. | `required` |
| `status` | `String` | Status sesi konsultasi. | `enum: ['pending', 'scheduled', 'completed', 'cancelled']` |
| `keluhan` | `String` | Keluhan utama pasien. | `required` |
| `diagnosa` | `String` | Diagnosa dari dokter. | Opsional |
| `tindakan` | `String` | Tindakan medis yang diberikan. | Opsional |
| `catatan_dokter` | `String` | Catatan tambahan dari dokter. | Opsional |
| `video_call_url` | `String` | URL untuk video call. | Opsional |

---

## 7. `DoctorClinic`

Tabel pivot untuk relasi antara dokter dan klinik (many-to-many).

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `dokter_id` | `String` | ID dokter. | `ref: 'Dokter'`, `required` |
| `klinik_id` | `ObjectId` | ID klinik. | `ref: 'Clinic'`, `required` |
| `status` | `String` | Status hubungan dokter dan klinik. | `enum: ['active', 'inactive']`, `default: 'active'` |

---

## 8. `DoctorReview`

Menyimpan ulasan dan rating yang diberikan pasien kepada dokter setelah konsultasi.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pasien_id` | `ObjectId` | ID pasien yang memberi ulasan. | `ref: 'Pasien'`, `required` |
| `dokter_id` | `ObjectId` | ID dokter yang diulas. | `ref: 'Dokter'`, `required` |
| `konsultasi_id` | `ObjectId` | ID konsultasi terkait. | `ref: 'Consultation'`, `required`, `unique` |
| `rating` | `Number` | Rating bintang (1-5). | `required`, `min: 1`, `max: 5` |
| `komentar` | `String` | Komentar atau ulasan teks. | Opsional |
| `balasan` | `String` | Balasan dari dokter. | Opsional |
| `sentimen` | `String` | Analisis sentimen dari komentar. | `enum: ['positive', 'negative', 'neutral']` |

---

## 9. `Dokter`

Menyimpan data dokter.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | ID unik untuk dokter (custom). | `default: generateCustomId('10', ...)` |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `nama` | `String` | Nama lengkap dokter. | `required` |
| `nomor_str` | `String` | Nomor Surat Tanda Registrasi. | `required`, `unique` |
| `spesialisasi_id` | `ObjectId` | ID spesialisasi dokter. | `ref: 'Specialization'`, opsional |
| `biaya_konsultasi` | `Number` | Biaya untuk satu sesi konsultasi. | `required`, `min: 0` |
| `foto` | `String` | URL foto profil dokter. | Opsional |
| `bio` | `String` | Biografi singkat dokter. | Opsional |
| `status` | `String` | Status keaktifan dokter. | `enum: ['active', 'inactive']`, `default: 'active'` |

---

## 10. `Drug`

Menyimpan data obat yang tersedia di apotek.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `nama` | `String` | Nama obat. | `required`, `unique` |
| `deskripsi` | `String` | Deskripsi singkat obat. | Opsional |
| `kategori` | `String` | Kategori obat. | `required` |
| `stok` | `Number` | Jumlah stok yang tersedia. | `required`, `min: 0` |
| `satuan` | `String` | Satuan obat (misal: "tablet", "botol"). | `required` |
| `harga` | `Number` | Harga per satuan. | `required`, `min: 0` |
| `kode_obat` | `String` | Kode unik untuk obat. | `required`, `unique` |
| `butuh_resep` | `Boolean` | Apakah obat memerlukan resep dokter. | `default: false` |
| `tgl_kadaluarsa` | `Date` | Tanggal kadaluarsa obat. | `required` |

---

## 11. `DrugCart`

Menyimpan data keranjang belanja obat untuk setiap pasien.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pasien_id` | `String` | ID pasien. | `ref: 'Pasien'`, `required` |
| `obat_id` | `ObjectId` | ID obat yang ditambahkan. | `ref: 'Drug'`, `required` |
| `jumlah` | `Number` | Jumlah obat yang dibeli. | `required`, `min: 1` |

---

## 12. `DrugOrder`

Menyimpan data pesanan obat oleh pasien.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pasien_id` | `String` | ID pasien yang memesan. | `ref: 'Pasien'`, `required` |
| `kode_pesanan` | `String` | Kode unik untuk setiap pesanan. | `required`, `unique` |
| `total_harga` | `Number` | Total harga dari pesanan. | `required`, `min: 0` |
| `status` | `String` | Status pesanan. | `enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']` |
| `alamat_pengiriman` | `String` | Alamat tujuan pengiriman. | `required` |

---

## 13. `DrugOrderDetail`

Menyimpan detail item obat dalam setiap pesanan.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pesanan_id` | `ObjectId` | ID dari pesanan. | `ref: 'DrugOrder'`, `required` |
| `obat_id` | `ObjectId` | ID obat yang dipesan. | `ref: 'Drug'`, `required` |
| `jumlah` | `Number` | Jumlah obat yang dipesan. | `required`, `min: 1` |
| `harga_satuan` | `Number` | Harga obat saat dipesan. | `required`, `min: 0` |
| `subtotal` | `Number` | Total harga untuk item ini. | `required`, `min: 0` |

---

## 14. `HealthArticle`

Menyimpan artikel kesehatan yang ditulis oleh admin atau dokter.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `judul` | `String` | Judul artikel. | `required` |
| `slug` | `String` | URL-friendly dari judul. | `required`, `unique` |
| `konten` | `String` | Isi lengkap artikel. | `required` |
| `penulis_id` | `ObjectId` | ID penulis (admin/dokter). | `ref: 'User'`, `required` |
| `status_publikasi` | `String` | Status publikasi artikel. | `enum: ['draft', 'published', 'archived']` |

---

## 15. `Media`

Menyimpan informasi file media yang di-upload (polimorfik).

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `model_type` | `String` | Nama model yang berelasi (misal: 'User'). | `required` |
| `model_id` | `ObjectId` | ID dari record pada model yang berelasi. | `required` |
| `url` | `String` | URL publik dari file media. | `required` |
| `mime_type` | `String` | Tipe MIME dari file. | `required` |
| `size` | `Number` | Ukuran file dalam bytes. | `required`, `min: 0` |

---

## 16. `MedicalRecord`

Menyimpan rekam medis pasien.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `pasien_id` | `ObjectId` | ID pasien. | `ref: 'Pasien'`, `required` |
| `tanggal_rekam_medis` | `Date` | Tanggal pencatatan rekam medis. | `default: Date.now` |
| `diagnosis` | `String` | Diagnosis penyakit. | `required` |
| `catatan_dokter` | `String` | Catatan dari dokter. | Opsional |
| `resep_id` | `ObjectId` | ID resep yang diberikan. | `ref: 'Prescription'`, opsional |
| `riwayat_penyakit` | `[String]` | Daftar riwayat penyakit pasien. | Opsional |
| `alergi` | `[String]` | Daftar alergi yang dimiliki pasien. | Opsional |
| `tinggi_badan` | `Number` | Tinggi badan pasien (cm). | Opsional |
| `berat_badan` | `Number` | Berat badan pasien (kg). | Opsional |
| `tekanan_darah` | `String` | Tekanan darah (misal: "120/80"). | Opsional |
| `suhu_tubuh` | `Number` | Suhu tubuh pasien (°C). | Opsional |

---

## 17. `Notification`

Menyimpan notifikasi yang dikirimkan kepada pengguna.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID pengguna penerima notifikasi. | `ref: 'User'`, `required` |
| `judul` | `String` | Judul notifikasi. | `required` |
| `isi` | `String` | Konten notifikasi. | `required` |
| `tipe` | `String` | Tipe notifikasi. | `enum: ['info', 'warning', 'error', 'success']` |
| `is_read` | `Boolean` | Status apakah notifikasi sudah dibaca. | `default: false` |

---

## 18. `Pasien`

Menyimpan data pasien.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | ID unik untuk pasien (custom). | `default: generateCustomId('08', ...)` |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `nama` | `String` | Nama lengkap pasien. | `required` |
| `nik` | `String` | Nomor Induk Kependudukan. | `required`, `unique`, `length: 16` |
| `tanggal_lahir` | `Date` | Tanggal lahir pasien. | `required` |
| `jenis_kelamin` | `String` | Jenis kelamin pasien. | `enum: ['Laki-laki', 'Perempuan']` |
| `alamat` | `String` | Alamat tempat tinggal pasien. | `required` |
| `no_telepon` | `String` | Nomor telepon pasien. | `required` |

---

## 19. `PaymentMethod`

Menyimpan metode pembayaran yang tersedia.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `nama` | `String` | Nama metode pembayaran (misal: "Virtual Account BCA"). | `required`, `unique` |
| `kode` | `String` | Kode unik untuk metode pembayaran. | `required`, `unique` |
| `deskripsi` | `String` | Deskripsi singkat. | Opsional |
| `is_active` | `Boolean` | Status keaktifan metode pembayaran. | `default: true` |

---

## 20. `Pharmacist`

Menyimpan data apoteker/farmasis.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `nama` | `String` | Nama lengkap apoteker. | `required` |
| `nomor_sipa` | `String` | Nomor Surat Izin Praktek Apoteker. | `required`, `unique` |

---

## 21. `PracticeSchedule`

Menyimpan jadwal praktek dokter di berbagai klinik.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `dokter_id` | `String` | ID dokter. | `ref: 'Dokter'`, `required` |
| `klinik_id` | `ObjectId` | ID klinik tempat praktek. | `ref: 'Clinic'`, `required` |
| `hari` | `String` | Hari praktek. | `enum: ['Senin', ..., 'Minggu']` |
| `jam_mulai` | `String` | Jam mulai praktek (format HH:mm). | `required` |
| `jam_selesai` | `String` | Jam selesai praktek (format HH:mm). | `required` |
| `is_active` | `Boolean` | Status keaktifan jadwal. | `default: true` |

---

## 22. `Prescription`

Menyimpan data resep obat yang dikeluarkan oleh dokter.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `konsultasi_id` | `ObjectId` | ID konsultasi terkait. | `ref: 'Consultation'`, `required`, `unique` |
| `catatan` | `String` | Catatan tambahan untuk resep. | Opsional |
| `status` | `String` | Status resep. | `enum: ['active', 'inactive', 'expired']` |
| `expired_at` | `Date` | Tanggal kadaluarsa resep. | `required` |

---

## 23. `PrescriptionDrug`

Menyimpan detail item obat dalam sebuah resep.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `resep_id` | `ObjectId` | ID dari resep. | `ref: 'Prescription'`, `required` |
| `obat_id` | `ObjectId` | ID obat yang diresepkan. | `ref: 'Drug'`, `required` |
| `dosis` | `String` | Dosis penggunaan obat. | `required` |
| `jumlah` | `Number` | Jumlah obat yang diberikan. | `required`, `min: 1` |
| `aturan_pakai` | `String` | Aturan pemakaian obat. | `required` |

---

## 24. `RefreshToken`

Menyimpan refresh token untuk otentikasi JWT.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID pengguna pemilik token. | `ref: 'User'`, `required` |
| `token` | `String` | Refresh token itu sendiri. | `required`, `unique` |
| `expired_at` | `Date` | Waktu kadaluarsa token. | `required` |

---

## 25. `Role`

Menyimpan daftar peran (role) pengguna dalam sistem.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `nama_peran` | `String` | Nama peran (misal: "admin", "dokter", "pasien"). | `required`, `unique` |

---

## 26. `Specialization`

Menyimpan daftar spesialisasi dokter.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `nama` | `String` | Nama spesialisasi (misal: "Penyakit Dalam"). | `required`, `unique` |
| `deskripsi` | `String` | Deskripsi singkat spesialisasi. | Opsional |
| `is_active` | `Boolean` | Status keaktifan spesialisasi. | `default: true` |

---

## 27. `Transaction`

Menyimpan data transaksi pembayaran (polimorfik).

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID pengguna yang melakukan transaksi. | `ref: 'User'`, `required` |
| `total_biaya` | `Number` | Jumlah total yang dibayarkan. | `required`, `min: 0` |
| `status` | `String` | Status transaksi. | `enum: ['pending', 'completed', 'failed', 'refunded']` |
| `metode_pembayaran_id` | `ObjectId` | ID metode pembayaran yang digunakan. | `ref: 'PaymentMethod'`, `required` |
| `external_id` | `String` | ID transaksi dari payment gateway. | Opsional |
| `transaksiable_id` | `ObjectId` | ID dari record yang berelasi. | `required` |
| `transaksiable_type` | `String` | Nama model yang berelasi (misal: 'Consultation'). | `required` |

---

## 28. `User`

Koleksi utama yang menyimpan data login semua pengguna.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `email` | `String` | Alamat email untuk login. | `required`, `unique` |
| `password` | `String` | Kata sandi yang sudah di-hash. | `required`, `select: false` |
| `is_active` | `Boolean` | Status keaktifan akun. | `default: true` |
| `role` | `ObjectId` | ID peran pengguna. | `ref: 'Role'`, `required` |
| `passwordResetToken` | `String` | Token untuk reset password. | Opsional |
| `passwordResetExpires` | `Date` | Waktu kadaluarsa token reset. | Opsional |

---

## 29. `UserProfile`

Menyimpan data profil tambahan untuk pengguna.

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID dari koleksi `User`. | `ref: 'User'`, `required`, `unique` |
| `foto` | `String` | URL foto profil. | Opsional |
| `bio` | `String` | Biografi singkat pengguna. | Opsional |

---

## 30. `UserRole`

Tabel pivot untuk relasi antara pengguna dan peran (many-to-many).

| Field | Tipe Data | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `user_id` | `ObjectId` | ID pengguna. | `ref: 'User'`, `required` |
| `peran_id` | `ObjectId` | ID peran. | `ref: 'Role'`, `required` |
