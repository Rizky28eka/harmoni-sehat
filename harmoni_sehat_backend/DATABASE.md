# Dokumentasi Skema Database Harmoni Sehat

Dokumen ini menjelaskan struktur database untuk proyek Harmoni Sehat, termasuk tabel, kolom, tipe data, dan relasi antar tabel.

## Gambaran Umum

Database Harmoni Sehat dirancang untuk mendukung fungsionalitas aplikasi kesehatan, mencakup manajemen pengguna, informasi medis, layanan konsultasi, apotek, obat-obatan, dan log sistem. Relasi antar tabel dibangun untuk memastikan integritas data dan mendukung operasi bisnis yang kompleks.

## Konvensi Penamaan

-   Nama tabel dan kolom menggunakan `snake_case`.
-   Primary key diberi nama `[nama_tabel]_id`.
-   Foreign key diberi nama `[nama_tabel_referensi]_id`.

## Struktur Tabel dan Entitas

Berikut adalah daftar tabel utama dalam database, beserta kolom, tipe data, dan deskripsinya:

### `provinsi`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `provinsi_id` | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_provinsi` | `VARCHAR(255)` | Nama provinsi, unik, tidak boleh null    |
| `kode_provinsi` | `VARCHAR(10)`  | Kode provinsi, unik                      |
| `is_active`   | `BOOLEAN`      | Status aktif provinsi (default: true)    |

### `kota`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `kota_id`     | `INTEGER`      | Primary Key, Auto-increment              |
| `provinsi_id` | `INTEGER`      | Foreign Key ke `provinsi.provinsi_id`    |
| `nama_kota`   | `VARCHAR(255)` | Nama kota, tidak boleh null              |
| `kode_kota`   | `VARCHAR(10)`  | Kode kota, unik                          |
| `is_active`   | `BOOLEAN`      | Status aktif kota (default: true)        |

### `users`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `user_id`       | `INTEGER`      | Primary Key, Auto-increment              |
| `email`         | `VARCHAR(255)` | Email pengguna, unik, tidak boleh null   |
| `password_hash` | `VARCHAR(255)` | Hash password, tidak boleh null          |
| `phone`         | `VARCHAR(20)`  | Nomor telepon pengguna                   |
| `role`          | `ENUM`         | Peran pengguna (pasien, doctor, apoteker, admin), tidak boleh null |
| `is_active`     | `BOOLEAN`      | Status aktif pengguna (default: true)    |
| `is_verified`   | `BOOLEAN`      | Status verifikasi pengguna (default: false) |
| `last_login`    | `DATETIME`     | Waktu login terakhir                     |
| `created_at`    | `DATETIME`     | Waktu pembuatan record                   |
| `updated_at`    | `DATETIME`     | Waktu terakhir record diperbarui         |

### `admin`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `admin_id`    | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`     | `INTEGER`      | Foreign Key ke `users.user_id`, unik     |
| `nama_lengkap`| `VARCHAR(255)` | Nama lengkap admin, tidak boleh null     |
| `level_akses` | `ENUM`         | Level akses admin (super_admin, admin, moderator), tidak boleh null |
| `foto_profil` | `VARCHAR(255)` | URL foto profil admin                    |
| `departemen`  | `VARCHAR(100)` | Departemen admin                         |

### `apotek`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `apotek_id`     | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_apotek`   | `VARCHAR(255)` | Nama apotek, tidak boleh null            |
| `alamat`        | `TEXT`         | Alamat lengkap apotek                    |
| `no_telepon`    | `VARCHAR(20)`  | Nomor telepon apotek                     |
| `email`         | `VARCHAR(255)` | Email apotek, unik                       |
| `jam_buka`      | `TIME`         | Jam buka apotek                          |
| `jam_tutup`     | `TIME`         | Jam tutup apotek                         |
| `koordinat_lat` | `DECIMAL(10,8)`| Koordinat Latitude apotek                |
| `koordinat_lng` | `DECIMAL(11,8)`| Koordinat Longitude apotek               |
| `foto_apotek`   | `VARCHAR(255)` | URL foto apotek                          |
| `is_24_jam`     | `BOOLEAN`      | Apotek buka 24 jam (default: false)      |
| `is_active`     | `BOOLEAN`      | Status aktif apotek (default: true)      |
| `rating`        | `DECIMAL(3,2)` | Rating apotek (default: 0.00)            |

### `apoteker`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `apoteker_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`       | `INTEGER`      | Foreign Key ke `users.user_id`, unik     |
| `nama_lengkap`  | `VARCHAR(255)` | Nama lengkap apoteker, tidak boleh null  |
| `no_sipa`       | `VARCHAR(50)`  | Nomor SIPA apoteker, unik                |
| `apotek_id`     | `INTEGER`      | Foreign Key ke `apotek.apotek_id`        |
| `is_verified`   | `BOOLEAN`      | Status verifikasi apoteker (default: false) |
| `foto_profil`   | `VARCHAR(255)` | URL foto profil apoteker                 |

