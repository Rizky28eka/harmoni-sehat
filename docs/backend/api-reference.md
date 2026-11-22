# Referensi API Harmoni Sehat

Base URL: `/api/v1`. Semua endpoint (kecuali yang ditandai **publik**) membutuhkan header `Authorization: Bearer <accessToken>`.

Format respons: `{ "status": "success", "data": ... }` atau `{ "statusCode", "data", "message", "success" }` (modul CRUD).
Error: `{ "status": "error", "message": "..." }` dengan kode HTTP yang sesuai (400 validasi, 401 belum login, 403 tidak berhak, 404, 409 konflik, 429 rate limit).

## Peran & hak akses

| Peran | Keterangan |
| --- | --- |
| `pasien` | Mendaftar sendiri. Hanya melihat/mengubah data miliknya. |
| `dokter` | Mendaftar sendiri, **harus diverifikasi admin** sebelum bisa melakukan aksi tulis. |
| `farmasi` | Mendaftar sendiri, **harus diverifikasi admin**. |
| `admin`, `superadmin` | Tidak bisa mendaftar sendiri. Dibuat lewat seeder / `POST /users` oleh admin. |

Pembatasan data dilakukan **di lapisan model** (row-level scope, [ownerScope.ts](../../harmoni_sehat_backend/src/plugins/ownerScope.ts)):
pasien hanya melihat konsultasi, rekam medis, resep, pesanan, transaksi, dan notifikasi miliknya; dokter hanya melihat pasiennya.

## Auth — `/auth`

| Method | Path | Keterangan |
| --- | --- | --- |
| POST | `/auth/register` | Satu langkah: akun + profil per peran. Body: `email, password, role (pasien\|dokter\|farmasi), name` + data peran (`nik, tanggal_lahir, jenis_kelamin, alamat, no_telepon` / `nomor_str, spesialisasi_id, biaya_konsultasi, bio` / `nomor_sipa`). Respons: `token`, `refreshToken`, `data.user`. |
| POST | `/auth/login` | `email, password` → `token` (15 menit), `refreshToken` (30 hari). |
| POST | `/auth/refresh` | `refreshToken` → pasangan token baru. Refresh token **dirotasi**; pemakaian ulang ditolak. |
| POST | `/auth/logout` | Cabut refresh token (`all: true` untuk semua perangkat). |
| GET | `/auth/me` | User + profil peran. |
| POST | `/auth/change-password` | `currentPassword, newPassword`. Mencabut semua sesi. |
| POST | `/auth/forgot-password` | Selalu 200 (tidak membocorkan keberadaan email). Kode dikirim via email, berlaku 10 menit. |
| POST | `/auth/verify-reset-token`, `/auth/reset-password` | `token` / `token, newPassword`. |

Password: min. 8 karakter, huruf besar, huruf kecil, angka, dan simbol `@$!%*?&`.

## Booking konsultasi — `/booking`

| Method | Path | Peran | Keterangan |
| --- | --- | --- | --- |
| GET | `/booking/doctors` | semua | Direktori dokter terverifikasi. Query: `search, spesialisasi, minRating, maxFee, sort (rating\|fee_asc\|fee_desc\|name), page, limit`. |
| GET | `/booking/doctors/:id` | semua | Detail, jadwal, rating, ulasan. |
| GET | `/booking/doctors/:id/slots?date=YYYY-MM-DD` | semua | Slot per tanggal (WIB) beserta `available`. |
| POST | `/booking/consultations` | pasien | `dokter_id, jadwal_id, start (ISO), keluhan`. Slot ditahan 15 menit untuk pembayaran. Double booking → 409. Biaya dihitung server. |
| GET | `/booking/consultations` | pasien, dokter | Milik sendiri. `status=a,b`, `page`, `limit`. |
| GET | `/booking/consultations/:id` | peserta | Detail + transaksi + resep. |
| GET | `/booking/consultations/:id/messages` | peserta | Riwayat chat (`before`, `limit`). |
| POST | `/booking/consultations/:id/cancel` | peserta | Pasien: hanya >2 jam sebelum jadwal bila sudah dibayar. |
| POST | `/booking/consultations/:id/start` | dokter | `scheduled` → `ongoing`. |
| POST | `/booking/consultations/:id/complete` | dokter | `diagnosa` + opsional vital, `alergi`, `resep.obat[]`. Membuat rekam medis (+resep). |
| POST | `/booking/consultations/:id/review` | pasien | `rating 1-5, komentar`. Sekali per konsultasi. |
| GET/POST/PUT/DELETE | `/booking/my/schedules[/:id]` | dokter | Kelola jadwal praktik (tidak boleh tumpang tindih). |
| GET | `/booking/my/summary` | dokter | Antrean hari ini, statistik. |

