import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../config/db';

import User from '../models/User';
import Role from '../models/Role';
import UserRole from '../models/UserRole';
import UserProfile from '../models/UserProfile';
import Dokter from '../models/Dokter';
import Apoteker from '../models/Apoteker';
import Pasien from '../models/Pasien';
import Admin from '../models/Admin';
import Specialization from '../models/Specialization';
import Clinic from '../models/Clinic';
import DoctorClinic from '../models/DoctorClinic';
import PracticeSchedule from '../models/PracticeSchedule';
import Consultation from '../models/Consultation';
import ChatMessage from '../models/ChatMessage';
import MedicalRecord from '../models/MedicalRecord';
import DoctorReview from '../models/DoctorReview';
import HealthArticle from '../models/HealthArticle';
import Notification from '../models/Notification';
import ActivityLog from '../models/ActivityLog';
import Media from '../models/Media';
import RefreshToken from '../models/RefreshToken';
import PaymentMethod from '../models/PaymentMethod';
import Transaction from '../models/Transaction';
import Drug from '../models/Drug';
import DrugCart from '../models/DrugCart';
import DrugOrder from '../models/DrugOrder';
import DrugOrderDetail from '../models/DrugOrderDetail';
import Prescription from '../models/Prescription';
import PrescriptionDrug from '../models/PrescriptionDrug';

dotenv.config();

// Set locale to Indonesian