### `kategori_artikel`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `kategori_id` | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_kategori` | `VARCHAR(255)` | Nama kategori artikel, unik, tidak boleh null |
| `deskripsi`   | `TEXT`         | Deskripsi kategori                       |
| `icon`        | `VARCHAR(255)` | Icon kategori                            |
| `is_active`   | `BOOLEAN`      | Status aktif kategori (default: true)    |

### `artikel_kesehatan`

| Kolom               | Tipe Data      | Keterangan                               |
| :------------------ | :------------- | :--------------------------------------- |
| `artikel_id`        | `INTEGER`      | Primary Key, Auto-increment              |
| `judul`             | `VARCHAR(255)` | Judul artikel, tidak boleh null          |
| `slug`              | `VARCHAR(255)` | Slug URL artikel, unik, tidak boleh null |
| `konten`            | `TEXT`         | Isi konten artikel                       |
| `kategori_artikel_id`| `INTEGER`      | Foreign Key ke `kategori_artikel.kategori_id` |
| `penulis`           | `VARCHAR(255)` | Nama penulis artikel                     |
| `gambar_utama`      | `VARCHAR(255)` | URL gambar utama artikel                 |
| `tags`              | `JSON`         | Tag artikel dalam format JSON            |
| `meta_description`  | `TEXT`         | Deskripsi meta untuk SEO                 |
| `views`             | `INTEGER`      | Jumlah tampilan artikel (default: 0)     |
| `likes`             | `INTEGER`      | Jumlah suka artikel (default: 0)         |
| `is_featured`       | `BOOLEAN`      | Artikel unggulan (default: false)        |
| `is_published`      | `BOOLEAN`      | Status publikasi artikel (default: false) |
| `tanggal_publish`   | `DATETIME`     | Tanggal publikasi artikel                |
| `created_at`        | `DATETIME`     | Waktu pembuatan record                   |
| `updated_at`        | `DATETIME`     | Waktu terakhir record diperbarui         |

### `faq`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `faq_id`      | `INTEGER`      | Primary Key, Auto-increment              |
| `pertanyaan`  | `TEXT`         | Pertanyaan FAQ, tidak boleh null         |
| `jawaban`     | `TEXT`         | Jawaban FAQ, tidak boleh null            |
| `kategori`    | `VARCHAR(100)` | Kategori FAQ                             |
| `urutan`      | `INTEGER`      | Urutan tampilan FAQ (default: 0)         |
| `is_active`   | `BOOLEAN`      | Status aktif FAQ (default: true)         |
| `views`       | `INTEGER`      | Jumlah tampilan FAQ (default: 0)         |
| `created_at`  | `DATETIME`     | Waktu pembuatan record                   |

### `kategori_obat`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `kategori_id` | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_kategori` | `VARCHAR(255)` | Nama kategori obat, unik, tidak boleh null |
| `deskripsi`   | `TEXT`         | Deskripsi kategori                       |
| `icon`        | `VARCHAR(255)` | Icon kategori                            |
| `is_active`   | `BOOLEAN`      | Status aktif kategori (default: true)    |

### `kurir`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `kurir_id`    | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_kurir`  | `VARCHAR(255)` | Nama kurir, tidak boleh null             |
| `no_telepon`  | `VARCHAR(20)`  | Nomor telepon kurir, unik                |
| `email`       | `VARCHAR(255)` | Email kurir, unik                        |
| `kendaraan`   | `ENUM`         | Jenis kendaraan kurir (motor, mobil, sepeda) |
| `nomor_plat`  | `VARCHAR(20)`  | Nomor plat kendaraan                     |
| `foto_profil` | `VARCHAR(255)` | URL foto profil kurir                    |
| `rating`      | `DECIMAL(3,2)` | Rating kurir (default: 0.00)             |
| `is_active`   | `BOOLEAN`      | Status aktif kurir (default: true)       |
| `area_layanan`| `JSON`         | Area layanan kurir dalam format JSON     |

### `logs`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `log_id`      | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`     | `INTEGER`      | Foreign Key ke `users.user_id`           |
| `action`      | `VARCHAR(255)` | Aksi yang dilakukan, tidak boleh null    |
| `table_name`  | `VARCHAR(255)` | Nama tabel yang terpengaruh              |
| `record_id`   | `INTEGER`      | ID record yang terpengaruh               |
| `old_data`    | `JSON`         | Data lama sebelum perubahan              |
| `new_data`    | `JSON`         | Data baru setelah perubahan              |
| `ip_address`  | `VARCHAR(45)`  | Alamat IP pengguna                       |
| `user_agent`  | `TEXT`         | User agent pengguna                      |
| `created_at`  | `DATETIME`     | Waktu pembuatan log                      |