Status konsultasi: `pending` (menunggu bayar) → `scheduled` → `ongoing` → `completed` / `cancelled`.

## Pembayaran — `/payments`

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/payments/:orderId` | Status transaksi milik sendiri. |
| POST | `/payments/:orderId/simulate` | **Hanya mode sandbox** (tanpa `MIDTRANS_SERVER_KEY`, non-production). `outcome: success\|failed`. |
| POST | `/payments/webhook` | Notifikasi Midtrans, diverifikasi dengan signature SHA-512. Idempotent. |

## Apotek — `/shop`

| Method | Path | Peran | Keterangan |
| --- | --- | --- | --- |
| GET | `/shop/drugs` | semua | Katalog (stok > 0, belum kedaluwarsa). `search, kategori, page, limit`. |
| GET / PUT / DELETE | `/shop/cart`, `/shop/cart/items`, `/shop/cart` | pasien | Keranjang. `PUT items {obat_id, jumlah}` (0 = hapus). |
| POST | `/shop/checkout` | pasien | `alamat_pengiriman, resep_id?`. Stok dikurangi atomik; harga dihitung server; obat resep wajib resep valid. |
| POST | `/shop/prescriptions/:id/order` | pasien | Tebus resep. |
| GET | `/shop/orders`, `/shop/orders/:id` | pasien, farmasi | |
| POST | `/shop/orders/:id/cancel` | pasien (belum bayar), farmasi | Stok dikembalikan. |
| POST | `/shop/orders/:id/advance` | farmasi (`processing→shipped`, `no_resi`), pasien (`shipped→delivered`) | |

Pesanan yang tidak dibayar dalam 30 menit dibatalkan otomatis dan stok dikembalikan.

## Lainnya

| Path | Keterangan |
| --- | --- |
| `POST /gemini/chat` | Asisten AI (`message`, `history[]`). Deteksi kondisi darurat tanpa memanggil model; rekomendasi spesialis + dokter. Rate limit 10/menit. |
| `GET /notifications`, `/notifications/unread-count`, `POST /notifications/read-all`, `/notifications/:id/read` | Notifikasi milik sendiri. |
| `POST /notifications/devices {token, platform}` / `DELETE /notifications/devices/:token` | Daftar token FCM. |
| `POST /media/upload` (multipart `file`) | JPG/PNG/WEBP/PDF ≤ 5 MB, divalidasi *magic bytes*. |
| `GET /health-articles[/:idOrSlug]` | **Publik**, hanya artikel `published`. Tulis: dokter terverifikasi & admin. |
| `GET/POST/PUT/DELETE /me/reminders` | Pengingat minum obat (dikirim sebagai notifikasi pada jam WIB yang ditentukan). |
| `GET /me/medical-timeline`, `GET /me/medical-records/:id/pdf-link` | Linimasa rekam medis & tautan PDF bertoken 5 menit. |
| `POST /me/consent {version}`, `DELETE /me/account {password}` | Persetujuan data & hapus akun (anonimisasi, UU PDP). |
| `GET /admins/manage/stats`, `/admins/manage/pending-verifications`, `POST /admins/manage/verify/(dokter\|farmasi)/:id {approve}` | Khusus admin. |
| CRUD `/users`, `/roles`, `/doctors`, `/patients`, `/drugs`, `/clinics`, `/specializations`, `/payment-methods`, … | Modul CRUD dasar, dilindungi RBAC + row-level scope. Lihat `accessPolicy` di tiap `*.routes.ts`. |

## Socket.IO

Koneksi: `io(SERVER_URL, { auth: { token: accessToken } })`. Tanpa token valid koneksi ditolak.

| Event (client → server) | Payload | Ack |
| --- | --- | --- |
| `chat:join` | `{ konsultasiId }` | `{ ok, status }` — hanya peserta. |
| `chat:send` | `{ konsultasiId, isi, tipe?, file_url? }` | `{ ok, message }` — hanya saat konsultasi `scheduled`/`ongoing`. |
| `chat:typing` | `{ konsultasiId, typing }` | — |
| `chat:read` | `{ konsultasiId }` | — |

Server → client: `chat:message`, `chat:typing`, `chat:read`, `notification`.
