/**
 * OpenAPI 3.0 description of the Harmoni Sehat API.
 * Hand-curated for the workflow endpoints; the plain CRUD modules are described generically.
 * tests/openapi.test.ts validates this document and checks it covers every mounted workflow route.
 */

type Json = Record<string, any>;

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const obj = (properties: Json, required: string[] = []): Json => ({ type: 'object', properties, ...(required.length ? { required } : {}) });
const str = (extra: Json = {}): Json => ({ type: 'string', ...extra });
const num = (extra: Json = {}): Json => ({ type: 'number', ...extra });
const int = (extra: Json = {}): Json => ({ type: 'integer', ...extra });
const arr = (items: Json): Json => ({ type: 'array', items });
const ok = (data: Json = {}): Json => ({
  description: 'OK',
  content: { 'application/json': { schema: obj({ status: str({ example: 'success' }), data }) } },
});
const body = (schema: Json): Json => ({ required: true, content: { 'application/json': { schema } } });
const idParam = (name = 'id') => ({ name, in: 'path', required: true, schema: str() });
const query = (name: string, schema: Json = str(), description?: string) => ({ name, in: 'query', required: false, schema, ...(description ? { description } : {}) });

interface Op {
  summary: string;
  tag: string;
  roles?: string; // human readable access note
  params?: Json[];
  body?: Json;
  response?: Json;
  public?: boolean;
  codes?: Record<string, string>;
}

const paths: Record<string, Json> = {};
const op = (method: 'get' | 'post' | 'put' | 'delete', path: string, o: Op) => {
  const params = [...(o.params ?? [])];
  for (const m of path.matchAll(/\{(\w+)\}/g)) if (!params.some((p) => p.in === 'path' && p.name === m[1])) params.push(idParam(m[1]));
  const responses: Json = { '200': o.response ?? ok() };
  responses['400'] = { $ref: '#/components/responses/ValidationError' };
  if (!o.public) {
    responses['401'] = { $ref: '#/components/responses/Unauthorized' };
    responses['403'] = { $ref: '#/components/responses/Forbidden' };
  }
  for (const [code, description] of Object.entries(o.codes ?? {})) responses[code] = { description };
  paths[path] = {
    ...(paths[path] ?? {}),
    [method]: {
      tags: [o.tag],
      summary: o.summary,
      ...(o.roles ? { description: `**Akses:** ${o.roles}` } : {}),
      ...(o.public ? { security: [] } : {}),
      ...(params.length ? { parameters: params } : {}),
      ...(o.body ? { requestBody: o.body } : {}),
      responses,
    },
  };
};

const tokens = obj({ status: str(), token: str(), refreshToken: str(), data: obj({ user: ref('User') }) });

/* ------------------------------------------------------------------ Auth */
op('post', '/auth/register', { tag: 'Auth', summary: 'Daftar (akun + profil peran)', public: true, roles: 'Publik. Admin tidak dapat mendaftar sendiri.', body: body(ref('RegisterInput')), response: { description: 'Created', content: { 'application/json': { schema: tokens } } }, codes: { '409': 'Email sudah terdaftar' } });
op('post', '/auth/login', { tag: 'Auth', summary: 'Masuk', public: true, body: body(obj({ email: str({ format: 'email' }), password: str() }, ['email', 'password'])), response: { description: 'OK', content: { 'application/json': { schema: tokens } } }, codes: { '401': 'Email atau password salah', '429': 'Terlalu banyak percobaan' } });
op('post', '/auth/refresh', { tag: 'Auth', summary: 'Rotasi refresh token', public: true, body: body(obj({ refreshToken: str() }, ['refreshToken'])), response: { description: 'OK', content: { 'application/json': { schema: tokens } } } });
op('post', '/auth/logout', { tag: 'Auth', summary: 'Keluar / cabut refresh token', body: body(obj({ refreshToken: str(), all: { type: 'boolean' } })) });
op('get', '/auth/me', { tag: 'Auth', summary: 'User dan profil saat ini' });
op('post', '/auth/change-password', { tag: 'Auth', summary: 'Ubah password', body: body(obj({ currentPassword: str(), newPassword: str() }, ['currentPassword', 'newPassword'])) });
op('post', '/auth/forgot-password', { tag: 'Auth', summary: 'Minta kode reset', public: true, body: body(obj({ email: str({ format: 'email' }) }, ['email'])) });
op('post', '/auth/verify-reset-token', { tag: 'Auth', summary: 'Verifikasi kode reset', public: true, body: body(obj({ token: str() }, ['token'])) });
op('post', '/auth/reset-password', { tag: 'Auth', summary: 'Atur password baru', public: true, body: body(obj({ token: str(), newPassword: str() }, ['token', 'newPassword'])) });