### `obat`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `obat_id`         | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_obat`       | `VARCHAR(255)` | Nama obat, tidak boleh null              |
| `nama_generik`    | `VARCHAR(255)` | Nama generik obat                        |
| `kategori_obat_id`| `INTEGER`      | Foreign Key ke `kategori_obat.kategori_id` |
| `bentuk_obat`     | `ENUM`         | Bentuk obat (tablet, kapsul, sirup, salep, injeksi, tetes) |
| `kandungan`       | `TEXT`         | Kandungan obat                           |
| `deskripsi`       | `TEXT`         | Deskripsi obat                           |
| `indikasi`        | `TEXT`         | Indikasi penggunaan obat                 |
| `kontraindikasi`  | `TEXT`         | Kontraindikasi penggunaan obat           |
| `efek_samping`    | `TEXT`         | Efek samping obat                        |
| `dosis_dewasa`    | `TEXT`         | Dosis untuk dewasa                       |
| `dosis_anak`      | `TEXT`         | Dosis untuk anak-anak                    |
| `cara_penyimpanan`| `TEXT`         | Cara penyimpanan obat                    |
| `nomor_bpom`      | `VARCHAR(50)`  | Nomor BPOM obat                          |
| `produsen`        | `VARCHAR(255)` | Produsen obat                            |
| `harga`           | `DECIMAL(10,2)`| Harga obat                               |
| `foto_obat`       | `VARCHAR(255)` | URL foto obat                            |
| `is_resep_dokter` | `BOOLEAN`      | Membutuhkan resep dokter (default: false) |
| `is_active`       | `BOOLEAN`      | Status aktif obat (default: true)        |

### `pasien`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `pasien_id`     | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`       | `INTEGER`      | Foreign Key ke `users.user_id`, unik     |
| `nama_lengkap`  | `VARCHAR(255)` | Nama lengkap pasien, tidak boleh null    |
| `tanggal_lahir` | `DATE`         | Tanggal lahir pasien                     |
| `jenis_kelamin` | `ENUM`         | Jenis kelamin pasien (L/P)               |
| `alamat`        | `TEXT`         | Alamat lengkap pasien                    |
| `no_ktp`        | `VARCHAR(20)`  | Nomor KTP pasien, unik                   |
| `golongan_darah`| `VARCHAR(5)`   | Golongan darah pasien                    |
| `riwayat_alergi`| `TEXT`         | Riwayat alergi pasien                    |
| `kontak_darurat`| `VARCHAR(20)`  | Kontak darurat pasien                    |
| `foto_profil`   | `VARCHAR(255)` | URL foto profil pasien                   |
| `berat_badan`   | `DECIMAL(5,2)` | Berat badan pasien                       |
| `tinggi_badan`  | `DECIMAL(5,2)` | Tinggi badan pasien                      |
| `provinsi_id`   | `INTEGER`      | Foreign Key ke `provinsi.provinsi_id`    |
| `kota_id`       | `INTEGER`      | Foreign Key ke `kota.kota_id`            |

### `promo`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `promo_id`        | `INTEGER`      | Primary Key, Auto-increment              |
| `kode_promo`      | `VARCHAR(50)`  | Kode promo, unik, tidak boleh null       |
| `nama_promo`      | `VARCHAR(255)` | Nama promo, tidak boleh null             |
| `deskripsi`       | `TEXT`         | Deskripsi promo                          |
| `tipe_diskon`     | `ENUM`         | Tipe diskon (percentage, fixed_amount, free_shipping), tidak boleh null |
| `nilai_diskon`    | `DECIMAL(10,2)`| Nilai diskon, tidak boleh null           |
| `minimum_pembelian`| `DECIMAL(10,2)`| Minimum pembelian untuk promo (default: 0.00) |
| `maksimum_diskon` | `DECIMAL(10,2)`| Maksimum diskon yang diberikan           |
| `tanggal_mulai`   | `DATETIME`     | Tanggal mulai promo, tidak boleh null    |
| `tanggal_berakhir`| `DATETIME`     | Tanggal berakhir promo, tidak boleh null |
| `quota_penggunaan`| `INTEGER`      | Kuota penggunaan promo                   |
| `sudah_digunakan` | `INTEGER`      | Jumlah promo yang sudah digunakan (default: 0) |
| `is_active`       | `BOOLEAN`      | Status aktif promo (default: true)       |
| `banner_promo`    | `VARCHAR(255)` | URL banner promo                         |