const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await UserRole.deleteMany({});
    await UserProfile.deleteMany({});
    await Dokter.deleteMany({});
    await Apoteker.deleteMany({});
    await Pasien.deleteMany({});
    await Admin.deleteMany({});
    await Specialization.deleteMany({});
    await Clinic.deleteMany({});
    await DoctorClinic.deleteMany({});
    await PracticeSchedule.deleteMany({});
    await Consultation.deleteMany({});
    await ChatMessage.deleteMany({});
    await MedicalRecord.deleteMany({});
    await DoctorReview.deleteMany({});
    await HealthArticle.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});
    await Media.deleteMany({});
    await RefreshToken.deleteMany({});
    await PaymentMethod.deleteMany({});
    await Transaction.deleteMany({});
    await Drug.deleteMany({});
    await DrugCart.deleteMany({});
    await DrugOrder.deleteMany({});
    await DrugOrderDetail.deleteMany({});
    await Prescription.deleteMany({});
    await PrescriptionDrug.deleteMany({});
    console.log('All existing data cleared.');

    // Create Roles
    const roles = await Role.insertMany([
      { nama_peran: 'superadmin' },
      { nama_peran: 'admin' },
      { nama_peran: 'dokter' },
      { nama_peran: 'apoteker' },
      { nama_peran: 'pasien' },
    ]);
    const superadminRole = roles.find(role => role.nama_peran === 'superadmin');
    const adminRole = roles.find(role => role.nama_peran === 'admin');
    const dokterRole = roles.find(role => role.nama_peran === 'dokter');
    const apotekerRole = roles.find(role => role.nama_peran === 'apoteker');
    const pasienRole = roles.find(role => role.nama_peran === 'pasien');
    console.log('Roles created.');

    // Create Superadmin User
    const superadminUser = await User.create({
      email: 'superadmin@example.com',
      password: 'password123',
    });
    await UserRole.create({ user_id: superadminUser._id, peran_id: superadminRole!._id });
    await Admin.create({
      _id: `04${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      user_id: superadminUser._id,
      nama: faker.person.fullName(),
    });
    console.log('Superadmin created.');

    // Create Admin User
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'password123',
    });
    await UserRole.create({ user_id: adminUser._id, peran_id: adminRole!._id });
    await Admin.create({
      _id: `04${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      user_id: adminUser._id,
      nama: faker.person.fullName(),
    });
    console.log('Admin created.');

    // Create Dokter User
    const dokterUser = await User.create({
      email: 'dokter@example.com',
      password: 'password123',
    });
    await UserRole.create({ user_id: dokterUser._id, peran_id: dokterRole!._id });
    const spesialisasi = await Specialization.create({ nama: 'Umum', deskripsi: 'Dokter Umum' });
    const dokter = await Dokter.create({
      _id: `10${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      user_id: dokterUser._id,
      nama: faker.person.fullName(),
      nomor_str: faker.number.int({ min: 100000000000000, max: 999999999999999 }).toString(),
      spesialisasi_id: spesialisasi._id,
      biaya_konsultasi: faker.number.int({ min: 50000, max: 200000 }),
      foto: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      status: 'active',
    });
    console.log('Dokter created.');

    // Create Apoteker User
    const apotekerUser = await User.create({
      email: 'apoteker@example.com',
      password: 'password123',
    });
    await UserRole.create({ user_id: apotekerUser._id, peran_id: apotekerRole!._id });
    await Apoteker.create({
      _id: `20${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      user_id: apotekerUser._id,
      nama: faker.person.fullName(),
      nomor_sipa: faker.number.int({ min: 100000000000000, max: 999999999999999 }).toString(),
    });
    console.log('Apoteker created.');

    // Create Pasien User
    const pasienUser = await User.create({
      email: 'pasien@example.com',
      password: 'password123',
    });
    await UserRole.create({ user_id: pasienUser._id, peran_id: pasienRole!._id });
    const pasien = await Pasien.create({
      _id: `08${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      user_id: pasienUser._id,
      nama: faker.person.fullName(),
      nik: faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString(),
      tanggal_lahir: faker.date.past({ years: 30, refDate: '2000-01-01' }),
      jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
      alamat: faker.location.streetAddress({ useFullAddress: true }) + ', ' + faker.location.city() + ', Jawa Tengah',
      no_telepon: faker.phone.number(),
    });
    console.log('Pasien created.');

    // Create UserProfile for Pasien
    await UserProfile.create({
      user_id: pasienUser._id,
      foto: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    });
    console.log('UserProfile for Pasien created.');

    // Create Clinic
    const clinic = await Clinic.create({
      nama: 'Klinik Harmoni Sehat',
      alamat: faker.location.streetAddress(true) + ', ' + faker.location.city() + ', Jawa Barat',
      no_telepon: faker.phone.number(),
      email: 'klinik@example.com',
      status: 'active',
    });
    console.log('Clinic created.');

    // Create DoctorClinic
    await DoctorClinic.create({
      dokter_id: dokter._id,
      klinik_id: clinic._id,
      status: 'active',
    });
    console.log('DoctorClinic created.');

    // Create PracticeSchedule
    const practiceSchedule = await PracticeSchedule.create({
      dokter_id: dokter._id,
      klinik_id: clinic._id,
      hari: 'Senin',
      jam_mulai: '09:00',
      jam_selesai: '17:00',
      is_active: true,
    });
    console.log('PracticeSchedule created.');

    // Create Consultation
    const consultation = await Consultation.create({
      pasien_id: pasien._id,
      dokter_id: dokter._id,
      jadwal_id: practiceSchedule._id,
      tanggal: faker.date.future({ years: 1, refDate: new Date() }),
      status: 'scheduled',
      keluhan: faker.lorem.sentence(),
    });
    console.log('Consultation created.');

    // Create ChatMessage
    await ChatMessage.create({
      konsultasi_id: consultation._id,
      pengirim_id: pasienUser._id,
      isi: faker.lorem.sentence(),
      tipe: 'text',
      is_read: false,
    });
    console.log('ChatMessage created.');

    // Create MedicalRecord
    await MedicalRecord.create({
      pasien_id: pasien._id,
      riwayat_penyakit: faker.lorem.sentence(),
      alergi: faker.lorem.word(),
      riwayat_vaksinasi: faker.lorem.sentence(),
    });
    console.log('MedicalRecord created.');

    // Create DoctorReview
    await DoctorReview.create({
      pasien_id: pasien._id,
      dokter_id: dokter._id,
      konsultasi_id: consultation._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      komentar: faker.lorem.sentence(),
    });
    console.log('DoctorReview created.');

    // Create HealthArticle
    await HealthArticle.create({
      judul: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      konten: faker.lorem.paragraphs(3),
      penulis_id: adminUser._id,
      status_publikasi: 'published',
    });
    console.log('HealthArticle created.');

    // Create Notification
    await Notification.create({
      user_id: pasienUser._id,
      judul: faker.lorem.sentence(3),
      isi: faker.lorem.paragraph(),
      tipe: 'info',
      is_read: false,
    });
    console.log('Notification created.');

    // Create ActivityLog
    await ActivityLog.create({
      user_id: superadminUser._id,
      aksi: 'LOGIN',
      deskripsi: 'Superadmin logged in',
    });
    console.log('ActivityLog created.');

    // Create Media
    await Media.create({
      model_type: 'UserProfile',
      model_id: pasienUser._id,
      url: faker.image.url(),
      mime_type: 'image/jpeg',
      size: faker.number.int({ min: 10000, max: 500000 }),
    });
    console.log('Media created.');

    // Create RefreshToken
    await RefreshToken.create({
      user_id: pasienUser._id,
      token: faker.string.uuid(),
      expired_at: faker.date.future({ years: 1, refDate: new Date() }),
    });
    console.log('RefreshToken created.');

    // Create PaymentMethod
    const paymentMethod = await PaymentMethod.create({
      nama: 'Transfer Bank',
      kode: 'BANK_TRANSFER',
      deskripsi: 'Pembayaran melalui transfer bank',
      is_active: true,
    });
    console.log('PaymentMethod created.');

    // Create Transaction
    await Transaction.create({
      user_id: pasienUser._id,
      total_biaya: faker.number.int({ min: 10000, max: 500000 }),
      status: 'completed',
      metode_pembayaran_id: paymentMethod._id,
      external_id: faker.string.uuid(),
      transaksiable_id: consultation._id,
      transaksiable_type: 'Consultation',
    });
    console.log('Transaction created.');

    // Create Drug
    const drug = await Drug.create({
      nama: 'Paracetamol',
      deskripsi: 'Obat pereda nyeri dan demam',
      kategori: 'Analgesik',
      stok: faker.number.int({ min: 100, max: 1000 }),
      satuan: 'Tablet',
      harga: faker.number.int({ min: 5000, max: 20000 }),
      kode_obat: faker.number.int({ min: 100000, max: 999999 }).toString(),
      butuh_resep: false,
      tgl_kadaluarsa: faker.date.future({ years: 2, refDate: new Date() }),
    });
    console.log('Drug created.');

    // Create DrugCart
    await DrugCart.create({
      pasien_id: pasien._id,
      obat_id: drug._id,
      jumlah: faker.number.int({ min: 1, max: 10 }),
    });
    console.log('DrugCart created.');

    // Create DrugOrder
    const drugOrder = await DrugOrder.create({
      pasien_id: pasien._id,
      kode_pesanan: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
      total_harga: faker.number.int({ min: 50000, max: 500000 }),
      status: 'processing',
      alamat_pengiriman: faker.location.streetAddress({ useFullAddress: true }) + ', ' + faker.location.city() + ', Jawa Timur',
    });
    console.log('DrugOrder created.');

    // Create DrugOrderDetail
    await DrugOrderDetail.create({
      pesanan_id: drugOrder._id,
      obat_id: drug._id,
      jumlah: faker.number.int({ min: 1, max: 5 }),
      harga_satuan: drug.harga,
      subtotal: drug.harga * faker.number.int({ min: 1, max: 5 }),
    });
    console.log('DrugOrderDetail created.');

    // Create Prescription
    const prescription = await Prescription.create({
      konsultasi_id: consultation._id,
      catatan: faker.lorem.sentence(),
      status: 'active',
      expired_at: faker.date.future({ years: 1, refDate: new Date() }),
    });
    console.log('Prescription created.');

    // Create PrescriptionDrug
    await PrescriptionDrug.create({
      resep_id: prescription._id,
      obat_id: drug._id,
      dosis: '1 tablet',
      jumlah: 1,
      aturan_pakai: '3 kali sehari setelah makan',
    });
    console.log('PrescriptionDrug created.');

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