/* --------------------------------------------------------------- Booking */
op('get', '/booking/doctors', { tag: 'Booking', summary: 'Direktori dokter terverifikasi', params: [query('search'), query('spesialisasi'), query('minRating', num()), query('maxFee', num()), query('sort', str({ enum: ['rating', 'fee_asc', 'fee_desc', 'name'] })), query('page', int()), query('limit', int())] });
op('get', '/booking/doctors/{id}', { tag: 'Booking', summary: 'Detail dokter, jadwal, dan ulasan', codes: { '404': 'Tidak ditemukan' } });
op('get', '/booking/doctors/{id}/slots', { tag: 'Booking', summary: 'Slot tersedia pada tanggal tertentu (WIB)', params: [{ name: 'date', in: 'query', required: true, schema: str({ format: 'date' }) }], response: ok(arr(ref('Slot'))) });
op('post', '/booking/consultations', { tag: 'Booking', summary: 'Pesan konsultasi', roles: 'pasien', body: body(obj({ dokter_id: str(), jadwal_id: str(), start: str({ format: 'date-time' }), keluhan: str(), metode_pembayaran_id: str() }, ['dokter_id', 'jadwal_id', 'start', 'keluhan'])), codes: { '409': 'Slot sudah dipesan' } });
op('get', '/booking/consultations', { tag: 'Booking', summary: 'Daftar konsultasi milik sendiri', params: [query('status', str(), 'Pisahkan dengan koma'), query('page', int()), query('limit', int())] });
op('get', '/booking/consultations/{id}', { tag: 'Booking', summary: 'Detail konsultasi (+ transaksi, resep)', codes: { '404': 'Bukan peserta / tidak ada' } });
op('get', '/booking/consultations/{id}/messages', { tag: 'Booking', summary: 'Riwayat chat', params: [query('before', str({ format: 'date-time' })), query('limit', int())] });
op('post', '/booking/consultations/{id}/cancel', { tag: 'Booking', summary: 'Batalkan konsultasi (refund otomatis bila sudah dibayar)', body: body(obj({ reason: str() })), codes: { '409': 'Tidak dapat dibatalkan' } });
op('post', '/booking/consultations/{id}/start', { tag: 'Booking', summary: 'Mulai konsultasi', roles: 'dokter terverifikasi' });
op('post', '/booking/consultations/{id}/complete', { tag: 'Booking', summary: 'Selesaikan, buat rekam medis dan resep', roles: 'dokter terverifikasi', body: body(ref('CompleteInput')) });
op('post', '/booking/consultations/{id}/review', { tag: 'Booking', summary: 'Beri ulasan', roles: 'pasien', body: body(obj({ rating: int({ minimum: 1, maximum: 5 }), komentar: str() }, ['rating'])) });
op('get', '/booking/ice-servers', { tag: 'Booking', summary: 'Konfigurasi ICE (STUN/TURN sementara) untuk WebRTC', response: ok(obj({ iceServers: arr(obj({ urls: arr(str()), username: str(), credential: str() })) })) });
op('get', '/booking/my/summary', { tag: 'Dokter', summary: 'Ringkasan dasbor dokter', roles: 'dokter' });
op('get', '/booking/my/schedules', { tag: 'Dokter', summary: 'Jadwal praktik saya', roles: 'dokter' });
op('post', '/booking/my/schedules', { tag: 'Dokter', summary: 'Tambah jadwal praktik', roles: 'dokter terverifikasi', body: body(obj({ klinik_id: str(), hari: str(), jam_mulai: str(), jam_selesai: str(), durasi_menit: int() }, ['klinik_id', 'hari', 'jam_mulai', 'jam_selesai'])), codes: { '409': 'Bertabrakan dengan jadwal lain' } });
op('put', '/booking/my/schedules/{id}', { tag: 'Dokter', summary: 'Aktif/nonaktifkan jadwal', roles: 'dokter terverifikasi', body: body(obj({ is_active: { type: 'boolean' } }, ['is_active'])) });
op('delete', '/booking/my/schedules/{id}', { tag: 'Dokter', summary: 'Hapus jadwal', roles: 'dokter terverifikasi', codes: { '409': 'Masih ada konsultasi aktif' } });