### `rumah_sakit`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `rumah_sakit_id`  | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_rumah_sakit`| `VARCHAR(255)` | Nama rumah sakit, tidak boleh null       |
| `alamat`          | `TEXT`         | Alamat lengkap rumah sakit               |
| `no_telepon`      | `VARCHAR(20)`  | Nomor telepon rumah sakit                |
| `email`           | `VARCHAR(255)` | Email rumah sakit, unik                  |
| `website`         | `VARCHAR(255)` | Website rumah sakit                      |
| `tipe_rumah_sakit`| `ENUM`         | Tipe rumah sakit (pemerintah, swasta, militer) |
| `kelas_rumah_sakit`| `ENUM`         | Kelas rumah sakit (A, B, C, D)           |
| `koordinat_lat`   | `DECIMAL(10,8)`| Koordinat Latitude rumah sakit           |
| `koordinat_lng`   | `DECIMAL(11,8)`| Koordinat Longitude rumah sakit          |
| `foto_rumah_sakit`| `VARCHAR(255)` | URL foto rumah sakit                     |
| `is_active`       | `BOOLEAN`      | Status aktif rumah sakit (default: true) |

### `spesialisasi`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `spesialisasi_id` | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_spesialisasi`| `VARCHAR(255)` | Nama spesialisasi, unik, tidak boleh null |
| `deskripsi`       | `TEXT`         | Deskripsi spesialisasi                   |
| `icon`            | `VARCHAR(255)` | Icon spesialisasi                        |
| `is_active`       | `BOOLEAN`      | Status aktif spesialisasi (default: true) |

### `doctor`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `doctor_id`       | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`         | `INTEGER`      | Foreign Key ke `users.user_id`, unik     |
| `nama_lengkap`    | `VARCHAR(255)` | Nama lengkap dokter, tidak boleh null    |
| `no_sip`          | `VARCHAR(50)`  | Nomor SIP dokter, unik                   |
| `spesialisasi_id` | `INTEGER`      | Foreign Key ke `spesialisasi.spesialisasi_id` |
| `pengalaman_tahun`| `INTEGER`      | Pengalaman kerja dokter dalam tahun      |
| `tarif_konsultasi`| `DECIMAL(10,2)`| Tarif konsultasi dokter                  |
| `rumah_sakit_id`  | `INTEGER`      | Foreign Key ke `rumah_sakit.rumah_sakit_id` |
| `rating`          | `DECIMAL(3,2)` | Rating dokter (default: 0.00)            |
| `total_konsultasi`| `INTEGER`      | Jumlah total konsultasi dokter (default: 0) |
| `is_verified`     | `BOOLEAN`      | Status verifikasi dokter (default: false) |
| `foto_profil`     | `VARCHAR(255)` | URL foto profil dokter                   |
| `alumnus`         | `VARCHAR(255)` | Alumnus pendidikan dokter                |
| `bio`             | `TEXT`         | Biografi singkat dokter                  |

### `konsultasi`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `konsultasi_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `doctor_id`       | `INTEGER`      | Foreign Key ke `doctor.doctor_id`, tidak boleh null |
| `keluhan_utama`   | `TEXT`         | Keluhan utama pasien                     |
| `riwayat_penyakit`| `TEXT`         | Riwayat penyakit pasien                  |
| `gejala`          | `TEXT`         | Gejala yang dialami pasien               |
| `tanggal_konsultasi`| `DATETIME`     | Tanggal konsultasi, tidak boleh null     |
| `diagnosa`        | `TEXT`         | Diagnosa dokter                          |
| `tindakan`        | `TEXT`         | Tindakan yang diberikan dokter           |
| `catatan_dokter`  | `TEXT`         | Catatan tambahan dari dokter             |
| `status`          | `ENUM`         | Status konsultasi (pending, ongoing, completed, cancelled), tidak boleh null |
| `jenis_konsultasi`| `ENUM`         | Jenis konsultasi (chat, video_call, voice_call), tidak boleh null |
| `durasi_konsultasi`| `INTEGER`      | Durasi konsultasi dalam menit            |
| `biaya`           | `DECIMAL(10,2)`| Biaya konsultasi                         |
| `rating_pasien`   | `INTEGER`      | Rating dari pasien (1-5)                 |
| `review_pasien`   | `TEXT`         | Review dari pasien                       |
| `rating_dokter`   | `INTEGER`      | Rating dari dokter (1-5)                 |

