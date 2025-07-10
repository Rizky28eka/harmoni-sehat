"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const faker_1 = require("@faker-js/faker");
const db_1 = __importDefault(require("../config/db"));
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const UserRole_1 = __importDefault(require("../models/UserRole"));
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
const Dokter_1 = __importDefault(require("../models/Dokter"));
const Apoteker_1 = __importDefault(require("../models/Apoteker"));
const Pasien_1 = __importDefault(require("../models/Pasien"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Specialization_1 = __importDefault(require("../models/Specialization"));
const Clinic_1 = __importDefault(require("../models/Clinic"));
const DoctorClinic_1 = __importDefault(require("../models/DoctorClinic"));
const PracticeSchedule_1 = __importDefault(require("../models/PracticeSchedule"));
const Consultation_1 = __importDefault(require("../models/Consultation"));
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const MedicalRecord_1 = __importDefault(require("../models/MedicalRecord"));
const DoctorReview_1 = __importDefault(require("../models/DoctorReview"));
const HealthArticle_1 = __importDefault(require("../models/HealthArticle"));
const Notification_1 = __importDefault(require("../models/Notification"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const Media_1 = __importDefault(require("../models/Media"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const PaymentMethod_1 = __importDefault(require("../models/PaymentMethod"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Drug_1 = __importDefault(require("../models/Drug"));
const DrugCart_1 = __importDefault(require("../models/DrugCart"));
const DrugOrder_1 = __importDefault(require("../models/DrugOrder"));
const DrugOrderDetail_1 = __importDefault(require("../models/DrugOrderDetail"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const PrescriptionDrug_1 = __importDefault(require("../models/PrescriptionDrug"));
dotenv_1.default.config();
// Set locale to Indonesian
const seedData = async () => {
    try {
        await (0, db_1.default)();
        // Clear existing data
        console.log('Clearing existing data...');
        await User_1.default.deleteMany({});
        await Role_1.default.deleteMany({});
        await UserRole_1.default.deleteMany({});
        await UserProfile_1.default.deleteMany({});
        await Dokter_1.default.deleteMany({});
        await Apoteker_1.default.deleteMany({});
        await Pasien_1.default.deleteMany({});
        await Admin_1.default.deleteMany({});
        await Specialization_1.default.deleteMany({});
        await Clinic_1.default.deleteMany({});
        await DoctorClinic_1.default.deleteMany({});
        await PracticeSchedule_1.default.deleteMany({});
        await Consultation_1.default.deleteMany({});
        await ChatMessage_1.default.deleteMany({});
        await MedicalRecord_1.default.deleteMany({});
        await DoctorReview_1.default.deleteMany({});
        await HealthArticle_1.default.deleteMany({});
        await Notification_1.default.deleteMany({});
        await ActivityLog_1.default.deleteMany({});
        await Media_1.default.deleteMany({});
        await RefreshToken_1.default.deleteMany({});
        await PaymentMethod_1.default.deleteMany({});
        await Transaction_1.default.deleteMany({});
        await Drug_1.default.deleteMany({});
        await DrugCart_1.default.deleteMany({});
        await DrugOrder_1.default.deleteMany({});
        await DrugOrderDetail_1.default.deleteMany({});
        await Prescription_1.default.deleteMany({});
        await PrescriptionDrug_1.default.deleteMany({});
        console.log('All existing data cleared.');
        // Create Roles
        const roles = await Role_1.default.insertMany([
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
        const superadminUser = await User_1.default.create({
            email: 'superadmin@example.com',
            password: 'password123',
        });
        await UserRole_1.default.create({ user_id: superadminUser._id, peran_id: superadminRole._id });
        await Admin_1.default.create({
            _id: `04${faker_1.faker.number.int({ min: 1000000000, max: 9999999999 })}`,
            user_id: superadminUser._id,
            nama: faker_1.faker.person.fullName(),
        });
        console.log('Superadmin created.');
        // Create Admin User
        const adminUser = await User_1.default.create({
            email: 'admin@example.com',
            password: 'password123',
        });
        await UserRole_1.default.create({ user_id: adminUser._id, peran_id: adminRole._id });
        await Admin_1.default.create({
            _id: `04${faker_1.faker.number.int({ min: 1000000000, max: 9999999999 })}`,
            user_id: adminUser._id,
            nama: faker_1.faker.person.fullName(),
        });
        console.log('Admin created.');
        // Create Dokter User
        const dokterUser = await User_1.default.create({
            email: 'dokter@example.com',
            password: 'password123',
        });
        await UserRole_1.default.create({ user_id: dokterUser._id, peran_id: dokterRole._id });
        const spesialisasi = await Specialization_1.default.create({ nama: 'Umum', deskripsi: 'Dokter Umum' });
        const dokter = await Dokter_1.default.create({
            _id: `10${faker_1.faker.number.int({ min: 1000000000, max: 9999999999 })}`,
            user_id: dokterUser._id,
            nama: faker_1.faker.person.fullName(),
            nomor_str: faker_1.faker.number.int({ min: 100000000000000, max: 999999999999999 }).toString(),
            spesialisasi_id: spesialisasi._id,
            biaya_konsultasi: faker_1.faker.number.int({ min: 50000, max: 200000 }),
            foto: faker_1.faker.image.avatar(),
            bio: faker_1.faker.lorem.paragraph(),
            status: 'active',
        });
        console.log('Dokter created.');
        // Create Apoteker User
        const apotekerUser = await User_1.default.create({
            email: 'apoteker@example.com',
            password: 'password123',
        });
        await UserRole_1.default.create({ user_id: apotekerUser._id, peran_id: apotekerRole._id });
        await Apoteker_1.default.create({
            _id: `20${faker_1.faker.number.int({ min: 1000000000, max: 9999999999 })}`,
            user_id: apotekerUser._id,
            nama: faker_1.faker.person.fullName(),
            nomor_sipa: faker_1.faker.number.int({ min: 100000000000000, max: 999999999999999 }).toString(),
        });
        console.log('Apoteker created.');
        // Create Pasien User
        const pasienUser = await User_1.default.create({
            email: 'pasien@example.com',
            password: 'password123',
        });
        await UserRole_1.default.create({ user_id: pasienUser._id, peran_id: pasienRole._id });
        const pasien = await Pasien_1.default.create({
            _id: `08${faker_1.faker.number.int({ min: 1000000000, max: 9999999999 })}`,
            user_id: pasienUser._id,
            nama: faker_1.faker.person.fullName(),
            nik: faker_1.faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString(),
            tanggal_lahir: faker_1.faker.date.past({ years: 30, refDate: '2000-01-01' }),
            jenis_kelamin: faker_1.faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
            alamat: faker_1.faker.location.streetAddress(true) + ', ' + faker_1.faker.location.city() + ', Jawa Tengah',
            no_telepon: faker_1.faker.phone.number(),
        });
        console.log('Pasien created.');
        // Create UserProfile for Pasien
        await UserProfile_1.default.create({
            user_id: pasienUser._id,
            foto: faker_1.faker.image.avatar(),
            bio: faker_1.faker.lorem.paragraph(),
        });
        console.log('UserProfile for Pasien created.');
        // Create Clinic
        const clinic = await Clinic_1.default.create({
            nama: 'Klinik Harmoni Sehat',
            alamat: faker_1.faker.location.streetAddress(true) + ', ' + faker_1.faker.location.city() + ', Jawa Barat',
            no_telepon: faker_1.faker.phone.number(),
            email: 'klinik@example.com',
            status: 'active',
        });
        console.log('Clinic created.');
        // Create DoctorClinic
        await DoctorClinic_1.default.create({
            dokter_id: dokter._id,
            klinik_id: clinic._id,
            status: 'active',
        });
        console.log('DoctorClinic created.');
        // Create PracticeSchedule
        const practiceSchedule = await PracticeSchedule_1.default.create({
            dokter_id: dokter._id,
            klinik_id: clinic._id,
            hari: 'Senin',
            jam_mulai: '09:00',
            jam_selesai: '17:00',
            is_active: true,
        });
        console.log('PracticeSchedule created.');
        // Create Consultation
        const consultation = await Consultation_1.default.create({
            pasien_id: pasien._id,
            dokter_id: dokter._id,
            jadwal_id: practiceSchedule._id,
            tanggal: faker_1.faker.date.future({ years: 1, refDate: new Date() }),
            status: 'scheduled',
            keluhan: faker_1.faker.lorem.sentence(),
        });
        console.log('Consultation created.');
        // Create ChatMessage
        await ChatMessage_1.default.create({
            konsultasi_id: consultation._id,
            pengirim_id: pasienUser._id,
            isi: faker_1.faker.lorem.sentence(),
            tipe: 'text',
            is_read: false,
        });
        console.log('ChatMessage created.');
        // Create MedicalRecord
        await MedicalRecord_1.default.create({
            pasien_id: pasien._id,
            riwayat_penyakit: faker_1.faker.lorem.sentence(),
            alergi: faker_1.faker.lorem.word(),
            riwayat_vaksinasi: faker_1.faker.lorem.sentence(),
        });
        console.log('MedicalRecord created.');
        // Create DoctorReview
        await DoctorReview_1.default.create({
            pasien_id: pasien._id,
            dokter_id: dokter._id,
            konsultasi_id: consultation._id,
            rating: faker_1.faker.number.int({ min: 1, max: 5 }),
            komentar: faker_1.faker.lorem.sentence(),
        });
        console.log('DoctorReview created.');
        // Create HealthArticle
        await HealthArticle_1.default.create({
            judul: faker_1.faker.lorem.sentence(),
            slug: faker_1.faker.lorem.slug(),
            konten: faker_1.faker.lorem.paragraphs(3),
            penulis_id: adminUser._id,
            status_publikasi: 'published',
        });
        console.log('HealthArticle created.');
        // Create Notification
        await Notification_1.default.create({
            user_id: pasienUser._id,
            judul: faker_1.faker.lorem.sentence(3),
            isi: faker_1.faker.lorem.paragraph(),
            tipe: 'info',
            is_read: false,
        });
        console.log('Notification created.');
        // Create ActivityLog
        await ActivityLog_1.default.create({
            user_id: superadminUser._id,
            aksi: 'LOGIN',
            deskripsi: 'Superadmin logged in',
        });
        console.log('ActivityLog created.');
        // Create Media
        await Media_1.default.create({
            model_type: 'UserProfile',
            model_id: pasienUser._id,
            url: faker_1.faker.image.url(),
            mime_type: 'image/jpeg',
            size: faker_1.faker.number.int({ min: 10000, max: 500000 }),
        });
        console.log('Media created.');
        // Create RefreshToken
        await RefreshToken_1.default.create({
            user_id: pasienUser._id,
            token: faker_1.faker.string.uuid(),
            expired_at: faker_1.faker.date.future({ years: 1, refDate: new Date() }),
        });
        console.log('RefreshToken created.');
        // Create PaymentMethod
        const paymentMethod = await PaymentMethod_1.default.create({
            nama: 'Transfer Bank',
            kode: 'BANK_TRANSFER',
            deskripsi: 'Pembayaran melalui transfer bank',
            is_active: true,
        });
        console.log('PaymentMethod created.');
        // Create Transaction
        await Transaction_1.default.create({
            user_id: pasienUser._id,
            total_biaya: faker_1.faker.number.int({ min: 10000, max: 500000 }),
            status: 'completed',
            metode_pembayaran_id: paymentMethod._id,
            external_id: faker_1.faker.string.uuid(),
            transaksiable_id: consultation._id,
            transaksiable_type: 'Consultation',
        });
        console.log('Transaction created.');
        // Create Drug
        const drug = await Drug_1.default.create({
            nama: 'Paracetamol',
            deskripsi: 'Obat pereda nyeri dan demam',
            kategori: 'Analgesik',
            stok: faker_1.faker.number.int({ min: 100, max: 1000 }),
            satuan: 'Tablet',
            harga: faker_1.faker.number.int({ min: 5000, max: 20000 }),
            kode_obat: faker_1.faker.number.int({ min: 100000, max: 999999 }).toString(),
            butuh_resep: false,
            tgl_kadaluarsa: faker_1.faker.date.future({ years: 2, refDate: new Date() }),
        });
        console.log('Drug created.');
        // Create DrugCart
        await DrugCart_1.default.create({
            pasien_id: pasien._id,
            obat_id: drug._id,
            jumlah: faker_1.faker.number.int({ min: 1, max: 10 }),
        });
        console.log('DrugCart created.');
        // Create DrugOrder
        const drugOrder = await DrugOrder_1.default.create({
            pasien_id: pasien._id,
            kode_pesanan: faker_1.faker.number.int({ min: 10000000, max: 99999999 }).toString(),
            total_harga: faker_1.faker.number.int({ min: 50000, max: 500000 }),
            status: 'processing',
            alamat_pengiriman: faker_1.faker.address.streetAddress(true) + ', ' + faker_1.faker.address.city() + ', Jawa Timur',
        });
        console.log('DrugOrder created.');
        // Create DrugOrderDetail
        await DrugOrderDetail_1.default.create({
            pesanan_id: drugOrder._id,
            obat_id: drug._id,
            jumlah: faker_1.faker.number.int({ min: 1, max: 5 }),
            harga_satuan: drug.harga,
            subtotal: drug.harga * faker_1.faker.number.int({ min: 1, max: 5 }),
        });
        console.log('DrugOrderDetail created.');
        // Create Prescription
        const prescription = await Prescription_1.default.create({
            konsultasi_id: consultation._id,
            catatan: faker_1.faker.lorem.sentence(),
            status: 'active',
            expired_at: faker_1.faker.date.future({ years: 1, refDate: new Date() }),
        });
        console.log('Prescription created.');
        // Create PrescriptionDrug
        await PrescriptionDrug_1.default.create({
            resep_id: prescription._id,
            obat_id: drug._id,
            dosis: '1 tablet',
            jumlah: 1,
            aturan_pakai: '3 kali sehari setelah makan',
        });
        console.log('PrescriptionDrug created.');
        console.log('Data seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
