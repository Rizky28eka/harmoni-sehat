import http from 'http';
import { AddressInfo } from 'net';
import { io as client, Socket } from 'socket.io-client';
import app from '../src/app';
import { initSocket } from '../src/sockets';
import { setupDb, teardownDb, clearDb, api, registerPasien, registerDokter, createAdminToken, bearer } from './helpers';
import Consultation from '../src/models/Consultation';
import PracticeSchedule from '../src/models/PracticeSchedule';
import Clinic from '../src/models/Clinic';

let server: http.Server;
let url: string;

beforeAll(async () => {
  await setupDb();
  server = http.createServer(app);
  initSocket(server);
  await new Promise<void>((r) => server.listen(0, r));
  url = `http://localhost:${(server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  server.close();
  await teardownDb();
});
beforeEach(clearDb);

const connect = (token?: string) =>
  new Promise<Socket>((resolve, reject) => {
    const s = client(url, { auth: { token }, transports: ['websocket'], reconnection: false });
    s.on('connect', () => resolve(s));
    s.on('connect_error', (e) => { s.close(); reject(e); });
  });

const emitAck = (s: Socket, ev: string, payload: any) => new Promise<any>((r) => s.emit(ev, payload, r));
const once = (s: Socket, ev: string) => new Promise<any>((r) => s.once(ev, r));

const scheduledConsultation = async () => {
  const d = await registerDokter();
  const p = await registerPasien();
  const dId = (await api().get('/api/v1/auth/me').set(bearer(d.body.token))).body.data.profile._id;
  const pId = (await api().get('/api/v1/auth/me').set(bearer(p.body.token))).body.data.profile._id;
  const clinic = await Clinic.create({ nama: 'K', alamat: 'a', no_telepon: '1', status: 'active' });
  const sched = await PracticeSchedule.create({ dokter_id: dId, klinik_id: clinic._id, hari: 'Senin', jam_mulai: '09:00', jam_selesai: '10:00' });
  const c = await Consultation.create({ pasien_id: pId, dokter_id: dId, jadwal_id: sched._id, tanggal: new Date(Date.now() + 86400000), keluhan: 'test', status: 'scheduled' });
  return { d, p, c };
};

describe('socket chat', () => {
  it('rejects unauthenticated sockets', async () => {
    await expect(connect()).rejects.toBeTruthy();
    await expect(connect('garbage')).rejects.toBeTruthy();
  });

  it('delivers messages between participants and blocks outsiders', async () => {
    const { d, p, c } = await scheduledConsultation();
    const outsider = await registerPasien();
    const sp = await connect(p.body.token);
    const sd = await connect(d.body.token);
    const so = await connect(outsider.body.token);

    expect((await emitAck(sp, 'chat:join', { konsultasiId: String(c._id) })).ok).toBe(true);
    expect((await emitAck(sd, 'chat:join', { konsultasiId: String(c._id) })).ok).toBe(true);
    expect((await emitAck(so, 'chat:join', { konsultasiId: String(c._id) })).ok).toBe(false);

    const incoming = once(sd, 'chat:message');
    const ack = await emitAck(sp, 'chat:send', { konsultasiId: String(c._id), isi: 'Halo dok' });
    expect(ack.ok).toBe(true);
    expect((await incoming).isi).toBe('Halo dok');
    expect((await emitAck(so, 'chat:send', { konsultasiId: String(c._id), isi: 'intip' })).ok).toBe(false);

    // REST history for participants only; recipient got a notification
    const hist = await api().get(`/api/v1/booking/consultations/${c._id}/messages`).set(bearer(p.body.token));
    expect(hist.body.data).toHaveLength(1);
    expect((await api().get(`/api/v1/booking/consultations/${c._id}/messages`).set(bearer(outsider.body.token))).status).toBe(404);
    const notifs = await api().get('/api/v1/notifications').set(bearer(d.body.token));
    expect(notifs.body.data.length).toBeGreaterThan(0);
    const unread = await api().get('/api/v1/notifications/unread-count').set(bearer(d.body.token));
    expect(unread.body.data.count).toBeGreaterThan(0);
    [sp, sd, so].forEach((s) => s.close());
  });

  it('refuses chat when the consultation is not active', async () => {
    const { p, c } = await scheduledConsultation();
    await Consultation.updateOne({ _id: c._id }, { status: 'completed' });
    const sp = await connect(p.body.token);
    await emitAck(sp, 'chat:join', { konsultasiId: String(c._id) });
    expect((await emitAck(sp, 'chat:send', { konsultasiId: String(c._id), isi: 'x' })).error).toBe('consultation_not_active');
    sp.close();
  });
});

describe('webrtc signaling', () => {
  const next = (s: Socket, ev: string) => new Promise<any>((r) => s.once(ev, r));

  it('relays call setup between participants only, and tears down on disconnect', async () => {
    const { d, p, c } = await scheduledConsultation();
    const outsider = await registerPasien();
    const id = String(c._id);
    const sp = await connect(p.body.token);
    const sd = await connect(d.body.token);
    const so = await connect(outsider.body.token);
    await emitAck(sp, 'chat:join', { konsultasiId: id });
    await emitAck(sd, 'chat:join', { konsultasiId: id });

    // Outsider cannot ring, and cannot inject signals.
    expect((await emitAck(so, 'call:invite', { konsultasiId: id })).ok).toBe(false);

    const incoming = next(sd, 'call:incoming');
    expect((await emitAck(sp, 'call:invite', { konsultasiId: id, video: true })).ok).toBe(true);
    expect((await incoming).video).toBe(true);
    expect((await emitAck(sd, 'call:invite', { konsultasiId: id })).error).toBe('busy');

    // The caller cannot accept their own call; the callee can.
    expect((await emitAck(sp, 'call:accept', { konsultasiId: id })).ok).toBe(false);
    const accepted = next(sp, 'call:accepted');
    expect((await emitAck(sd, 'call:accept', { konsultasiId: id })).ok).toBe(true);
    await accepted;

    const offer = next(sd, 'call:signal');
    sp.emit('call:signal', { konsultasiId: id, type: 'offer', data: { sdp: 'v=0', type: 'offer' } });
    expect((await offer).type).toBe('offer');
    so.emit('call:signal', { konsultasiId: id, type: 'offer', data: { sdp: 'evil' } });
    sp.emit('call:signal', { konsultasiId: id, type: 'drop-table', data: {} });

    const ended = next(sd, 'call:ended');
    sp.close();
    expect((await ended).reason).toBe('disconnected');
    [sd, so].forEach((s) => s.close());
  });
});

describe('misc endpoints', () => {
  it('accepts a real PNG upload and rejects a disguised file', async () => {
    const p = await registerPasien();
    const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
    const ok = await api().post('/api/v1/media/upload').set(bearer(p.body.token)).attach('file', png, { filename: 'a.png', contentType: 'image/png' });
    expect(ok.status).toBe(201);
    const bad = await api().post('/api/v1/media/upload').set(bearer(p.body.token)).attach('file', Buffer.from('<script>alert(1)</script>'), { filename: 'a.png', contentType: 'image/png' });
    expect(bad.status).toBe(415);
  });

  it('manages medication reminders per user', async () => {
    const a = await registerPasien();
    const b = await registerPasien();
    const created = await api().post('/api/v1/me/reminders').set(bearer(a.body.token)).send({ nama_obat: 'Amoxicillin', jam: ['08:00', '20:00'] });
    expect(created.status).toBe(201);
    expect((await api().get('/api/v1/me/reminders').set(bearer(b.body.token))).body.data).toHaveLength(0);
    expect((await api().put(`/api/v1/me/reminders/${created.body.data._id}`).set(bearer(b.body.token)).send({ is_active: false })).status).toBe(404);
    expect((await api().post('/api/v1/me/reminders').set(bearer(a.body.token)).send({ nama_obat: 'X', jam: ['25:99'] })).status).toBe(400);
  });

  it('serves AI emergency guidance without calling the model', async () => {
    const p = await registerPasien();
    const r = await api().post('/api/v1/gemini/chat').set(bearer(p.body.token)).send({ message: 'Saya nyeri dada dan sesak napas' });
    expect(r.status).toBe(200);
    expect(r.body.data.emergency).toBe(true);
  });

  it('deletes an account after password confirmation', async () => {
    const p = await registerPasien();
    expect((await api().delete('/api/v1/me/account').set(bearer(p.body.token)).send({ password: 'wrong' })).status).toBe(401);
    expect((await api().delete('/api/v1/me/account').set(bearer(p.body.token)).send({ password: 'Passw0rd!x' })).status).toBe(200);
    expect((await api().get('/api/v1/auth/me').set(bearer(p.body.token))).status).toBe(403);
    await createAdminToken();
  });
});