### `resep`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `resep_id`        | `INTEGER`      | Primary Key, Auto-increment              |
| `konsultasi_id`   | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id`, unik |
| `doctor_id`       | `INTEGER`      | Foreign Key ke `doctor.doctor_id`, tidak boleh null |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `apotek_id`       | `INTEGER`      | Foreign Key ke `apotek.apotek_id`        |
| `kode_resep`      | `VARCHAR(50)`  | Kode resep, unik, tidak boleh null       |
| `tanggal_resep`   | `DATETIME`     | Tanggal resep (default: current timestamp) |
| `tanggal_kadaluarsa`| `DATETIME`     | Tanggal kadaluarsa resep                 |
| `catatan_resep`   | `TEXT`         | Catatan tambahan pada resep              |
| `status`          | `ENUM`         | Status resep (pending, confirmed, processed, ready, delivered, cancelled), tidak boleh null |
| `total_harga`     | `DECIMAL(10,2)`| Total harga resep                        |
| `biaya_pengiriman`| `DECIMAL(10,2)`| Biaya pengiriman resep                   |

### `pembayaran`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `pembayaran_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `konsultasi_id`   | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id`, unik |
| `resep_id`        | `INTEGER`      | Foreign Key ke `resep.resep_id`, unik    |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `kode_pembayaran` | `VARCHAR(50)`  | Kode pembayaran, unik, tidak boleh null  |
| `jenis_pembayaran`| `ENUM`         | Jenis pembayaran (konsultasi, obat, keduanya), tidak boleh null |
| `jumlah_bayar`    | `DECIMAL(10,2)`| Jumlah yang dibayar, tidak boleh null    |
| `biaya_admin`     | `DECIMAL(10,2)`| Biaya admin (default: 0.00)              |
| `total_bayar`     | `DECIMAL(10,2)`| Total yang harus dibayar, tidak boleh null |
| `metode_pembayaran`| `ENUM`         | Metode pembayaran (transfer, ewallet, va, kartu_kredit, cod), tidak boleh null |
| `status_pembayaran`| `ENUM`         | Status pembayaran (pending, success, failed, refunded, expired), tidak boleh null |
| `tanggal_pembayaran`| `DATETIME`     | Tanggal pembayaran (default: current timestamp) |
| `tanggal_kadaluarsa`| `DATETIME`     | Tanggal kadaluarsa pembayaran            |
| `payment_gateway_id`| `VARCHAR(255)` | ID transaksi dari payment gateway        |
| `bukti_pembayaran`| `VARCHAR(255)` | URL bukti pembayaran                     |

### `user_promo`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `user_promo_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`         | `INTEGER`      | Foreign Key ke `users.user_id`, tidak boleh null |
| `promo_id`        | `INTEGER`      | Foreign Key ke `promo.promo_id`, tidak boleh null |
| `pembayaran_id`   | `INTEGER`      | Foreign Key ke `pembayaran.pembayaran_id`, unik |
| `tanggal_digunakan`| `DATETIME`     | Tanggal promo digunakan (default: current timestamp) |
| `nilai_diskon_diterima`| `DECIMAL(10,2)`| Nilai diskon yang diterima               |

### `system_settings`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `setting_id`    | `INTEGER`      | Primary Key, Auto-increment              |
| `setting_key`   | `VARCHAR(255)` | Kunci pengaturan, unik, tidak boleh null |
| `setting_value` | `TEXT`         | Nilai pengaturan                         |
| `setting_type`  | `ENUM`         | Tipe data pengaturan (string, number, boolean, json), tidak boleh null |
| `description`   | `TEXT`         | Deskripsi pengaturan                     |
| `is_public`     | `BOOLEAN`      | Dapat diakses publik (default: false)    |
| `created_at`    | `DATETIME`     | Waktu pembuatan record                   |
| `updated_at`    | `DATETIME`     | Waktu terakhir record diperbarui         |

### `stok_obat`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `stok_id`         | `INTEGER`      | Primary Key, Auto-increment              |
| `obat_id`         | `INTEGER`      | Foreign Key ke `obat.obat_id`, tidak boleh null |
| `apotek_id`       | `INTEGER`      | Foreign Key ke `apotek.apotek_id`, tidak boleh null |
| `jumlah_stok`     | `INTEGER`      | Jumlah stok obat, tidak boleh null       |
| `stok_minimum`    | `INTEGER`      | Stok minimum (default: 0)                |
| `tanggal_kadaluarsa`| `DATE`         | Tanggal kadaluarsa obat                  |
| `harga_jual`      | `DECIMAL(10,2)`| Harga jual obat                          |
| `is_available`    | `BOOLEAN`      | Obat tersedia (default: true)            |
| `updated_at`      | `DATETIME`     | Waktu terakhir record diperbarui         |

### `pengiriman`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `pengiriman_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `resep_id`        | `INTEGER`      | Foreign Key ke `resep.resep_id`, unik, tidak boleh null |
| `kurir_id`        | `INTEGER`      | Foreign Key ke `kurir.kurir_id`          |
| `alamat_pengiriman`| `TEXT`         | Alamat pengiriman, tidak boleh null      |
| `koordinat_lat`   | `DECIMAL(10,8)`| Koordinat Latitude pengiriman            |
| `koordinat_lng`   | `DECIMAL(11,8)`| Koordinat Longitude pengiriman           |
| `tanggal_kirim`   | `DATETIME`     | Tanggal pengiriman                       |
| `estimasi_tiba`   | `DATETIME`     | Estimasi tanggal tiba                    |
| `tanggal_terima`  | `DATETIME`     | Tanggal penerimaan barang                |
| `status_pengiriman`| `ENUM`         | Status pengiriman (pending, picked_up, on_delivery, delivered, returned), tidak boleh null |
| `catatan_pengiriman`| `TEXT`         | Catatan pengiriman                       |
| `foto_bukti_terima`| `VARCHAR(255)` | URL foto bukti penerimaan                |
| `biaya_pengiriman`| `DECIMAL(10,2)`| Biaya pengiriman                         |

