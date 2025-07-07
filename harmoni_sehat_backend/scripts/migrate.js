require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Load Models
const User = require('../models/User');
const Peran = require('../models/Peran');
const PeranPengguna = require('../models/PeranPengguna');
const UserProfile = require('../models/UserProfile');
const Dokter = require('../models/Dokter');
const Apoteker = require('../models/Apoteker');
const Pasien = require('../models/Pasien');
const Admin = require('../models/Admin');
const Klinik = require('../models/Klinik');
const DokterKlinik = require('../models/DokterKlinik');
const JadwalPraktik = require('../models/JadwalPraktik');
const Spesialisasi = require('../models/Spesialisasi');
const Konsultasi = require('../models/Konsultasi');
const RekamMedis = require('../models/RekamMedis');
const ChatMessage = require('../models/ChatMessage');
const ReviewDokter = require('../models/ReviewDokter');
const Resep = require('../models/Resep');
const Obat = require('../models/Obat');
const ResepObat = require('../models/ResepObat');
const KeranjangObat = require('../models/KeranjangObat');
const PesananObat = require('../models/PesananObat');
const DetailPesananObat = require('../models/DetailPesananObat');
const MetodePembayaran = require('../models/MetodePembayaran');
const Transaksi = require('../models/Transaksi');
const ActivityLog = require('../models/ActivityLog');
const Media = require('../models/Media');
const RefreshToken = require('../models/RefreshToken');
const Notifikasi = require('../models/Notifikasi');
const ArtikelKesehatan = require('../models/ArtikelKesehatan');

const bcrypt = require('bcryptjs');
const { generateCustomUserId } = require('../services/userService'); // Import generateCustomUserId

const migrateDB = async () => {
  try {
    await connectDB();

    console.log('Dropping existing collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`Collection ${collection.name} dropped.`);
    }

    console.log('Creating default roles...');
    const roles = await Peran.insertMany([
      { nama_peran: 'Admin' },
      { nama_peran: 'Dokter' },
      { nama_peran: 'Pasien' },
      { nama_peran: 'Apoteker' },
    ]);
    console.log('Default roles created.', roles);

    console.log('Creating initial admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      email: 'admin@harmoni.sehat',
      password: hashedPassword,
      is_active: true,
      role: 'Admin', // Add role
      nama_lengkap: 'Super Admin', // Add nama_lengkap
      customUserId: generateCustomUserId('Admin'), // Generate customUserId
    });
    console.log('Admin user created.', adminUser);

    const adminRole = roles.find(role => role.nama_peran === 'Admin');
    await PeranPengguna.create({
      user_id: adminUser._id,
      peran_id: adminRole._id,
    });
    console.log('Admin user assigned to Admin role.');

    await Admin.create({
      user_id: adminUser._id,
      nama: 'Super Admin',
    });
    console.log('Admin profile created.');

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

migrateDB();