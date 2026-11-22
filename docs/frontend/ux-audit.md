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

## Rekomendasi yang kemudian diimplementasikan

| Rekomendasi | Hasil |
| --- | --- |
| Banner offline | Banner di semua shell saat API tidak terjangkau; hilang otomatis saat tersambung lagi |
| Pengingat obat bisa diedit | Ketuk kartu pengingat untuk mengubah nama, dosis, dan jam |
| Booking: jadwal terdekat | Tombol "Jadwal terdekat" mencari slot kosong pertama dalam 14 hari dan langsung memilihnya |
| Konfirmasi sebelum bayar | Dialog ringkasan (dokter, waktu, biaya) sebelum pesanan dibuat |
| Chat: pemisah tanggal | Penanda Hari ini / Kemarin / tanggal |
| Notifikasi dikelompokkan dan bisa dihapus | Judul per hari, geser untuk menghapus |
| Dokter: percepat form | Lima diagnosa terakhir muncul sebagai chip satu ketukan |
| Apoteker: stok menipis | Banner jumlah obat berstok < 10, ketuk untuk menyaring |
| Admin: alasan penolakan | Dialog alasan; teksnya dikirim sebagai notifikasi ke pemohon (backend ikut berubah) |

## Diselesaikan di putaran berikutnya

| Item | Hasil |
| --- | --- |
| Chat: pesan belum dibaca | Penanda "Pesan baru" tepat di atas pesan pertama yang belum dibaca saat percakapan dibuka |
| Chat: pratinjau foto | Dialog pratinjau sebelum foto dikirim |
| Template resep | Simpan resep sebagai template bernama, terapkan dengan satu ketukan, hapus dari chip (tersimpan di perangkat) |
| Aksesibilitas: label | Label semantik untuk navigasi (termasuk lencana), jalur minggu (tanggal + ada jadwal), tooltip lonceng, tombol lihat/sembunyikan password, tombol kirim/foto; ikon dekoratif dikeluarkan dari pembaca layar |
| Aksesibilitas: teks besar | Grid kartu memakai tinggi yang ikut skala teks. Uji otomatis pada skala 1,3× dan 1,8× di 6 layar menemukan dan memperbaiki overflow di beranda pasien, dasbor dokter, dan statistik admin |

## Masih terbuka

1. **Aksesibilitas belum diuji dengan pembaca layar sungguhan** (VoiceOver/TalkBack): yang diuji hanya keberadaan label dan tata letak pada teks besar.
2. **Template resep hanya di perangkat**, tidak ikut berpindah antar perangkat.
3. **Uji dengan pengguna nyata.** Semua temuan di atas bersifat heuristik.

## Batasan audit

- Android belum dilihat secara visual (lisensi SDK belum diterima); tata letak mengikuti Material 3 sehingga diharapkan setara, tetapi belum dibuktikan.
- Layar panggilan suara/video tidak punya screenshot otomatis (butuh dua perangkat).
- Ukuran layar kecil (<360 dp) hanya diuji lewat tes widget, bukan perangkat.