### `detail_resep`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `detail_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `resep_id`    | `INTEGER`      | Foreign Key ke `resep.resep_id`, tidak boleh null |
| `obat_id`     | `INTEGER`      | Foreign Key ke `obat.obat_id`, tidak boleh null |
| `dosis`       | `VARCHAR(100)` | Dosis obat                               |
| `jumlah`      | `INTEGER`      | Jumlah obat, tidak boleh null            |
| `aturan_pakai`| `TEXT`         | Aturan pakai obat                        |
| `harga_satuan`| `DECIMAL(10,2)`| Harga satuan obat                        |
| `subtotal`    | `DECIMAL(10,2)`| Subtotal harga                           |

### `medical_record`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `record_id`       | `INTEGER`      | Primary Key, Auto-increment              |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `konsultasi_id`   | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id`, unik |
| `doctor_id`       | `INTEGER`      | Foreign Key ke `doctor.doctor_id`, tidak boleh null |
| `tanggal_rekam`   | `DATE`         | Tanggal rekam medis, tidak boleh null    |
| `anamnesis`       | `TEXT`         | Anamnesis pasien                         |
| `pemeriksaan_fisik`| `TEXT`         | Hasil pemeriksaan fisik                   |
| `pemeriksaan_penunjang`| `TEXT`         | Hasil pemeriksaan penunjang               |
| `diagnosa_utama`  | `TEXT`         | Diagnosa utama                           |
| `diagnosa_sekunder`| `TEXT`         | Diagnosa sekunder                        |
| `terapi`          | `TEXT`         | Terapi yang diberikan                    |
| `prognosis`       | `TEXT`         | Prognosis pasien                         |
| `follow_up`       | `TEXT`         | Rencana tindak lanjut                    |
| `file_pendukung`  | `VARCHAR(255)` | URL file pendukung                       |

### `vital_signs`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `vital_id`        | `INTEGER`      | Primary Key, Auto-increment              |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `konsultasi_id`   | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id` |
| `tanggal_periksa` | `DATETIME`     | Tanggal pemeriksaan (default: current timestamp) |
| `tekanan_darah_sistolik`| `INTEGER`      | Tekanan darah sistolik                   |
| `tekanan_darah_diastolik`| `INTEGER`      | Tekanan darah diastolik                  |
| `denyut_nadi`     | `INTEGER`      | Denyut nadi                              |
| `suhu_tubuh`      | `DECIMAL(4,2)` | Suhu tubuh                               |
| `respiratory_rate`| `INTEGER`      | Laju pernapasan                          |
| `berat_badan`     | `DECIMAL(5,2)` | Berat badan                              |
| `tinggi_badan`    | `DECIMAL(5,2)` | Tinggi badan                             |
| `bmi`             | `DECIMAL(4,2)` | Indeks Massa Tubuh (BMI)                 |
| `saturasi_oksigen`| `DECIMAL(4,2)` | Saturasi oksigen                         |
| `catatan`         | `TEXT`         | Catatan tambahan                         |

### `notifikasi`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `notifikasi_id` | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`     | `INTEGER`      | Foreign Key ke `users.user_id`, tidak boleh null |
| `judul`       | `VARCHAR(255)` | Judul notifikasi, tidak boleh null       |
| `isi`         | `TEXT`         | Isi notifikasi                           |
| `tipe`        | `ENUM`         | Tipe notifikasi (konsultasi, pembayaran, resep, pengiriman, sistem, promo), tidak boleh null |
| `data_payload`| `JSON`         | Data payload notifikasi dalam format JSON |
| `is_read`     | `BOOLEAN`      | Status sudah dibaca (default: false)     |
| `is_push`     | `BOOLEAN`      | Notifikasi push (default: false)         |
| `created_at`  | `DATETIME`     | Waktu pembuatan notifikasi               |

### `review_rating`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `review_id`     | `INTEGER`      | Primary Key, Auto-increment              |
| `konsultasi_id` | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id` |
| `reviewer_id`   | `INTEGER`      | Foreign Key ke `users.user_id` (reviewer), tidak boleh null |
| `reviewed_id`   | `INTEGER`      | Foreign Key ke `users.user_id` (reviewed), tidak boleh null |
| `rating`        | `INTEGER`      | Rating (1-5), tidak boleh null           |
| `review_text`   | `TEXT`         | Teks ulasan                              |
| `review_type`   | `ENUM`         | Tipe ulasan (doctor, apotek, kurir, aplikasi), tidak boleh null |
| `is_anonymous`  | `BOOLEAN`      | Ulasan anonim (default: false)           |
| `created_at`    | `DATETIME`     | Waktu pembuatan ulasan                   |

### `feedback`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `feedback_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `user_id`       | `INTEGER`      | Foreign Key ke `users.user_id`           |
| `tipe_feedback` | `ENUM`         | Tipe feedback (bug, suggestion, complaint, praise), tidak boleh null |
| `judul`         | `VARCHAR(255)` | Judul feedback                           |
| `deskripsi`     | `TEXT`         | Deskripsi feedback                       |
| `screenshot`    | `VARCHAR(255)` | URL screenshot                           |
| `status`        | `ENUM`         | Status feedback (open, in_progress, resolved, closed), default: open, tidak boleh null |
| `priority`      | `ENUM`         | Prioritas feedback (low, medium, high, urgent), default: medium, tidak boleh null |
| `admin_response`| `TEXT`         | Tanggapan admin                          |
| `created_at`    | `DATETIME`     | Waktu pembuatan record                   |
| `updated_at`    | `DATETIME`     | Waktu terakhir record diperbarui         |

