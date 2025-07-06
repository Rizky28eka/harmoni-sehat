require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { faker } = require('@faker-js/faker/locale/id_ID');
const bcrypt = require('bcryptjs');

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

const provinces = [
    'DKI Jakarta', 'Banten', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur'
];

const indonesianFirstNames = [
    'Budi', 'Ani', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gita', 'Hadi', 'Indah', 'Joko',
    'Kartika', 'Lina', 'Maya', 'Nia', 'Omar', 'Putri', 'Qori', 'Rina', 'Siti', 'Tono'
];

const indonesianLastNames = [
    'Santoso', 'Wijaya', 'Putra', 'Dewi', 'Nugroho', 'Lestari', 'Permata', 'Susanto', 'Handayani', 'Pratama',
    'Utami', 'Saputra', 'Rahayu', 'Hidayat', 'Fauzi', 'Anggraini', 'Kusuma', 'Wati', 'Setiawan', 'Aditya'
];

const generateDummyData = async () => {
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
        const adminRole = roles.find(role => role.nama_peran === 'Admin');
        const dokterRole = roles.find(role => role.nama_peran === 'Dokter');
        const pasienRole = roles.find(role => role.nama_peran === 'Pasien');
        const apotekerRole = roles.find(role => role.nama_peran === 'Apoteker');
        console.log('Default roles created.');

        // Spesialisasi
        const dummySpesialisasi = await Spesialisasi.insertMany([
            { nama: 'Umum' },
            { nama: 'Anak' },
            { nama: 'Gigi' },
            { nama: 'Kulit dan Kelamin' },
            { nama: 'Penyakit Dalam' },
            { nama: 'Mata' },
            { nama: 'THT' },
            { nama: 'Bedah' },
        ]);
        console.log('Dummy spesialisasi created.');

        // Admin User
        console.log('Creating initial admin user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const adminUser = await User.create({
            email: 'admin@harmoni.sehat',
            password: hashedPassword,
            is_active: true,
        });
        await PeranPengguna.create({ user_id: adminUser._id, peran_id: adminRole._id });
        await Admin.create({ user_id: adminUser._id, nama: 'Super Admin' });
        console.log('Admin user created.');

        // Dummy Users, Doctors, Patients, Apotekers
        const dummyUsers = [];
        const dummyDoctors = [];
        const dummyPatients = [];
        const dummyApotekers = [];

        for (let i = 0; i < 10; i++) { // 10 dummy users
            const userSalt = await bcrypt.genSalt(10);
            const userHashedPassword = await bcrypt.hash('password123', userSalt);
            const user = await User.create({
                email: faker.internet.email(),
                password: userHashedPassword,
                is_active: faker.datatype.boolean(),
            });
            dummyUsers.push(user);

            const userProfile = await UserProfile.create({
                user_id: user._id,
                nama_lengkap: faker.helpers.arrayElement(indonesianFirstNames) + ' ' + faker.helpers.arrayElement(indonesianLastNames),
                tanggal_lahir: faker.date.past({ years: 30 }),
                jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
                alamat: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.helpers.arrayElement(provinces),
                nomor_telepon: faker.phone.number('08##########'),
                foto_profil: faker.image.avatar(),
            });

            if (i < 3) { // 3 Doctors
                await PeranPengguna.create({ user_id: user._id, peran_id: dokterRole._id });
                const dokter = await Dokter.create({
                    user_id: user._id,
                    nama: userProfile.nama_lengkap,
                    nomor_str: faker.string.alphanumeric(10).toUpperCase(),
                    spesialisasi_id: faker.helpers.arrayElement(dummySpesialisasi)._id, // Menggunakan ID spesialisasi yang sudah ada
                    biaya_konsultasi: faker.number.int({ min: 50000, max: 200000, precision: 10000 }),
                    foto: userProfile.foto_profil,
                    bio: faker.lorem.paragraph(),
                    status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
                });
                dummyDoctors.push(dokter);
            } else if (i < 7) { // 4 Patients
                await PeranPengguna.create({ user_id: user._id, peran_id: pasienRole._id });
                const pasien = await Pasien.create({
                    user_id: user._id,
                    nama: userProfile.nama_lengkap,
                    nik: faker.string.alphanumeric(16).toUpperCase(), // Membuat NIK unik
                    nomor_rekam_medis: faker.string.alphanumeric(12).toUpperCase(),
                    golongan_darah: faker.helpers.arrayElement(['A', 'B', 'AB', 'O']),
                    riwayat_penyakit: faker.lorem.sentence(),
                    alergi: faker.lorem.words(3),
                });
                dummyPatients.push(pasien);
            } else { // 3 Apotekers
                await PeranPengguna.create({ user_id: user._id, peran_id: apotekerRole._id });
                const apoteker = await Apoteker.create({
                    user_id: user._id,
                    nama: userProfile.nama_lengkap,
                    nomor_sipa: faker.string.uuid(), // Menggunakan UUID untuk memastikan keunikan
                });
                dummyApotekers.push(apoteker);
            }
        }
        console.log('Dummy users, doctors, patients, apotekers created.');

        // Dummy Kliniks
        const dummyKliniks = [];
        for (let i = 0; i < 5; i++) { // 5 dummy clinics
            const klinik = await Klinik.create({
                nama: faker.company.name() + ' Klinik',
                alamat: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.helpers.arrayElement(provinces),
                nomor_telepon: faker.phone.number('021-#######'),
                email: faker.internet.email(),
                jam_operasional: '08:00 - 20:00',
                deskripsi: faker.lorem.paragraph(),
                foto_klinik: faker.image.urlLoremFlickr({ category: 'medical' }),
            });
            dummyKliniks.push(klinik);
        }
        console.log('Dummy clinics created.');

        // DokterKlinik
        for (const dokter of dummyDoctors) {
            for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
                await DokterKlinik.create({
                    dokter_id: dokter._id,
                    klinik_id: faker.helpers.arrayElement(dummyKliniks)._id,
                });
            }
        }
        console.log('DokterKlinik associations created.');

        // JadwalPraktik
        for (const dokter of dummyDoctors) {
            for (let i = 0; i < 5; i++) { // 5 schedules per doctor
                const jadwal = await JadwalPraktik.create({
                    dokter_id: dokter._id,
                    klinik_id: faker.helpers.arrayElement(dummyKliniks)._id,
                    hari: faker.date.weekday(),
                    jam_mulai: faker.date.anytime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    jam_selesai: faker.date.anytime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    status: faker.helpers.arrayElement(['Tersedia', 'Tidak Tersedia']),
                });
                dummyJadwalPraktik.push(jadwal);
            }
        }
        console.log('JadwalPraktik created.');

        // Konsultasi
        const dummyKonsultasi = [];
        for (let i = 0; i < 15; i++) { // 15 dummy consultations
            const pasien = faker.helpers.arrayElement(dummyPatients);
            const dokter = faker.helpers.arrayElement(dummyDoctors);
            const konsultasi = await Konsultasi.create({
                pasien_id: pasien._id,
                dokter_id: dokter._id,
                jadwal_id: faker.helpers.arrayElement(dummyJadwalPraktik)._id, // Assuming dummyJadwalPraktik exists
                tanggal: new Date(),
                status: faker.helpers.arrayElement(['pending', 'scheduled', 'completed', 'cancelled']),
                keluhan: faker.lorem.sentence(),
                diagnosa: faker.lorem.sentence(),
                tindakan: faker.lorem.sentence(),
                catatan_dokter: faker.lorem.paragraph(),
                video_call_url: faker.internet.url(),
            });
            dummyKonsultasi.push(konsultasi);
        }
        console.log('Dummy consultations created.');

        // RekamMedis
        for (const pasien of dummyPatients) {
            for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
                await RekamMedis.create({
                    pasien_id: pasien._id,
                    dokter_id: faker.helpers.arrayElement(dummyDoctors)._id,
                    tanggal_rekam_medis: faker.date.recent({ days: 60 }),
                    diagnosa: faker.lorem.sentence(),
                    tindakan: faker.lorem.sentence(),
                    catatan: faker.lorem.paragraph(),
                });
            }
        }
        console.log('Dummy medical records created.');

        // ChatMessage
        for (const konsultasi of dummyKonsultasi) {
            for (let i = 0; i < faker.number.int({ min: 5, max: 20 }); i++) {
                await ChatMessage.create({
                    konsultasi_id: konsultasi._id,
                    pengirim_id: faker.helpers.arrayElement([konsultasi.pasien_id, konsultasi.dokter_id]),
                    pesan: faker.lorem.sentence(),
                    waktu_kirim: faker.date.recent({ days: 7 }),
                });
            }
        }
        console.log('Dummy chat messages created.');

        // ReviewDokter
        for (const dokter of dummyDoctors) {
            for (let i = 0; i < faker.number.int({ min: 5, max: 15 }); i++) {
                await ReviewDokter.create({
                    dokter_id: dokter._id,
                    pasien_id: faker.helpers.arrayElement(dummyPatients)._id,
                    rating: faker.number.int({ min: 1, max: 5 }),
                    komentar: faker.lorem.sentence(),
                    tanggal_ulasan: faker.date.recent({ days: 30 }),
                });
            }
        }
        console.log('Dummy doctor reviews created.');

        // Obat
        const dummyObat = [];
        for (let i = 0; i < 20; i++) { // 20 dummy medicines
            const obat = await Obat.create({
                nama_obat: faker.commerce.productName(),
                deskripsi: faker.lorem.sentence(),
                harga: faker.number.int({ min: 10000, max: 100000, precision: 1000 }),
                stok: faker.number.int({ min: 10, max: 200 }),
                produsen: faker.company.name(),
                gambar_obat: faker.image.urlLoremFlickr({ category: 'medicine' }),
            });
            dummyObat.push(obat);
        }
        console.log('Dummy medicines created.');

        // Resep and ResepObat
        const dummyResep = [];
        for (const konsultasi of dummyKonsultasi) {
            if (faker.datatype.boolean()) { // Randomly create prescriptions for some consultations
                const resep = await Resep.create({
                    konsultasi_id: konsultasi._id,
                    tanggal_resep: konsultasi.tanggal_konsultasi,
                    catatan: faker.lorem.sentence(),
                });
                dummyResep.push(resep);
                await Konsultasi.findByIdAndUpdate(konsultasi._id, { resep_id: resep._id });

                for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
                    await ResepObat.create({
                        resep_id: resep._id,
                        obat_id: faker.helpers.arrayElement(dummyObat)._id,
                        jumlah: faker.number.int({ min: 1, max: 5 }),
                        aturan_pakai: faker.lorem.words(5),
                    });
                }
            }
        }
        console.log('Dummy prescriptions and prescription medicines created.');

        // KeranjangObat
        for (const pasien of dummyPatients) {
            if (faker.datatype.boolean()) { // Randomly create carts for some patients
                for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
                    await KeranjangObat.create({
                        pasien_id: pasien._id,
                        obat_id: faker.helpers.arrayElement(dummyObat)._id,
                        jumlah: faker.number.int({ min: 1, max: 3 }),
                    });
                }
            }
        }
        console.log('Dummy medicine carts created.');

        // PesananObat and DetailPesananObat
        const dummyPesananObat = [];
        for (const pasien of dummyPatients) {
            if (faker.datatype.boolean()) { // Randomly create orders for some patients
                const pesanan = await PesananObat.create({
                    pasien_id: pasien._id,
                    tanggal_pesanan: faker.date.recent({ days: 30 }),
                    status_pesanan: faker.helpers.arrayElement(['Pending', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan']),
                    total_harga: faker.number.int({ min: 50000, max: 500000, precision: 10000 }),
                    alamat_pengiriman: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.helpers.arrayElement(provinces),
                });
                dummyPesananObat.push(pesanan);

                for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
                    await DetailPesananObat.create({
                        pesanan_id: pesanan._id,
                        obat_id: faker.helpers.arrayElement(dummyObat)._id,
                        jumlah: faker.number.int({ min: 1, max: 5 }),
                        harga_satuan: faker.number.int({ min: 10000, max: 100000, precision: 1000 }),
                    });
                }
            }
        }
        console.log('Dummy medicine orders and order details created.');

        // MetodePembayaran
        const dummyMetodePembayaran = await MetodePembayaran.insertMany([
            { nama_metode: 'Transfer Bank' },
            { nama_metode: 'Kartu Kredit' },
            { nama_metode: 'E-Wallet' },
            { nama_metode: 'COD' },
        ]);
        console.log('Dummy payment methods created.');

        // Transaksi
        for (let i = 0; i < 20; i++) { // 20 dummy transactions
            const pasien = faker.helpers.arrayElement(dummyPatients);
            const metodePembayaran = faker.helpers.arrayElement(dummyMetodePembayaran);
            const jenisTransaksi = faker.helpers.arrayElement(['Konsultasi', 'Pembelian Obat']);
            let referensiId = null;

            if (jenisTransaksi === 'Konsultasi' && dummyKonsultasi.length > 0) {
                referensiId = faker.helpers.arrayElement(dummyKonsultasi)._id;
            } else if (jenisTransaksi === 'Pembelian Obat' && dummyPesananObat.length > 0) {
                referensiId = faker.helpers.arrayElement(dummyPesananObat)._id;
            }

            if (referensiId) {
                await Transaksi.create({
                    pasien_id: pasien._id,
                    metode_pembayaran_id: metodePembayaran._id,
                    tanggal_transaksi: faker.date.recent({ days: 60 }),
                    jumlah: faker.number.int({ min: 50000, max: 500000, precision: 10000 }),
                    status_transaksi: faker.helpers.arrayElement(['Berhasil', 'Pending', 'Gagal']),
                    jenis_transaksi: jenisTransaksi,
                    referensi_id: referensiId,
                });
            }
        }
        console.log('Dummy transactions created.');

        // ActivityLog
        for (let i = 0; i < 30; i++) { // 30 dummy activity logs
            const user = faker.helpers.arrayElement(dummyUsers);
            await ActivityLog.create({
                user_id: user._id,
                aktivitas: faker.lorem.sentence(),
                tanggal_waktu: faker.date.recent({ days: 90 }),
                ip_address: faker.internet.ip(),
                perangkat: faker.helpers.arrayElement(['Mobile', 'Web', 'Desktop']),
            });
        }
        console.log('Dummy activity logs created.');

        // Media
        for (let i = 0; i < 10; i++) { // 10 dummy media
            await Media.create({
                nama_file: faker.system.fileName(),
                tipe_file: faker.system.fileType(),
                ukuran_file: faker.number.int({ min: 10000, max: 5000000 }),
                url: faker.image.url(),
                tanggal_unggah: faker.date.recent({ days: 100 }),
            });
        }
        console.log('Dummy media created.');

        // RefreshToken (minimal)
        for (const user of dummyUsers) {
            await RefreshToken.create({
                user_id: user._id,
                token: faker.string.uuid(),
                expires_at: faker.date.future({ years: 1 }),
            });
        }
        console.log('Dummy refresh tokens created.');

        // Notifikasi
        for (const user of dummyUsers) {
            for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
                await Notifikasi.create({
                    user_id: user._id,
                    judul: faker.lorem.sentence(3),
                    pesan: faker.lorem.paragraph(1),
                    tanggal_kirim: faker.date.recent({ days: 30 }),
                    is_dibaca: faker.datatype.boolean(),
                });
            }
        }
        console.log('Dummy notifications created.');

        // ArtikelKesehatan
        for (let i = 0; i < 10; i++) { // 10 dummy articles
            await ArtikelKesehatan.create({
                judul: faker.lorem.sentence(5),
                konten: faker.lorem.paragraphs(3),
                penulis: faker.person.fullName(),
                tanggal_publikasi: faker.date.recent({ days: 180 }),
                gambar_artikel: faker.image.urlLoremFlickr({ category: 'health' }),
                kategori: faker.helpers.arrayElement(['Gizi', 'Olahraga', 'Penyakit', 'Kesehatan Mental']),
            });
        }
        console.log('Dummy health articles created.');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err.message);
        process.exit(1);
    }
};

generateDummyData();
