import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/id_ID';
import connectDB from '../config/db';
import logger from '../utils/logger';

// Import all models
import User from '../models/User';
import UserProfile from '../models/UserProfile';
import Peran from '../models/Peran';
import PeranPengguna from '../models/PeranPengguna';
import Admin from '../models/Admin';
import Pasien from '../models/Pasien';
import Dokter from '../models/Dokter';
import Apoteker from '../models/Apoteker';
// import Spesialisasi from '../models/Spesialisasi';
// import Klinik from '../models/Klinik';
// import DokterKlinik from '../models/DokterKlinik';
// import JadwalPraktik from '../models/JadwalPraktik';
// import Konsultasi from '../models/Konsultasi';
import RekamMedis from '../models/RekamMedis';
// import ChatMessage from '../models/ChatMessage';
// import ReviewDokter from '../models/ReviewDokter';
import Obat from '../models/Obat';
// import Resep from '../models/Resep';
// import ResepObat from '../models/ResepObat';
// import KeranjangObat from '../models/KeranjangObat';
import PesananObat from '../models/PesananObat';
import DetailPesananObat from '../models/DetailPesananObat';
// import MetodePembayaran from '../models/MetodePembayaran';
// import Transaksi from '../models/Transaksi';
import ArtikelKesehatan from '../models/ArtikelKesehatan';

import { generateCustomUserId, encrypt, createHash, decrypt } from '../services/userService';

const cleanDatabase = async () => {
    logger.info('Cleaning database...');
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
    logger.info('Database cleaned.');
};

const seedData = async () => {
    await connectDB();
    await cleanDatabase();

    try {
        logger.info('Seeding data...');

        // Seed Roles
        const roles = await Peran.insertMany([
            { nama_peran: 'Admin' },
            { nama_peran: 'Dokter' },
            { nama_peran: 'Pasien' },
            { nama_peran: 'Apoteker' },
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const adminRole = roles.find(r => r.nama_peran === 'Admin');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dokterRole = roles.find(r => r.nama_peran === 'Dokter');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const pasienRole = roles.find(r => r.nama_peran === 'Pasien');

        // Seed Users
        const users = [];
        const numUsers = 100;
        for (let i = 0; i < numUsers; i++) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('password123', salt);
      
            let role: 'Admin' | 'Dokter' | 'Pasien' | 'Apoteker';
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
                no_hp: encrypt(faker.phone.number('628##########')), // Indonesian phone number format
                no_hp_hash: createHash(faker.phone.number('628##########')),
                role,
                is_verified: true, // For seeded users, assume verified
                customUserId: generateCustomUserId(role),
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
                tanggal_lahir: faker.date.past({ years: 50, refDate: '2000-01-01' }),
                jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
                alamat: faker.location.streetAddress({ useFullAddress: true }),
                nomor_telepon: decrypt(user.no_hp || ''), // Use no_hp from User
            });
            userProfiles.push(profile);
        }

        // Assign Roles and create role-specific documents
        const pasiens = [];
        const dokters = [];
        const apotekers = [];
        const admins = [];

        for (const user of users) {
            const roleDoc = roles.find(r => r.nama_peran === user.role);
            if (roleDoc) {
                await PeranPengguna.create({ user_id: user._id, peran_id: roleDoc._id });
            }

            if (user.role === 'Pasien') {
                const pasien = await Pasien.create({ user_id: user._id, nik: faker.string.numeric(16) });
                pasiens.push(pasien);
            } else if (user.role === 'Dokter') {
                const dokter = await Dokter.create({
                    user_id: user._id,
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
                kode_obat: faker.string.alphanumeric(8).toUpperCase(),
                tgl_kadaluarsa: faker.date.future({ years: 2 }),
            });
            obats.push(obat);
        }

        // Seed Rekam Medis
        for (const pasien of pasiens) {
            await RekamMedis.create({
                pasien_id: pasien._id,
                riwayat_penyakit: [faker.lorem.sentence()],
                alergi: [faker.lorem.word()],
                riwayat_vaksinasi: [faker.lorem.word()],
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // const authorProfile = userProfiles.find(p => p.user_id.equals(randomDokter.user_id)); // userProfiles might be redundant
            await ArtikelKesehatan.create({
                judul: faker.lorem.sentence(),
                slug: faker.lorem.slug(),
                konten: faker.lorem.paragraphs(5),
                penulis_id: randomDokter._id,
                penulis_type: 'Dokter',
                status_publikasi: 'published',
            });
        }

        logger.info('Data seeding complete.');
    } catch (error: any) {
        logger.error('Error seeding database:', error);
    } finally {
        void mongoose.connection.close();
        logger.info('Database connection closed.');
    }
};

void seedData();