/* -------------------------------------------------------------- Payments */
op('get', '/payments/{orderId}', { tag: 'Pembayaran', summary: 'Status transaksi milik sendiri' });
op('post', '/payments/{orderId}/simulate', { tag: 'Pembayaran', summary: 'Simulasi pembayaran (sandbox)', description: undefined, roles: 'Hanya tanpa MIDTRANS_SERVER_KEY dan non-production', body: body(obj({ outcome: str({ enum: ['success', 'failed'] }) })) } as Op);
op('post', '/payments/webhook', { tag: 'Pembayaran', summary: 'Notifikasi Midtrans', public: true, roles: 'Diautentikasi dengan signature SHA-512, bukan JWT', body: body(obj({ order_id: str(), status_code: str(), gross_amount: str(), signature_key: str(), transaction_status: str() })), codes: { '403': 'Signature tidak valid' } });

/* ------------------------------------------------------------------ Shop */
op('get', '/shop/drugs', { tag: 'Apotek', summary: 'Katalog obat', params: [query('search'), query('kategori'), query('page', int()), query('limit', int())] });
op('get', '/shop/cart', { tag: 'Apotek', summary: 'Keranjang', roles: 'pasien' });
op('put', '/shop/cart/items', { tag: 'Apotek', summary: 'Atur jumlah item (0 = hapus)', roles: 'pasien', body: body(obj({ obat_id: str(), jumlah: int({ minimum: 0 }) }, ['obat_id', 'jumlah'])), codes: { '409': 'Stok tidak cukup' } });
op('delete', '/shop/cart', { tag: 'Apotek', summary: 'Kosongkan keranjang', roles: 'pasien' });
op('post', '/shop/checkout', { tag: 'Apotek', summary: 'Checkout (stok dikurangi atomik)', roles: 'pasien', body: body(obj({ alamat_pengiriman: str(), catatan_pengiriman: str(), metode_pembayaran_id: str(), resep_id: str() })), codes: { '409': 'Stok tidak cukup' } });
op('post', '/shop/prescriptions/{id}/order', { tag: 'Apotek', summary: 'Tebus resep', roles: 'pasien', body: body(obj({ alamat_pengiriman: str() })) });
op('get', '/shop/orders', { tag: 'Apotek', summary: 'Daftar pesanan', roles: 'pasien, farmasi', params: [query('status'), query('page', int()), query('limit', int())] });
op('get', '/shop/orders/{id}', { tag: 'Apotek', summary: 'Detail pesanan', roles: 'pasien, farmasi' });
op('post', '/shop/orders/{id}/cancel', { tag: 'Apotek', summary: 'Batalkan pesanan (stok kembali, refund bila sudah dibayar)', roles: 'pasien (belum bayar), farmasi', body: body(obj({ reason: str() })) });
op('post', '/shop/orders/{id}/advance', { tag: 'Apotek', summary: 'Lanjutkan status pesanan', roles: 'farmasi: processing→shipped; pasien: shipped→delivered', body: body(obj({ no_resi: str() })) });

