# UX audit — aplikasi mobile

Metode: membaca setiap alur di kode, menjalankannya di simulator iOS dengan data demo, dan meninjau 22 screenshot (Indonesia/Inggris, terang/gelap). **Bukan** uji pengguna: temuan di bawah adalah penilaian heuristik, belum divalidasi dengan pengguna nyata.

## Sudah diperbaiki

| Temuan | Perbaikan |
| --- | --- |
| Rekam medis, pengingat, dan pesanan terkubur di tab/menu | Kartu layanan di beranda dan pintasan di Profil |
| Navigasi 5 tab terlalu padat | 4 tab + tombol tengah "Cari dokter" (aksi utama pasien) |
| Slot ditahan 15 menit untuk pembayaran tanpa petunjuk waktu | Banner batas waktu bayar di detail konsultasi yang menunggu pembayaran |
| Spinner penuh layar saat memuat | Skeleton yang menyerupai bentuk konten; status kosong/error punya ikon dan tindakan ("Coba lagi") |
| Teks sekunder terlalu pucat (kontras ±2,6:1) | Warna teks redup digelapkan (±4,6:1) |
| Formulir tidak berpindah kolom dengan tombol Next | `textInputAction` otomatis (next / newline) |
| Registrasi: pilihan peran kecil dan mudah terlewat | Tiga kartu peran besar berwarna dengan penanda terpilih |
| Pemulihan password tanpa gambaran progres | Penanda langkah 1/3–3/3 dan ikon per langkah |
| Status pesanan hanya berupa label | Linimasa Menunggu → Diproses → Dikirim → Diterima |
| Kontrol segmen sempit dan rata tengah | Selebar layar |
| Sebagian teks masih Indonesia di mode Inggris | Dilengkapi; ada tes yang gagal bila ada teks UI baru yang belum diterjemahkan |
| Daftar menampilkan error sesaat saat data dimuat | Konten dibangun setelah data tersedia (bug nyata, ditemukan lewat tes) |

## Belum dikerjakan (rekomendasi, berurutan menurut dampak)

1. **Banner offline.** Cache offline sudah ada, tetapi pengguna tidak diberi tahu bahwa data yang tampil mungkin usang.
2. **Pengingat obat tidak bisa diedit**, hanya dinyalakan/dimatikan atau dihapus. Perlu layar ubah.
3. **Booking: belum ada "jadwal terdekat".** Pengguna harus menelusuri tanggal satu per satu; tombol "Jadwal terdekat" akan memangkas langkah.
4. **Belum ada konfirmasi sebelum bayar** (ringkasan dokter, jam, biaya). Saat ini langsung berpindah ke layar pembayaran.
5. **Chat:** tidak ada pemisah tanggal, tidak ada indikator pesan belum dibaca saat dibuka kembali, dan kirim foto tanpa pratinjau.
6. **Aksesibilitas:** label semantik untuk ikon-saja (sebagian sudah ada tooltip), dukungan teks besar belum diuji, dan kontrasnya baru diperiksa secara manual untuk teks sekunder.
7. **Notifikasi tidak dikelompokkan** per hari dan tidak bisa dihapus satu per satu.
8. **Dokter:** form "Selesaikan konsultasi" panjang; template diagnosa/resep yang sering dipakai akan mempercepat.
9. **Apoteker:** tidak ada peringatan stok menipis di dasbor selain warna angka.
10. **Admin:** tidak ada alasan penolakan saat menolak verifikasi.

## Batasan audit

- Android belum dilihat secara visual (lisensi SDK belum diterima); tata letak mengikuti Material 3 sehingga diharapkan setara, tetapi belum dibuktikan.
- Layar panggilan suara/video tidak punya screenshot otomatis (butuh dua perangkat).
- Ukuran layar kecil (<360 dp) hanya diuji lewat tes widget, bukan perangkat.
