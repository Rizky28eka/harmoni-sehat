require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker/locale/id_ID');
const connectDB = require('../config/db');

// Import all models
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Peran = require('../models/Peran');
const PeranPengguna = require('../models/PeranPengguna');
const Admin = require('../models/Admin');
const Pasien = require('../models/Pasien');
const Dokter = require('../models/Dokter');
const Apoteker = require('../models/Apoteker');
const Spesialisasi = require('../models/Spesialisasi');
const Klinik = require('../models/Klinik');
const DokterKlinik = require('../models/DokterKlinik');
const JadwalPraktik = require('../models/JadwalPraktik');
const Konsultasi = require('../models/Konsultasi');
const RekamMedis = require('../models/RekamMedis');
const ChatMessage = require('../models/ChatMessage');
const ReviewDokter = require('../models/ReviewDokter');
const Obat = require('../models/Obat');
const Resep = require('../models/Resep');
const ResepObat = require('../models/ResepObat');
const KeranjangObat = require('../models/KeranjangObat');
const PesananObat = require('../models/PesananObat');
const DetailPesananObat = require('../models/DetailPesananObat');
const MetodePembayaran = require('../models/MetodePembayaran');
const Transaksi = require('../models/Transaksi');
const ArtikelKesehatan = require('../models/ArtikelKesehatan');

const cleanDatabase = async () => {
  console.log('Cleaning database...');
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  console.log('Database cleaned.');
};

const seedData = async () => {
  await connectDB();
  await cleanDatabase();

  try {
    console.log('Seeding data...');

    // Seed Roles
    const roles = await Peran.insertMany([
      { nama_peran: 'Admin' },
      { nama_peran: 'Dokter' },
      { nama_peran: 'Pasien' },
      { nama_peran: 'Apoteker' },
    ]);
    const adminRole = roles.find(r => r.nama_peran === 'Admin');
    const dokterRole = roles.find(r => r.nama_peran === 'Dokter');
    const pasienRole = roles.find(r => r.nama_peran === 'Pasien');

    // Seed Users
    const users = [];
    const numUsers = 100;
    for (let i = 0; i < numUsers; i++) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('password123', salt);
      
      let role;
      if (i < 10) {
        role = 'Admin';
      } else if (i < 35) {
        role = 'Dokter';
      } else if (i < 70) {
        role = 'Pasien';
      } else {
        role = 'Apoteker';
      }

      const user = await User.create({
        email: faker.internet.email(),
        password,
        nama_lengkap: faker.person.fullName(),
        no_hp: faker.phone.number('628##########'), // Indonesian phone number format
        role,
        is_verified: true, // For seeded users, assume verified
      });
      users.push(user);
    }

    // Seed UserProfiles (if still needed, otherwise remove this section)
    // Note: UserProfile model might be redundant if User model now holds all necessary info
    const userProfiles = [];
    for (const user of users) {
      const profile = await UserProfile.create({
        user_id: user._id,
        nama: user.nama_lengkap, // Use nama_lengkap from User
        tanggal_lahir: faker.date.past(50, '2000-01-01'),
        jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
        alamat: faker.location.streetAddress({ useFullAddress: true }),
        nomor_telepon: user.no_hp, // Use no_hp from User
      });
      userProfiles.push(profile);
    }

    // Assign Roles and create role-specific documents
    const pasiens = [];
    const dokters = [];
    const apotekers = [];
    const admins = [];

    for (const user of users) {
      await PeranPengguna.create({ user_id: user._id, peran_id: roles.find(r => r.nama_peran === user.role)._id });

      if (user.role === 'Pasien') {
        const pasien = await Pasien.create({ user_id: user._id, nik: faker.string.numeric(16) });
        pasiens.push(pasien);
      } else if (user.role === 'Dokter') {
        const dokter = await Dokter.create({
          user_id: user._id,
          nomor_str: faker.string.numeric(12),
          spesialisasi: faker.person.jobTitle(),
          noIzinPraktik: faker.string.alphanumeric(10),
          alamatKlinik: faker.location.streetAddress({ useFullAddress: true }),
        });
        dokters.push(dokter);
      } else if (user.role === 'Apoteker') {
        const apoteker = await Apoteker.create({
          user_id: user._id,
          noSTRA: faker.string.alphanumeric(10),
          alamatApotek: faker.location.streetAddress({ useFullAddress: true }),
        });
        apotekers.push(apoteker);
      } else if (user.role === 'Admin') {
        const admin = await Admin.create({ user_id: user._id });
        admins.push(admin);
      }
    }

    // Seed Obat
    const obats = [];
    for (let i = 0; i < 200; i++) {
        const obat = await Obat.create({
            nama: faker.commerce.productName(),
            deskripsi: faker.commerce.productDescription(),
            kategori: faker.commerce.department(),
            stok: faker.number.int({ min: 0, max: 1000 }),
            satuan: faker.helpers.arrayElement(['strip', 'botol', 'tablet']),
            harga: faker.commerce.price({ min: 5000, max: 200000, dec: 0 }),
            butuh_resep: faker.datatype.boolean(),
        });
        obats.push(obat);
    }

    // Seed Rekam Medis
    for (const pasien of pasiens) {
        await RekamMedis.create({
            pasien_id: pasien._id,
            riwayat_penyakit: [faker.lorem.sentence()],
            alergi: [faker.lorem.word()],
        });
    }

    // Seed Pesanan Obat & Detail
    for (let i = 0; i < 150; i++) {
        const randomPasien = faker.helpers.arrayElement(pasiens);
        const orderedObats = faker.helpers.arrayElements(obats, faker.number.int({ min: 1, max: 5 }));
        let total_harga = 0;
        const details = orderedObats.map(obat => {
            const jumlah = faker.number.int({ min: 1, max: 3 });
            const subtotal = jumlah * obat.harga;
            total_harga += subtotal;
            return { obat_id: obat._id, jumlah, harga_satuan: obat.harga, subtotal };
        });

        const pesanan = await PesananObat.create({
            pasien_id: randomPasien._id,
            kode_pesanan: `INV-${faker.string.alphanumeric(10).toUpperCase()}`,
            total_harga,
            status: faker.helpers.arrayElement(['pending', 'processed', 'shipped', 'delivered']),
            alamat_pengiriman: faker.location.streetAddress({ useFullAddress: true }),
        });

        await DetailPesananObat.insertMany(details.map(d => ({ ...d, pesanan_id: pesanan._id })));
    }
    
    // Seed Artikel Kesehatan
    for (let i = 0; i < 50; i++) {
        const randomDokter = faker.helpers.arrayElement(dokters);
        const authorProfile = userProfiles.find(p => p.user_id.equals(randomDokter.user_id));
        await ArtikelKesehatan.create({
            judul: faker.lorem.sentence(),
            slug: faker.lorem.slug(),
            konten: faker.lorem.paragraphs(5),
            penulis_id: randomDokter._id,
            penulis_type: 'Dokter',
            status_publikasi: 'published',
        });
    }

    console.log('Data seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedData();
