import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app';
import { ensureRoles } from '../src/utils/bootstrap';
import User from '../src/models/User';
import Role from '../src/models/Role';
import Admin from '../src/models/Admin';

let mongod: MongoMemoryServer;

export const setupDb = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await ensureRoles();
};

export const teardownDb = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

export const clearDb = async () => {
  const keep = new Set(['roles']);
  for (const c of Object.values(mongoose.connection.collections)) {
    if (!keep.has(c.collectionName)) await c.deleteMany({});
  }
};

export const api = () => request(app);

let n = 0;
const uniq = () => `${Date.now()}${++n}`;
export const PASSWORD = 'Passw0rd!x';

export const registerPasien = async (overrides: Record<string, any> = {}) => {
  const id = uniq();
  const res = await api()
    .post('/api/v1/auth/register')
    .send({
      email: `pasien${id}@test.com`,
      password: PASSWORD,
      role: 'pasien',
      name: `Pasien ${id}`,
      nik: id.padStart(16, '1').slice(-16),
      tanggal_lahir: '1995-01-01',
      jenis_kelamin: 'Laki-laki',
      alamat: 'Jl. Test 1',
      no_telepon: '08123456789',
      ...overrides,
    });
  return res;
};

export const registerDokter = async (overrides: Record<string, any> = {}) => {
  const id = uniq();
  return api()
    .post('/api/v1/auth/register')
    .send({
      email: `dokter${id}@test.com`,
      password: PASSWORD,
      role: 'dokter',
      name: `dr. ${id}`,
      nomor_str: `STR${id}`,
      biaya_konsultasi: 50000,
      ...overrides,
    });
};

export const registerFarmasi = async (overrides: Record<string, any> = {}) => {
  const id = uniq();
  return api()
    .post('/api/v1/auth/register')
    .send({
      email: `farmasi${id}@test.com`,
      password: PASSWORD,
      role: 'farmasi',
      name: `Apt ${id}`,
      nomor_sipa: `SIPA${id}`,
      ...overrides,
    });
};

/** Creates an admin directly in the DB (admins cannot self-register) and logs in. */
export const createAdminToken = async () => {
  const id = uniq();
  const role = await Role.findOne({ nama_peran: 'admin' });
  const user = await User.create({ email: `admin${id}@test.com`, password: PASSWORD, role: role!._id });
  await Admin.create({ user_id: user._id, nama: 'Admin' });
  const res = await api().post('/api/v1/auth/login').send({ email: user.email, password: PASSWORD });
  return res.body.token as string;
};

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