### `chat_messages`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `message_id`      | `INTEGER`      | Primary Key, Auto-increment              |
| `konsultasi_id`   | `INTEGER`      | Foreign Key ke `konsultasi.konsultasi_id`, tidak boleh null |
| `sender_id`       | `INTEGER`      | Foreign Key ke `users.user_id` (pengirim), tidak boleh null |
| `message_text`    | `TEXT`         | Isi pesan                                |
| `message_type`    | `ENUM`         | Tipe pesan (text, image, file, voice, video), tidak boleh null |
| `file_path`       | `VARCHAR(255)` | Path file jika tipe pesan adalah file/gambar/video |
| `file_size`       | `INTEGER`      | Ukuran file dalam byte                   |
| `timestamp`       | `DATETIME`     | Waktu pesan dikirim (default: current timestamp) |
| `is_read`         | `BOOLEAN`      | Status sudah dibaca (default: false)     |
| `is_edited`       | `BOOLEAN`      | Status sudah diedit (default: false)     |
| `reply_to_message_id`| `INTEGER`      | Foreign Key ke `chat_messages.message_id` (pesan yang dibalas) |

### `jadwal_doctor`

| Kolom         | Tipe Data      | Keterangan                               |
| :------------ | :------------- | :--------------------------------------- |
| `jadwal_id`   | `INTEGER`      | Primary Key, Auto-increment              |
| `doctor_id`   | `INTEGER`      | Foreign Key ke `doctor.doctor_id`, tidak boleh null |
| `hari`        | `ENUM`         | Hari praktik (senin, selasa, rabu, kamis, jumat, sabtu, minggu), tidak boleh null |
| `jam_mulai`   | `TIME`         | Jam mulai praktik, tidak boleh null      |
| `jam_selesai` | `TIME`         | Jam selesai praktik, tidak boleh null    |
| `quota_pasien`| `INTEGER`      | Kuota pasien per jadwal                  |
| `is_available`| `BOOLEAN`      | Status ketersediaan jadwal (default: true) |
| `catatan`     | `TEXT`         | Catatan tambahan                         |

### `appointment`

| Kolom             | Tipe Data      | Keterangan                               |
| :---------------- | :------------- | :--------------------------------------- |
| `appointment_id`  | `INTEGER`      | Primary Key, Auto-increment              |
| `pasien_id`       | `INTEGER`      | Foreign Key ke `pasien.pasien_id`, tidak boleh null |
| `doctor_id`       | `INTEGER`      | Foreign Key ke `doctor.doctor_id`, tidak boleh null |
| `tanggal_appointment`| `DATE`         | Tanggal janji temu, tidak boleh null     |
| `jam_appointment` | `TIME`         | Jam janji temu, tidak boleh null         |
| `keluhan`         | `TEXT`         | Keluhan pasien                           |
| `status`          | `ENUM`         | Status janji temu (scheduled, confirmed, cancelled, completed), tidak boleh null |
| `reminder_sent`   | `BOOLEAN`      | Pengingat sudah dikirim (default: false) |
| `created_at`      | `DATETIME`     | Waktu pembuatan janji temu                |

### `klinik`

| Kolom           | Tipe Data      | Keterangan                               |
| :-------------- | :------------- | :--------------------------------------- |
| `klinik_id`     | `INTEGER`      | Primary Key, Auto-increment              |
| `nama_klinik`   | `VARCHAR(255)` | Nama klinik, tidak boleh null            |
| `alamat`        | `TEXT`         | Alamat lengkap klinik                    |
| `no_telepon`    | `VARCHAR(20)`  | Nomor telepon klinik                     |
| `email`         | `VARCHAR(255)` | Email klinik, unik                       |
| `jam_buka`      | `TIME`         | Jam buka klinik                          |
| `jam_tutup`     | `TIME`         | Jam tutup klinik                         |
| `koordinat_lat` | `DECIMAL(10,8)`| Koordinat Latitude klinik                |
| `koordinat_lng` | `DECIMAL(11,8)`| Koordinat Longitude klinik               |
| `foto_klinik`   | `VARCHAR(255)` | URL foto klinik                          |
| `is_24_jam`     | `BOOLEAN`      | Klinik buka 24 jam (default: false)      |
| `is_active`     | `BOOLEAN`      | Status aktif klinik (default: true)      |
| `rating`        | `DECIMAL(3,2)` | Rating klinik (default: 0.00)            |
| `tipe_klinik`   | `ENUM`         | Tipe klinik (pratama, utama)             |

