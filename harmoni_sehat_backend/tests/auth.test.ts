import { setupDb, teardownDb, clearDb, api, registerPasien, registerDokter, createAdminToken, bearer, PASSWORD } from './helpers';

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(clearDb);

describe('auth', () => {
  it('registers a pasien and logs in', async () => {
    const reg = await registerPasien();
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeTruthy();
    expect(reg.body.refreshToken).toBeTruthy();
    expect(reg.body.data.user.password).toBeUndefined();

    const login = await api().post('/api/v1/auth/login').send({ email: reg.body.data.user.email, password: PASSWORD });
    expect(login.status).toBe(200);
  });

  it('refuses to self-register as admin', async () => {
    const res = await registerPasien({ role: 'admin' });
    expect(res.status).toBe(400);
  });

  it('rejects weak passwords and wrong credentials', async () => {
    expect((await registerPasien({ password: 'weak' })).status).toBe(400);
    const reg = await registerPasien();
    const bad = await api().post('/api/v1/auth/login').send({ email: reg.body.data.user.email, password: 'Nope1234!' });
    expect(bad.status).toBe(401);
  });

  it('blocks NoSQL operator injection on login', async () => {
    await registerPasien();
    const res = await api().post('/api/v1/auth/login').send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });

  it('rotates refresh tokens and rejects reuse', async () => {
    const reg = await registerPasien();
    const r1 = await api().post('/api/v1/auth/refresh').send({ refreshToken: reg.body.refreshToken });
    expect(r1.status).toBe(200);
    const reuse = await api().post('/api/v1/auth/refresh').send({ refreshToken: reg.body.refreshToken });
    expect(reuse.status).toBe(401);
  });

  it('does not reveal whether an email exists on forgot-password', async () => {
    const res = await api().post('/api/v1/auth/forgot-password').send({ email: 'nobody@test.com' });
    expect(res.status).toBe(200);
  });

  it('creates doctors unverified/inactive', async () => {
    const reg = await registerDokter();
    expect(reg.status).toBe(201);
    const token = reg.body.token;
    const me = await api().get('/api/v1/auth/me').set(bearer(token));
    expect(me.body.data.profile.is_verified).toBe(false);
    expect(me.body.data.profile.status).toBe('inactive');
  });
});

describe('authorization', () => {
  const protectedGets = [
    '/api/v1/consultations', '/api/v1/medical-records', '/api/v1/prescriptions', '/api/v1/drug-orders',
    '/api/v1/transactions', '/api/v1/patients', '/api/v1/users', '/api/v1/notifications', '/api/v1/drugs',
    '/api/v1/doctors', '/api/v1/chat-messages', '/api/v1/pharmacists', '/api/v1/admins',
  ];
  it.each(protectedGets)('requires login for GET %s', async (path) => {
    expect((await api().get(path)).status).toBe(401);
  });

  it('keeps public reads public', async () => {
    expect((await api().get('/api/v1/specializations')).status).toBe(200);
    expect((await api().get('/api/v1/health-articles')).status).toBe(200);
  });

  it('forbids non-admins from admin resources', async () => {
    const reg = await registerPasien();
    const t = reg.body.token;
    expect((await api().get('/api/v1/users').set(bearer(t))).status).toBe(403);
    expect((await api().get('/api/v1/roles').set(bearer(t))).status).toBe(403);
    expect((await api().get('/api/v1/admins').set(bearer(t))).status).toBe(403);
    expect((await api().post('/api/v1/specializations').set(bearer(t)).send({ nama: 'x' })).status).toBe(403);
  });

  it('lets admins list users', async () => {
    const admin = await createAdminToken();
    const res = await api().get('/api/v1/users').set(bearer(admin));
    expect(res.status).toBe(200);
  });

  it('isolates patient data: pasien cannot read another pasien', async () => {
    const a = await registerPasien();
    const b = await registerPasien();
    const idB = (await api().get('/api/v1/auth/me').set(bearer(b.body.token))).body.data.profile._id;
    const res = await api().get(`/api/v1/patients/${idB}`).set(bearer(a.body.token));
    expect(res.status).toBe(404);
    const list = await api().get('/api/v1/patients').set(bearer(a.body.token));
    expect(list.body.data).toHaveLength(1);
  });
});