/* ---------------------------------------------------------------- Others */
op('post', '/gemini/chat', { tag: 'AI', summary: 'Asisten kesehatan AI', body: body(obj({ message: str({ maxLength: 1000 }), history: arr(obj({ role: str({ enum: ['user', 'assistant'] }), content: str() })) }, ['message'])), codes: { '429': 'Rate limit 10/menit', '503': 'AI belum dikonfigurasi' } });
op('get', '/notifications', { tag: 'Notifikasi', summary: 'Notifikasi milik sendiri' });
op('get', '/notifications/unread-count', { tag: 'Notifikasi', summary: 'Jumlah belum dibaca' });
op('post', '/notifications/read-all', { tag: 'Notifikasi', summary: 'Tandai semua dibaca' });
op('post', '/notifications/{id}/read', { tag: 'Notifikasi', summary: 'Tandai dibaca' });
op('post', '/notifications/devices', { tag: 'Notifikasi', summary: 'Daftarkan token FCM', body: body(obj({ token: str(), platform: str({ enum: ['android', 'ios', 'web'] }) }, ['token'])) });
op('delete', '/notifications/devices/{token}', { tag: 'Notifikasi', summary: 'Hapus token FCM' });
op('post', '/media/upload', { tag: 'Media', summary: 'Unggah file (JPG/PNG/WEBP/PDF ≤ 5 MB)', body: { required: true, content: { 'multipart/form-data': { schema: obj({ file: str({ format: 'binary' }) }, ['file']) } } }, codes: { '415': 'Tipe file tidak didukung' } });
op('get', '/health-articles', { tag: 'Artikel', summary: 'Artikel terbit', public: true, params: [query('search'), query('page', int()), query('limit', int())] });
op('get', '/health-articles/{idOrSlug}', { tag: 'Artikel', summary: 'Detail artikel', public: true, params: [idParam('idOrSlug')] });
op('post', '/health-articles', { tag: 'Artikel', summary: 'Tulis artikel', roles: 'dokter terverifikasi, admin', body: body(obj({ judul: str(), konten: str(), status_publikasi: str({ enum: ['draft', 'published', 'archived'] }) }, ['judul', 'konten'])) });
op('get', '/me/reminders', { tag: 'Saya', summary: 'Pengingat obat', roles: 'pasien' });
op('post', '/me/reminders', { tag: 'Saya', summary: 'Buat pengingat obat', roles: 'pasien', body: body(obj({ nama_obat: str(), dosis: str(), jam: arr(str({ example: '08:00' })) }, ['nama_obat', 'jam'])) });
op('put', '/me/reminders/{id}', { tag: 'Saya', summary: 'Ubah pengingat', roles: 'pasien', body: body(obj({ is_active: { type: 'boolean' } })) });
op('delete', '/me/reminders/{id}', { tag: 'Saya', summary: 'Hapus pengingat', roles: 'pasien' });
op('get', '/me/medical-timeline', { tag: 'Saya', summary: 'Linimasa rekam medis', roles: 'pasien' });
op('get', '/me/medical-records/{id}/pdf-link', { tag: 'Saya', summary: 'Tautan PDF bertoken (5 menit)', roles: 'pasien, dokter' });
op('get', '/me/medical-records/{id}/pdf', { tag: 'Saya', summary: 'Unduh PDF rekam medis', public: true, params: [{ name: 't', in: 'query', required: true, schema: str() }], roles: 'Token dari pdf-link' });
op('post', '/me/consent', { tag: 'Saya', summary: 'Catat persetujuan data', body: body(obj({ version: str() }, ['version'])) });
op('delete', '/me/account', { tag: 'Saya', summary: 'Hapus akun (anonimisasi)', body: body(obj({ password: str() }, ['password'])) });

/* ----------------------------------------------------------------- Admin */
op('get', '/admins/manage/stats', { tag: 'Admin', summary: 'Statistik', roles: 'admin' });
op('get', '/admins/manage/pending-verifications', { tag: 'Admin', summary: 'Dokter/apoteker menunggu verifikasi', roles: 'admin' });
op('post', '/admins/manage/verify/{kind}/{id}', { tag: 'Admin', summary: 'Setujui/tolak verifikasi', roles: 'admin', params: [{ name: 'kind', in: 'path', required: true, schema: str({ enum: ['dokter', 'farmasi'] }) }], body: body(obj({ approve: { type: 'boolean' } })) });
op('get', '/admins/manage/refunds/failed', { tag: 'Admin', summary: 'Refund yang gagal di gateway', roles: 'admin' });
op('post', '/admins/manage/refunds/{orderId}/retry', { tag: 'Admin', summary: 'Ulangi refund (idempotent)', roles: 'admin', codes: { '502': 'Gateway menolak' } });

