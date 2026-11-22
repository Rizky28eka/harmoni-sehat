/**
 * Creates fictional demo activity through the public API so every screen has something to show:
 * a live consultation with chat, a completed one (record, prescription, review), an upcoming one,
 * medication reminders, a pharmacy order, and two registrations waiting for admin verification.
 *
 * Usage (API running, database seeded with `npm run seed`):
 *   node scripts/demo-activity.js            # API_URL defaults to http://localhost:8000
 *
 * Local development only: it refuses to run against a non-local API unless ALLOW_REMOTE=1.
 */
const { io } = require('socket.io-client');

const ROOT = (process.env.API_URL || 'http://localhost:8000').replace(/\/$/, '');
const BASE = `${ROOT}/api/v1`;
const PASSWORD = process.env.SEED_PASSWORD || 'Harmoni123!';

if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(ROOT) && process.env.ALLOW_REMOTE !== '1') {
  console.error(`Refusing to write demo data to ${ROOT}. Set ALLOW_REMOTE=1 to override.`);
  process.exit(1);
}

let failures = 0;
const call = async (method, path, token, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (res.status >= 400) {
    failures++;
    console.error(`  ! ${method} ${path} -> ${res.status} ${JSON.stringify(json).slice(0, 160)}`);
  }
  return json;
};
const login = async (email) => (await call('POST', '/auth/login', null, { email, password: PASSWORD })).token;
const connect = (token) => new Promise((resolve) => {
  const s = io(ROOT, { auth: { token }, transports: ['websocket'] });
  s.on('connect', () => resolve(s));
});
const emit = (s, event, payload) => new Promise((resolve) => s.emit(event, payload, resolve));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The next Monday (the seeded doctors work Monday to Friday), as YYYY-MM-DD. */
const nextWeekday = () => {
  const d = new Date();
  do d.setDate(d.getDate() + 1); while ([0, 6].includes(d.getDay()));
  return d.toISOString().slice(0, 10);
};

(async () => {
  const [patient, doctor, pharmacist] = await Promise.all([
    login('pasien@harmoni.test'), login('dokter1@harmoni.test'), login('apoteker@harmoni.test'),
  ]);
  if (!patient || !doctor || !pharmacist) throw new Error('Login failed. Did you run `npm run seed`?');

  const doctorId = (await call('GET', '/auth/me', doctor)).data.profile._id;
  const slots = (await call('GET', `/booking/doctors/${doctorId}/slots?date=${nextWeekday()}`, patient)).data.filter((s) => s.available);
  const drugs = (await call('GET', '/shop/drugs?limit=20', patient)).data.data;
  const drug = (prefix) => drugs.find((d) => d.nama.startsWith(prefix));

  const book = async (slot, keluhan) => {
    const res = await call('POST', '/booking/consultations', patient, { dokter_id: doctorId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan });
    const orderId = res.data?.transaction?.order_id ?? res.data?.transaksi?.order_id ?? res.data?.order_id;
    if (orderId) await call('POST', `/payments/${orderId}/simulate`, patient, { outcome: 'success' }); // sandbox only
    return res.data?.consultation ?? res.data;
  };

  console.log('Live consultation with chat…');
  const live = await book(slots[0], 'Fever and sore throat for two days');
  await call('POST', `/booking/consultations/${live._id}/start`, doctor);
  const [sp, sd] = await Promise.all([connect(patient), connect(doctor)]);
  await emit(sp, 'chat:join', { konsultasiId: live._id });
  await emit(sd, 'chat:join', { konsultasiId: live._id });
  for (const [socket, text] of [
    [sp, 'Good morning, doctor. I have had a fever and a sore throat for two days.'],
    [sd, 'Good morning. Is your temperature above 38°C, and do you have a cough?'],
    [sp, 'Around 38.2°C this morning, no cough, just a sore throat and some fatigue.'],
    [sd, 'Thank you. Please rest, drink plenty of water, and I will prescribe something for the fever.'],
  ]) { await emit(socket, 'chat:send', { konsultasiId: live._id, isi: text }); await sleep(300); }
  sp.close(); sd.close();

  console.log('Completed consultation with prescription and review…');
  const done = await book(slots[3], 'Seasonal allergy: itchy eyes and sneezing');
  await call('POST', `/booking/consultations/${done._id}/start`, doctor);
  await call('POST', `/booking/consultations/${done._id}/complete`, doctor, {
    diagnosa: 'Allergic rhinitis',
    tindakan: 'Antihistamine therapy',
    catatan_dokter: 'Avoid dust and cold drinks. Return if symptoms persist beyond one week.',
    tekanan_darah: '118/76', suhu_tubuh: 36.7, tinggi_badan: 172, berat_badan: 66, alergi: ['Dust'],
    resep: {
      catatan: 'Take after meals', berlaku_hari: 14,
      obat: [
        { obat_id: String(drug('Cetirizine')._id), dosis: '10 mg', jumlah: 10, aturan_pakai: '1 tablet once daily at night' },
        { obat_id: String(drug('Paracetamol')._id), dosis: '500 mg', jumlah: 6, aturan_pakai: '1 tablet when needed, max 3 per day' },
      ],
    },
  });
  await call('POST', `/booking/consultations/${done._id}/review`, patient, { rating: 5, komentar: 'Clear explanation and very helpful.' });

  console.log('Upcoming consultation…');
  await book(slots[6], 'Follow-up check after medication');

  console.log('Reminders…');
  await call('POST', '/me/reminders', patient, { nama_obat: 'Paracetamol 500 mg', dosis: '1 tablet', jam: ['08:00', '14:00', '20:00'], catatan: 'After meals' });
  await call('POST', '/me/reminders', patient, { nama_obat: 'Vitamin C 500 mg', dosis: '1 tablet', jam: ['07:30'] });

  console.log('Pharmacy order…');
  for (const [prefix, qty] of [['Vitamin C', 2], ['Antasida', 1]]) {
    await call('PUT', '/shop/cart/items', patient, { obat_id: String(drug(prefix)._id), jumlah: qty });
  }
  const checkout = (await call('POST', '/shop/checkout', patient, { alamat_pengiriman: 'Jl. Melati No. 12, Jakarta Selatan' })).data;
  if (checkout?.transaction) await call('POST', `/payments/${checkout.transaction.order_id}/simulate`, patient, { outcome: 'success' }); // sandbox only
  if (checkout?.order) await call('POST', `/shop/orders/${checkout.order._id}/advance`, pharmacist, {});

  console.log('Registrations waiting for verification…');
  await call('POST', '/auth/register', null, { email: 'dokter.baru@harmoni.test', password: PASSWORD, role: 'dokter', name: 'dr. Laras Prameswari, Sp.M', nomor_str: 'STR-9001' });
  await call('POST', '/auth/register', null, { email: 'apoteker.baru@harmoni.test', password: PASSWORD, role: 'farmasi', name: 'Raka Nugroho, S.Farm', nomor_sipa: 'SIPA-7001' });

  console.log(failures ? `Finished with ${failures} failed call(s).` : 'Done. No failed calls.');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
