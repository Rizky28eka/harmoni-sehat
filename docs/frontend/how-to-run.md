# Menjalankan Frontend (Flutter)

```bash
cd harmoni_sehat_frontend
flutter pub get
flutter run --dart-define=API_BASE_URL=http://<IP-MESIN-ANDA>:8000/api/v1
```

- **Android emulator**: tanpa `--dart-define`, aplikasi memakai `http://10.0.2.2:8000/api/v1`.
- **iOS simulator / web / desktop**: default `http://localhost:8000/api/v1`.
- **Perangkat fisik**: gunakan IP LAN komputer Anda. Build *release* wajib memakai **HTTPS**.

Akun demo (setelah `npm run seed` di backend, password `Harmoni123!`):
`pasien@harmoni.test`, `dokter1@harmoni.test`, `apoteker@harmoni.test`, `admin@harmoni.test`.

Tanpa `MIDTRANS_SERVER_KEY` di backend, layar pembayaran menampilkan tombol **simulasi** sehingga alur booking/checkout bisa diuji end-to-end.

## Testing & kualitas

```bash
flutter analyze
flutter test
```

## Struktur

```
lib/
  core/       ApiClient (refresh token + cache offline), SessionService, SocketService, UI kit
  features/   auth, patient, doctor, pharmacist, admin, common (chat, notifikasi, pengaturan)
  app/        routes, tema (terang/gelap), bindings
```

## Fitur native

- **Pengingat obat**: alarm lokal terjadwal di perangkat (zona WIB), tetap berbunyi saat aplikasi tertutup/offline. Buka *Pengingat Obat* → ikon lonceng untuk memberi izin notifikasi. Alarm disinkronkan ulang setiap daftar dimuat. iOS membatasi 64 notifikasi tertunda, jadi pengingat berakhir-terbuka memakai satu alarm harian per jam.
- **Panggilan suara/video**: WebRTC bawaan (`flutter_webrtc`), signaling via Socket.IO. Aplikasi akan meminta izin kamera/mikrofon saat panggilan pertama. Untuk jaringan seluler/NAT ketat, konfigurasikan TURN di backend (`TURN_URLS`, `TURN_SECRET`).
- **Bahasa**: Indonesia dan Inggris untuk seluruh UI dan pesan error server. `test/i18n_test.dart` gagal bila ada teks UI baru yang belum diterjemahkan.

## Belum termasuk (butuh kredensial/setup Anda)

- **Push notification FCM di sisi aplikasi**: tambahkan `firebase_core` + `firebase_messaging`, letakkan `google-services.json` / `GoogleService-Info.plist`, lalu kirim token ke `POST /notifications/devices`. Backend sudah siap (`FCM_SERVICE_ACCOUNT_PATH`). Selama itu, notifikasi real-time hanya saat aplikasi terbuka (Socket.IO); pengingat obat tetap berbunyi lewat alarm lokal.
- **Midtrans produksi**: isi `MIDTRANS_SERVER_KEY` dan arahkan *notification URL* Midtrans ke `/api/v1/payments/webhook`.
- **Build Android**: butuh Android SDK dengan lisensi diterima (`flutter doctor --android-licenses`).
