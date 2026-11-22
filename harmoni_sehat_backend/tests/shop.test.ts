import { setupDb, teardownDb, clearDb, api, registerPasien, registerFarmasi, createAdminToken, bearer } from './helpers';
import Drug from '../src/models/Drug';

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(clearDb);

const mkDrug = (over: any = {}) =>
  Drug.create({ nama: `Obat ${Math.random()}`, kategori: 'Vitamin', stok: 5, satuan: 'strip', harga: 10000, kode_obat: `K${Math.random()}`, butuh_resep: false, tgl_kadaluarsa: new Date(Date.now() + 365 * 86400000), ...over });

describe('shop', () => {
  it('runs cart -> checkout -> pay -> fulfil with atomic stock', async () => {
    const admin = await createAdminToken();
    const pas = await registerPasien();
    const far = await registerFarmasi();
    const farId = (await api().get('/api/v1/auth/me').set(bearer(far.body.token))).body.data.profile._id;
    await api().post(`/api/v1/admins/manage/verify/farmasi/${farId}`).set(bearer(admin)).send({});
    const drug = await mkDrug();
    const t = pas.body.token;

    // cannot exceed stock
    expect((await api().put('/api/v1/shop/cart/items').set(bearer(t)).send({ obat_id: String(drug._id), jumlah: 9 })).status).toBe(409);
    const cart = await api().put('/api/v1/shop/cart/items').set(bearer(t)).send({ obat_id: String(drug._id), jumlah: 2 });
    expect(cart.body.data.total).toBe(20000);

    const co = await api().post('/api/v1/shop/checkout').set(bearer(t)).send({});
    expect(co.status).toBe(201);
    expect(co.body.data.order.total_harga).toBe(20000);
    expect((await Drug.findById(drug._id))!.stok).toBe(3);

    // another patient cannot see/cancel it
    const other = await registerPasien();
    const oid = co.body.data.order._id;
    expect((await api().get(`/api/v1/shop/orders/${oid}`).set(bearer(other.body.token))).status).toBe(404);

    // pharmacist cannot advance an unpaid order
    expect((await api().post(`/api/v1/shop/orders/${oid}/advance`).set(bearer(far.body.token)).send({})).status).toBe(409);

    await api().post(`/api/v1/payments/${co.body.data.transaction.order_id}/simulate`).set(bearer(t)).send({});
    const paid = await api().get(`/api/v1/shop/orders/${oid}`).set(bearer(far.body.token));
    expect(paid.body.data.status).toBe('processing');

    const ship = await api().post(`/api/v1/shop/orders/${oid}/advance`).set(bearer(far.body.token)).send({ no_resi: 'JNE123' });
    expect(ship.body.data.status).toBe('shipped');
    const done = await api().post(`/api/v1/shop/orders/${oid}/advance`).set(bearer(t)).send({});
    expect(done.body.data.status).toBe('delivered');
  });

  it('restocks when an unpaid order is cancelled and when payment fails', async () => {
    const pas = await registerPasien();
    const drug = await mkDrug({ stok: 4 });
    const t = pas.body.token;
    await api().put('/api/v1/shop/cart/items').set(bearer(t)).send({ obat_id: String(drug._id), jumlah: 4 });
    const co = await api().post('/api/v1/shop/checkout').set(bearer(t)).send({});
    expect((await Drug.findById(drug._id))!.stok).toBe(0);
    const c = await api().post(`/api/v1/shop/orders/${co.body.data.order._id}/cancel`).set(bearer(t)).send({});
    expect(c.body.data.status).toBe('cancelled');
    expect((await Drug.findById(drug._id))!.stok).toBe(4);

    await api().put('/api/v1/shop/cart/items').set(bearer(t)).send({ obat_id: String(drug._id), jumlah: 1 });
    const co2 = await api().post('/api/v1/shop/checkout').set(bearer(t)).send({});
    await api().post(`/api/v1/payments/${co2.body.data.transaction.order_id}/simulate`).set(bearer(t)).send({ outcome: 'failed' });
    expect((await Drug.findById(drug._id))!.stok).toBe(4);
  });

  it('blocks prescription-only drugs without a valid prescription', async () => {
    const pas = await registerPasien();
    const drug = await mkDrug({ butuh_resep: true });
    const t = pas.body.token;
    await api().put('/api/v1/shop/cart/items').set(bearer(t)).send({ obat_id: String(drug._id), jumlah: 1 });
    const co = await api().post('/api/v1/shop/checkout').set(bearer(t)).send({});
    expect(co.status).toBe(403);
    expect((await Drug.findById(drug._id))!.stok).toBe(5);
  });

  it('prevents overselling under concurrent checkouts', async () => {
    const drug = await mkDrug({ stok: 1 });
    const users = await Promise.all([registerPasien(), registerPasien(), registerPasien()]);
    for (const u of users) await api().put('/api/v1/shop/cart/items').set(bearer(u.body.token)).send({ obat_id: String(drug._id), jumlah: 1 });
    const res = await Promise.all(users.map((u) => api().post('/api/v1/shop/checkout').set(bearer(u.body.token)).send({})));
    expect(res.filter((r) => r.status === 201)).toHaveLength(1);
    expect((await Drug.findById(drug._id))!.stok).toBe(0);
  });
});