## Relasi Antar Tabel

Berikut adalah penjelasan relasi antar tabel dalam database:

-   **One-to-Many (1:N)**:
    -   `provinsi` (1) memiliki banyak `kota` (N)
    -   `users` (1) dapat memiliki satu `admin`, `pasien`, atau `apoteker` (1) (relasi 1:1 secara konseptual, diimplementasikan dengan `user_id` unik di tabel terkait)
    -   `apotek` (1) memiliki banyak `apoteker` (N)
    -   `kategori_artikel` (1) memiliki banyak `artikel_kesehatan` (N)
    -   `kategori_obat` (1) memiliki banyak `obat` (N)
    -   `doctor` (1) memiliki banyak `jadwal_doctor` (N)
    -   `pasien` (1) memiliki banyak `konsultasi` (N)
    -   `doctor` (1) memiliki banyak `konsultasi` (N)
    -   `konsultasi` (1) dapat memiliki satu `resep` (1) (relasi 1:1, `konsultasi_id` unik di `resep`)
    -   `resep` (1) memiliki banyak `detail_resep` (N)
    -   `obat` (1) dapat muncul di banyak `detail_resep` (N)
    -   `resep` (1) dapat memiliki satu `pengiriman` (1) (relasi 1:1, `resep_id` unik di `pengiriman`)
    -   `kurir` (1) memiliki banyak `pengiriman` (N)
    -   `konsultasi` (1) dapat memiliki satu `medical_record` (1) (relasi 1:1, `konsultasi_id` unik di `medical_record`)
    -   `pasien` (1) memiliki banyak `vital_signs` (N)
    -   `konsultasi` (1) dapat memiliki banyak `vital_signs` (N)
    -   `users` (1) memiliki banyak `notifikasi` (N)
    -   `konsultasi` (1) dapat memiliki banyak `review_rating` (N)
    -   `users` (1) dapat memberikan banyak `review_rating` (N) (sebagai `reviewer_id` dan `reviewed_id`)
    -   `users` (1) memiliki banyak `feedback` (N)
    -   `konsultasi` (1) memiliki banyak `chat_messages` (N)
    -   `users` (1) dapat mengirim banyak `chat_messages` (N)
    -   `chat_messages` (1) dapat dibalas oleh `chat_messages` lain (N) (relasi self-referencing)
    -   `pasien` (1) memiliki banyak `appointment` (N)
    -   `doctor` (1) memiliki banyak `appointment` (N)
    -   `users` (1) memiliki banyak `logs` (N)

-   **Many-to-Many (N:M)**:
    -   `users` (N) dapat menggunakan banyak `promo` (M) melalui tabel perantara `user_promo`.
    -   `pembayaran` (N) dapat terkait dengan `user_promo` (M) melalui `pembayaran_id` unik di `user_promo`.

## Penjelasan Relasi Kompleks

-   **`users` dan `admin`/`pasien`/`apoteker`**: Tabel `users` berfungsi sebagai tabel dasar untuk otentikasi dan otorisasi. Tabel `admin`, `pasien`, dan `apoteker` memperluas informasi pengguna dengan detail spesifik peran. Relasi ini diimplementasikan sebagai one-to-one menggunakan `user_id` yang unik di tabel peran, memastikan setiap pengguna hanya dapat memiliki satu peran spesifik pada satu waktu.

-   **`konsultasi` dan `resep`/`medical_record`/`pembayaran`**: Konsultasi adalah inti dari interaksi pasien-dokter. Sebuah konsultasi dapat menghasilkan satu resep, satu catatan medis, dan satu pembayaran. Relasi ini adalah one-to-one yang diimplementasikan dengan `konsultasi_id` yang unik di tabel `resep`, `medical_record`, dan `pembayaran`.

-   **`user_promo` (Tabel Pivot)**: Tabel ini berfungsi sebagai tabel perantara untuk relasi many-to-many antara `users` dan `promo`. Ini memungkinkan satu pengguna untuk menggunakan banyak promo, dan satu promo dapat digunakan oleh banyak pengguna. Kolom `pembayaran_id` di `user_promo` juga memastikan bahwa setiap penggunaan promo terkait dengan transaksi pembayaran tertentu, menjadikannya relasi one-to-one dengan pembayaran.

-   **`chat_messages` (Self-referencing)**: Tabel ini memiliki relasi self-referencing melalui `reply_to_message_id`, yang memungkinkan pesan untuk merujuk ke pesan lain dalam percakapan yang sama, membentuk struktur balasan atau thread.
