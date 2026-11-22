// Must run before anything imports src/config/env.ts: simulates a configured gateway + TURN server.
process.env.MIDTRANS_SERVER_KEY = 'SB-Mid-server-test';
process.env.TURN_URLS = 'turn:turn.example.com:3478';
process.env.TURN_SECRET = 'turn-shared-secret';

import crypto from 'crypto';
import { setupDb, teardownDb, clearDb, api, registerPasien, registerDokter, createAdminToken, bearer } from './helpers';
import Transaction from '../src/models/Transaction';
import Consultation from '../src/models/Consultation';
import PracticeSchedule from '../src/models/PracticeSchedule';
import Clinic from '../src/models/Clinic';
import { settleTransaction } from '../src/services/payment';
import { getIceServers } from '../src/services/ice';
import { DAY_NAMES } from '../src/services/schedule';

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(clearDb);

const realFetch = global.fetch;
const calls: { url: string; body: any }[] = [];
let refundReply: any = { status_code: '200', status_message: 'Success' };

beforeEach(() => {
  calls.length = 0;
  refundReply = { status_code: '200', status_message: 'Success' };
  (global as any).fetch = jest.fn(async (url: string, init: any) => {
    const body = init?.body ? JSON.parse(init.body) : {};
    calls.push({ url, body });
    if (String(url).includes('/snap/')) return { ok: true, status: 201, json: async () => ({ token: 'snap-token', redirect_url: 'https://pay.example/redirect' }) };
    return { ok: true, status: 200, json: async () => refundReply };
  });
});
afterAll(() => { global.fetch = realFetch; });

const bookPaid = async () => {
  const admin = await createAdminToken();
  const d = await registerDokter();
  const dId = (await api().get('/api/v1/auth/me').set(bearer(d.body.token))).body.data.profile._id;
  await api().post(`/api/v1/admins/manage/verify/dokter/${dId}`).set(bearer(admin)).send({});
  const clinic = await Clinic.create({ nama: 'K', alamat: 'a', no_telepon: '1', status: 'active' });
  const date = new Date(Date.now() + 5 * 86400000 + 7 * 3600000).toISOString().slice(0, 10);
  await PracticeSchedule.create({ dokter_id: dId, klinik_id: clinic._id, hari: DAY_NAMES[new Date(`${date}T12:00:00+07:00`).getUTCDay()], jam_mulai: '09:00', jam_selesai: '10:00' });
  const p = await registerPasien();
  const slot = (await api().get(`/api/v1/booking/doctors/${dId}/slots?date=${date}`).set(bearer(p.body.token))).body.data[0];
  const book = await api().post('/api/v1/booking/consultations').set(bearer(p.body.token)).send({ dokter_id: dId, jadwal_id: slot.jadwal_id, start: slot.start, keluhan: 'Demam tinggi' });
  const orderId = book.body.data.transaction.order_id;
  await settleTransaction(orderId);
  return { admin, p, orderId, cid: book.body.data.consultation._id };
};

describe('payment gateway', () => {
  it('creates a Snap transaction when a server key is configured', async () => {
    const { orderId } = await bookPaid();
    const snap = calls.find((c) => c.url.includes('/snap/'))!;
    expect(snap.body.transaction_details.order_id).toBe(orderId);
    expect(snap.body.transaction_details.gross_amount).toBe(50000);
    expect((await Transaction.findOne({ order_id: orderId }))!.payment_token).toBe('snap-token');
  });

  it('refunds through the gateway on cancel and records it (idempotent key)', async () => {
    const { p, orderId, cid } = await bookPaid();
    // Move the slot far enough away that a free cancellation is allowed.
    await Consultation.updateOne({ _id: cid }, { tanggal: new Date(Date.now() + 3 * 86400000) });
    const cancel = await api().post(`/api/v1/booking/consultations/${cid}/cancel`).set(bearer(p.body.token)).send({});
    expect(cancel.status).toBe(200);
    const refund = calls.find((c) => c.url.includes('/refund'))!;
    expect(refund.url).toContain(`/${orderId}/refund`);
    expect(refund.body).toMatchObject({ refund_key: `rf-${orderId}`, amount: 50000 });
    const tx = (await Transaction.findOne({ order_id: orderId }))!;
    expect(tx.status).toBe('refunded');
    expect(tx.refund_status).toBe('refunded');
  });

  it('flags a rejected refund for admin retry instead of losing it', async () => {
    const { admin, p, orderId, cid } = await bookPaid();
    await Consultation.updateOne({ _id: cid }, { tanggal: new Date(Date.now() + 3 * 86400000) });
    refundReply = { status_code: '412', status_message: 'Transaction status cannot be updated' };
    expect((await api().post(`/api/v1/booking/consultations/${cid}/cancel`).set(bearer(p.body.token)).send({})).status).toBe(200);

    let tx = (await Transaction.findOne({ order_id: orderId }))!;
    expect(tx.status).toBe('completed');
    expect(tx.refund_status).toBe('failed');
    expect(tx.refund_error).toContain('412');

    const failed = await api().get('/api/v1/admins/manage/refunds/failed').set(bearer(admin));
    expect(failed.body.data.map((t: any) => t.order_id)).toContain(orderId);
    expect((await api().get('/api/v1/admins/manage/refunds/failed').set(bearer(p.body.token))).status).toBe(403);

    refundReply = { status_code: '200', status_message: 'Success' };
    const retry = await api().post(`/api/v1/admins/manage/refunds/${orderId}/retry`).set(bearer(admin)).send({});
    expect(retry.status).toBe(200);
    tx = (await Transaction.findOne({ order_id: orderId }))!;
    expect(tx.status).toBe('refunded');
    expect(tx.refund_error).toBeUndefined();
  });

  it('accepts only correctly signed webhooks', async () => {
    const { orderId } = await bookPaid();
    await Transaction.updateOne({ order_id: orderId }, { status: 'pending' });
    const payload = { order_id: orderId, status_code: '200', gross_amount: '50000.00', transaction_status: 'settlement', transaction_id: 'T1' };
    const sig = crypto.createHash('sha512').update(`${orderId}20050000.00SB-Mid-server-test`).digest('hex');
    expect((await api().post('/api/v1/payments/webhook').send({ ...payload, signature_key: 'bad' })).status).toBe(403);
    expect((await api().post('/api/v1/payments/webhook').send({ ...payload, signature_key: sig })).status).toBe(200);
    expect((await Transaction.findOne({ order_id: orderId }))!.status).toBe('completed');
  });
});

describe('ICE servers', () => {
  it('mints short-lived TURN credentials that coturn can verify', () => {
    const now = Date.UTC(2026, 0, 1);
    const [stun, turn] = getIceServers('user42', 600, now);
    expect(stun.urls[0]).toContain('stun:');
    const expiry = Math.floor(now / 1000) + 600;
    expect(turn.username).toBe(`${expiry}:user42`);
    expect(turn.credential).toBe(crypto.createHmac('sha1', 'turn-shared-secret').update(turn.username!).digest('base64'));
  });

  it('is exposed to authenticated users only', async () => {
    expect((await api().get('/api/v1/booking/ice-servers')).status).toBe(401);
    const p = await registerPasien();
    const r = await api().get('/api/v1/booking/ice-servers').set(bearer(p.body.token));
    expect(r.body.data.iceServers.length).toBe(2);
  });
});
