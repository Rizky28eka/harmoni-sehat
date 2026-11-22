import { setupDb, teardownDb, clearDb, api, registerPasien, registerDokter, createAdminToken, bearer } from './helpers';
import PracticeSchedule from '../src/models/PracticeSchedule';
import Clinic from '../src/models/Clinic';
import { DAY_NAMES } from '../src/services/schedule';

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(clearDb);

const futureDate = (days: number) => new Date(Date.now() + days * 86400000 + 7 * 3600000).toISOString().slice(0, 10);

const setup = async () => {
  const admin = await createAdminToken();
  const d = await registerDokter();
  const dokterToken = d.body.token as string;
  const dokterId = (await api().get('/api/v1/auth/me').set(bearer(dokterToken))).body.data.profile._id as string;
  await api().post(`/api/v1/admins/manage/verify/dokter/${dokterId}`).set(bearer(admin)).send({});

  const clinic = await Clinic.create({ nama: 'Klinik Sehat', alamat: 'Jl. A', no_telepon: '021', status: 'active' });
  const date = futureDate(3);
  const hari = new Date(`${date}T12:00:00+07:00`).getUTCDay();
  await PracticeSchedule.create({ dokter_id: dokterId, klinik_id: clinic._id, hari: DAY_NAMES[hari], jam_mulai: '09:00', jam_selesai: '11:00', durasi_menit: 30 });
  const p = await registerPasien();
  return { admin, dokterToken, dokterId, date, pasienToken: p.body.token as string };
};

describe('booking flow', () => {
  it('only lists verified doctors', async () => {
    const d = await registerDokter();
    const p = await registerPasien();
    const list = await api().get('/api/v1/booking/doctors').set(bearer(p.body.token));
    expect(list.body.data.total).toBe(0);
    expect(d.status).toBe(201);
  });

  it('books, pays (mock), chats, completes with prescription, and reviews', async () => {
    const { dokterToken, dokterId, date, pasienToken } = await setup();

    const docs = await api().get('/api/v1/booking/doctors').set(bearer(pasienToken));
    expect(docs.body.data.total).toBe(1);

    const slots = await api().get(`/api/v1/booking/doctors/${dokterId}/slots?date=${date}`).set(bearer(pasienToken));
    expect(slots.body.data).toHaveLength(4);
    const slot = slots.body.data[0];

    const book = await api().post('/api/v1/booking/consultations').set(bearer(pasienToken))
      .send({ dokter_id: dokterId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan: 'Demam tiga hari' });
    expect(book.status).toBe(201);
    expect(book.body.data.consultation.status).toBe('pending');
    const orderId = book.body.data.transaction.order_id;
    const cid = book.body.data.consultation._id;

    // slot is now taken -> double booking refused
    const p2 = await registerPasien();
    const dup = await api().post('/api/v1/booking/consultations').set(bearer(p2.body.token))
      .send({ dokter_id: dokterId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan: 'Batuk lama' });
    expect(dup.status).toBe(409);

    // other patient cannot see it nor pay for it
    expect((await api().get(`/api/v1/booking/consultations/${cid}`).set(bearer(p2.body.token))).status).toBe(404);
    expect((await api().post(`/api/v1/payments/${orderId}/simulate`).set(bearer(p2.body.token))).status).toBe(404);

    // pay
    const pay = await api().post(`/api/v1/payments/${orderId}/simulate`).set(bearer(pasienToken)).send({});
    expect(pay.body.data.status).toBe('completed');
    const detail = await api().get(`/api/v1/booking/consultations/${cid}`).set(bearer(dokterToken));
    expect(detail.body.data.status).toBe('scheduled');
    expect(detail.body.data.video_call_url).toContain('meet.jit.si');

    // complete with prescription (needs a drug)
    const Drug = (await import('../src/models/Drug')).default;
    const drug = await Drug.create({ nama: 'Paracetamol', kategori: 'Analgesik', stok: 100, satuan: 'strip', harga: 5000, kode_obat: 'PCT1', butuh_resep: false, tgl_kadaluarsa: new Date(Date.now() + 365 * 86400000) });
    const done = await api().post(`/api/v1/booking/consultations/${cid}/complete`).set(bearer(dokterToken)).send({
      diagnosa: 'Demam viral', resep: { obat: [{ obat_id: String(drug._id), dosis: '500mg', jumlah: 10, aturan_pakai: '3x1' }] },
    });
    expect(done.status).toBe(200);
    expect(done.body.data.prescription).toBeTruthy();

    // patient can read own record; other patient cannot
    const rec = await api().get('/api/v1/medical-records').set(bearer(pasienToken));
    expect(rec.body.data).toHaveLength(1);
    expect((await api().get('/api/v1/medical-records').set(bearer(p2.body.token))).body.data).toHaveLength(0);
    expect(rec.body.data[0].diagnosis).toBe('Demam viral');
    const raw: any = await (await import('../src/models/MedicalRecord')).default.collection.findOne({});
    expect(raw.diagnosis.startsWith('enc:v1:')).toBe(true);

    const recId = rec.body.data[0]._id;
    expect((await api().get(`/api/v1/me/medical-records/${recId}/pdf-link`).set(bearer(p2.body.token))).status).toBe(404);
    const link = await api().get(`/api/v1/me/medical-records/${recId}/pdf-link`).set(bearer(pasienToken));
    expect(link.status).toBe(200);
    expect(link.body.data.url).toContain('/pdf?t=');
    expect((await api().get(`/api/v1/me/medical-records/${recId}/pdf?t=bogus`)).status).toBe(401);

    const review = await api().post(`/api/v1/booking/consultations/${cid}/review`).set(bearer(pasienToken)).send({ rating: 5, komentar: 'Mantap' });
    expect(review.status).toBe(201);
    const detailDoc = await api().get(`/api/v1/booking/doctors/${dokterId}`).set(bearer(pasienToken));
    expect(detailDoc.body.data.rating).toBe(5);
  });

  it('cancelling a pending booking frees the slot', async () => {
    const { dokterId, date, pasienToken } = await setup();
    const slot = (await api().get(`/api/v1/booking/doctors/${dokterId}/slots?date=${date}`).set(bearer(pasienToken))).body.data[1];
    const book = await api().post('/api/v1/booking/consultations').set(bearer(pasienToken))
      .send({ dokter_id: dokterId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan: 'Sakit kepala' });
    const cancel = await api().post(`/api/v1/booking/consultations/${book.body.data.consultation._id}/cancel`).set(bearer(pasienToken)).send({});
    expect(cancel.status).toBe(200);
    const again = await api().post('/api/v1/booking/consultations').set(bearer(pasienToken))
      .send({ dokter_id: dokterId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan: 'Sakit kepala lagi' });
    expect(again.status).toBe(201);
  });

  it('rejects a start time that is not a real slot', async () => {
    const { dokterId, date, pasienToken } = await setup();
    const slot = (await api().get(`/api/v1/booking/doctors/${dokterId}/slots?date=${date}`).set(bearer(pasienToken))).body.data[0];
    const odd = new Date(new Date(slot.start).getTime() + 7 * 60000).toISOString();
    const res = await api().post('/api/v1/booking/consultations').set(bearer(pasienToken))
      .send({ dokter_id: dokterId, jadwal_id: slot.jadwal_id, start: odd, keluhan: 'Tes slot' });
    expect(res.status).toBe(400);
  });
});