/* ------------------------------------------------------------ CRUD modules */
const crud: [string, string][] = [
  ['users', 'admin'], ['roles', 'admin'], ['admins', 'admin'], ['doctors', 'baca: semua; tulis: dokter'], ['patients', 'pasien/dokter/farmasi'],
  ['pharmacists', 'farmasi'], ['drugs', 'baca: semua; tulis: farmasi'], ['clinics', 'baca: semua; tulis: admin'], ['specializations', 'baca: publik; tulis: admin'],
  ['payment-methods', 'baca: semua; tulis: admin'], ['consultations', 'peserta'], ['medical-records', 'pasien (baca), dokter'], ['prescriptions', 'sesuai peran'],
  ['prescription-drugs', 'sesuai peran'], ['transactions', 'pemilik (baca), admin (tulis)'], ['drug-orders', 'pasien/farmasi'], ['drug-order-details', 'pasien/farmasi'],
  ['drug-carts', 'pasien'], ['chat-messages', 'peserta'], ['doctor-reviews', 'baca: semua'], ['doctor-clinics', 'dokter'], ['practice-schedules', 'baca: semua; tulis: dokter'],
  ['user-profiles', 'pemilik'], ['user-roles', 'admin'], ['activity-logs', 'admin'], ['refresh-tokens', 'admin'],
];
for (const [name, roles] of crud) {
  const tag = 'CRUD';
  op('get', `/${name}`, { tag, summary: `Daftar ${name}`, roles });
  op('post', `/${name}`, { tag, summary: `Buat ${name}`, roles, body: body({ type: 'object', additionalProperties: true }) });
  op('get', `/${name}/{id}`, { tag, summary: `Detail ${name}`, roles, codes: { '404': 'Tidak ditemukan' } });
  op('put', `/${name}/{id}`, { tag, summary: `Ubah ${name}`, roles, body: body({ type: 'object', additionalProperties: true }) });
  op('delete', `/${name}/{id}`, { tag, summary: `Hapus ${name}`, roles });
}

export const openapi: Json = {
  openapi: '3.0.3',
  info: {
    title: 'Harmoni Sehat API',
    version: '1.0.0',
    description:
      'API telemedisin Harmoni Sehat.\n\n**Realtime (Socket.IO)** — koneksi dengan `auth: { token }`. Event chat: `chat:join`, `chat:send`, `chat:typing`, `chat:read` → `chat:message`. Event panggilan WebRTC: `call:invite`, `call:accept`, `call:reject`, `call:signal`, `call:end` → `call:incoming`, `call:accepted`, `call:signal`, `call:ended`. Server → client: `notification`.',
  },
  servers: [{ url: '/api/v1' }],
  security: [{ bearerAuth: [] }],
  tags: ['Auth', 'Booking', 'Dokter', 'Pembayaran', 'Apotek', 'AI', 'Notifikasi', 'Media', 'Artikel', 'Saya', 'Admin', 'CRUD'].map((name) => ({ name })),
  paths,
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    responses: {
      ValidationError: { description: 'Validasi gagal', content: { 'application/json': { schema: ref('Error') } } },
      Unauthorized: { description: 'Belum login / token tidak valid', content: { 'application/json': { schema: ref('Error') } } },
      Forbidden: { description: 'Tidak berhak', content: { 'application/json': { schema: ref('Error') } } },
    },
    schemas: {
      Error: obj({ status: str({ example: 'error' }), message: str() }),
      User: obj({ _id: str(), email: str(), role: obj({ nama_peran: str({ enum: ['pasien', 'dokter', 'farmasi', 'admin', 'superadmin'] }) }) }),
      Slot: obj({ jadwal_id: str(), klinik_id: str(), start: str({ format: 'date-time' }), end: str({ format: 'date-time' }), available: { type: 'boolean' } }),
      RegisterInput: obj(
        {
          email: str({ format: 'email' }), password: str({ description: 'Min. 8, huruf besar+kecil, angka, simbol @$!%*?&' }),
          role: str({ enum: ['pasien', 'dokter', 'farmasi'] }), name: str(),
          nik: str(), tanggal_lahir: str({ format: 'date' }), jenis_kelamin: str({ enum: ['Laki-laki', 'Perempuan'] }), alamat: str(), no_telepon: str(),
          nomor_str: str(), spesialisasi_id: str(), biaya_konsultasi: num(), bio: str(), nomor_sipa: str(),
        },
        ['email', 'password', 'role', 'name'],
      ),
      CompleteInput: obj(
        {
          diagnosa: str(), tindakan: str(), catatan_dokter: str(), tekanan_darah: str(), suhu_tubuh: num(), tinggi_badan: num(), berat_badan: num(),
          alergi: arr(str()), riwayat_penyakit: arr(str()),
          resep: obj({ catatan: str(), berlaku_hari: int(), obat: arr(obj({ obat_id: str(), dosis: str(), jumlah: int(), aturan_pakai: str() }, ['obat_id', 'dosis', 'jumlah', 'aturan_pakai'])) }),
        },
        ['diagnosa'],
      ),
    },
  },
};
