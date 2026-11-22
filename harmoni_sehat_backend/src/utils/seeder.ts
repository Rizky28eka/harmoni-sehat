import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import { ensureRoles } from './bootstrap';
import { requestContext } from './requestContext';

import User from '../models/User';
import Role from '../models/Role';
import Dokter from '../models/Dokter';
import Apoteker from '../models/Apoteker';
import Pasien from '../models/Pasien';
import Admin from '../models/Admin';
import Specialization from '../models/Specialization';
import Clinic from '../models/Clinic';
import PracticeSchedule from '../models/PracticeSchedule';
import PaymentMethod from '../models/PaymentMethod';
import Drug from '../models/Drug';
import HealthArticle from '../models/HealthArticle';

dotenv.config();

const PASSWORD = process.env.SEED_PASSWORD || 'Harmoni123!';

const seed = async () => {
  if (process.env.NODE_ENV === 'production') throw new Error('Refusing to seed a production database');
  await connectDB();
  console.log('Clearing collections...');
  for (const c of Object.values(mongoose.connection.collections)) await c.deleteMany({});
  await ensureRoles();

  const role = async (name: string) => (await Role.findOne({ nama_peran: name }))!._id;
  const mkUser = async (email: string, r: string) => User.create({ email, password: PASSWORD, role: await role(r) });

  // Everything below is trusted seeding: bypass row-level scoping.
  await requestContext.run({ system: true }, async () => {
    const admin = await mkUser('admin@harmoni.test', 'admin');
    await Admin.create({ user_id: admin._id, nama: 'Administrator' });

    const specs = await Specialization.insertMany([
      { nama: 'Umum', deskripsi: 'Dokter umum' },
      { nama: 'Anak', deskripsi: 'Dokter spesialis anak' },
      { nama: 'Penyakit Dalam', deskripsi: 'Spesialis penyakit dalam' },
      { nama: 'Kulit dan Kelamin', deskripsi: 'Spesialis kulit' },
      { nama: 'THT', deskripsi: 'Telinga, hidung, tenggorokan' },
    ]);
    const clinic = await Clinic.create({ nama: 'Klinik Harmoni Sehat', alamat: 'Jl. Sehat No. 1, Jakarta', no_telepon: '021123456', email: 'klinik@harmoni.test', status: 'active' });

    const doctors = [
      ['dr. Andi Pratama', 0, 75000], ['dr. Sari Wulandari, Sp.A', 1, 150000],
      ['dr. Budi Santoso, Sp.PD', 2, 200000], ['dr. Maya Putri, Sp.KK', 3, 175000],
    ] as const;
    let i = 0;
    for (const [nama, specIdx, fee] of doctors) {
      const u = await mkUser(`dokter${++i}@harmoni.test`, 'dokter');
      const d = await Dokter.create({ user_id: u._id, nama, nomor_str: `STR-000${i}`, spesialisasi_id: specs[specIdx]._id, biaya_konsultasi: fee, bio: `${nama} berpengalaman lebih dari 8 tahun.`, status: 'active', is_verified: true });
      for (const hari of ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const) {
        await PracticeSchedule.create({ dokter_id: d._id, klinik_id: clinic._id, hari, jam_mulai: '09:00', jam_selesai: '15:00', durasi_menit: 30 });
      }
    }

    const apt = await mkUser('apoteker@harmoni.test', 'farmasi');
    await Apoteker.create({ user_id: apt._id, nama: 'Apt. Rina Kusuma', nomor_sipa: 'SIPA-0001', is_verified: true });

    const pas = await mkUser('pasien@harmoni.test', 'pasien');
    await Pasien.create({ user_id: pas._id, nama: 'Pasien Demo', nik: '3174010101900001', tanggal_lahir: new Date('1990-01-01'), jenis_kelamin: 'Laki-laki', alamat: 'Jl. Demo No. 5, Jakarta', no_telepon: '081234567890' });

    await PaymentMethod.insertMany([
      { nama: 'Transfer Bank', kode: 'bank_transfer', deskripsi: 'BCA / BNI / BRI / Mandiri', is_active: true },
      { nama: 'QRIS', kode: 'qris', deskripsi: 'Semua e-wallet', is_active: true },
      { nama: 'GoPay', kode: 'gopay', is_active: true },
    ]);

    const exp = new Date(Date.now() + 2 * 365 * 86400000);
    await Drug.insertMany([
      { nama: 'Paracetamol 500mg', kategori: 'Pereda Nyeri & Demam', stok: 200, satuan: 'strip', harga: 5000, kode_obat: 'OBT-001', butuh_resep: false, tgl_kadaluarsa: exp, deskripsi: 'Pereda demam dan nyeri ringan' },
      { nama: 'Vitamin C 500mg', kategori: 'Vitamin', stok: 150, satuan: 'botol', harga: 25000, kode_obat: 'OBT-002', butuh_resep: false, tgl_kadaluarsa: exp },
      { nama: 'Amoxicillin 500mg', kategori: 'Antibiotik', stok: 80, satuan: 'strip', harga: 18000, kode_obat: 'OBT-003', butuh_resep: true, tgl_kadaluarsa: exp, deskripsi: 'Antibiotik, wajib resep dokter' },
      { nama: 'Cetirizine 10mg', kategori: 'Alergi', stok: 90, satuan: 'strip', harga: 12000, kode_obat: 'OBT-004', butuh_resep: false, tgl_kadaluarsa: exp },
      { nama: 'Antasida DOEN', kategori: 'Lambung', stok: 120, satuan: 'strip', harga: 7000, kode_obat: 'OBT-005', butuh_resep: false, tgl_kadaluarsa: exp },
    ]);

    await HealthArticle.insertMany([
      { judul: '5 Cara Menjaga Imunitas Tubuh', slug: '5-cara-menjaga-imunitas-tubuh', konten: 'Tidur cukup, makan bergizi, olahraga teratur, kelola stres, dan rutin cuci tangan adalah kunci imunitas yang baik.', penulis_id: admin._id, status_publikasi: 'published' },
      { judul: 'Kapan Harus ke Dokter Saat Demam?', slug: 'kapan-harus-ke-dokter-saat-demam', konten: 'Segera periksa jika demam lebih dari 3 hari, suhu di atas 39°C, disertai sesak, kejang, atau ruam.', penulis_id: admin._id, status_publikasi: 'published' },
    ]);
  });

  console.log(`\nSeed complete. All accounts use password: ${PASSWORD}`);
  console.log('  admin@harmoni.test | dokter1..4@harmoni.test | apoteker@harmoni.test | pasien@harmoni.test');
  await mongoose.disconnect();
};

seed().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
