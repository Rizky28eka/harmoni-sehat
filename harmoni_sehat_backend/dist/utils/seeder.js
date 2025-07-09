"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const db_1 = __importDefault(require("../config/db"));
// Import all models
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const UserRole_1 = __importDefault(require("../models/UserRole"));
const UserProfile_1 = __importDefault(require("../models/UserProfile"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const Patient_1 = __importDefault(require("../models/Patient"));
const Pharmacist_1 = __importDefault(require("../models/Pharmacist"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Specialization_1 = __importDefault(require("../models/Specialization"));
const Clinic_1 = __importDefault(require("../models/Clinic"));
const DoctorClinic_1 = __importDefault(require("../models/DoctorClinic"));
const PracticeSchedule_1 = __importDefault(require("../models/PracticeSchedule"));
const Consultation_1 = __importDefault(require("../models/Consultation"));
const MedicalRecord_1 = __importDefault(require("../models/MedicalRecord"));
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const DoctorReview_1 = __importDefault(require("../models/DoctorReview"));
const Drug_1 = __importDefault(require("../models/Drug"));
const DrugCart_1 = __importDefault(require("../models/DrugCart"));
const DrugOrder_1 = __importDefault(require("../models/DrugOrder"));
const DrugOrderDetail_1 = __importDefault(require("../models/DrugOrderDetail"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const PrescriptionDrug_1 = __importDefault(require("../models/PrescriptionDrug"));
const PaymentMethod_1 = __importDefault(require("../models/PaymentMethod"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const Media_1 = __importDefault(require("../models/Media"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const Notification_1 = __importDefault(require("../models/Notification"));
const HealthArticle_1 = __importDefault(require("../models/HealthArticle"));
const faker = new faker_1.Faker({ locale: [faker_1.id_ID, faker_1.en] });
const seedData = async () => {
    try {
        await (0, db_1.default)();
        console.log('Dropping customUserId_1 index from users collection...');
        try {
            await mongoose_1.default.connection.collection('users').dropIndex('customUserId_1');
            console.log('customUserId_1 index dropped successfully.');
        }
        catch (error) {
            if (error.code === 27) {
                console.log('customUserId_1 index does not exist, skipping drop.');
            }
            else {
                console.error('Error dropping customUserId_1 index:', error);
            }
        }
        console.log('Clearing existing data...');
        await User_1.default.deleteMany({});
        await Role_1.default.deleteMany({});
        await UserRole_1.default.deleteMany({});
        await UserProfile_1.default.deleteMany({});
        await Doctor_1.default.deleteMany({});
        await Patient_1.default.deleteMany({});
        await Pharmacist_1.default.deleteMany({});
        await Admin_1.default.deleteMany({});
        await Specialization_1.default.deleteMany({});
        await Clinic_1.default.deleteMany({});
        await DoctorClinic_1.default.deleteMany({});
        await PracticeSchedule_1.default.deleteMany({});
        await Consultation_1.default.deleteMany({});
        await MedicalRecord_1.default.deleteMany({});
        await ChatMessage_1.default.deleteMany({});
        await DoctorReview_1.default.deleteMany({});
        await Drug_1.default.deleteMany({});
        await DrugCart_1.default.deleteMany({});
        await DrugOrder_1.default.deleteMany({});
        await DrugOrderDetail_1.default.deleteMany({});
        await Prescription_1.default.deleteMany({});
        await PrescriptionDrug_1.default.deleteMany({});
        await PaymentMethod_1.default.deleteMany({});
        await Transaction_1.default.deleteMany({});
        await ActivityLog_1.default.deleteMany({});
        await Media_1.default.deleteMany({});
        await RefreshToken_1.default.deleteMany({});
        await Notification_1.default.deleteMany({});
        await HealthArticle_1.default.deleteMany({});
        console.log('Data cleared.');
        // Seed Roles
        const roles = await Role_1.default.insertMany([
            { nama_peran: 'patient' },
            { nama_peran: 'doctor' },
            { nama_peran: 'pharmacist' },
            { nama_peran: 'admin' },
        ]);
        const patientRole = roles.find(r => r.nama_peran === 'patient');
        const doctorRole = roles.find(r => r.nama_peran === 'doctor');
        const pharmacistRole = roles.find(r => r.nama_peran === 'pharmacist');
        const adminRole = roles.find(r => r.nama_peran === 'admin');
        console.log(`${roles.length} roles created.`);
        // Seed Users, UserProfiles, and assign roles
        const users = [];
        const userProfiles = [];
        const userRoles = [];
        const doctors = [];
        const patients = [];
        const pharmacists = [];
        const admins = [];
        for (let i = 0; i < 50; i++) {
            const user = await User_1.default.create({
                email: faker.internet.email(),
                password: 'password123', // In a real app, hash this!
                is_active: true,
            });
            users.push(user);
            userProfiles.push({
                user_id: user._id,
                foto: faker.image.avatar(),
                bio: faker.lorem.sentence(),
            });
            let assignedRole;
            if (i < 5) { // 5 Admins
                assignedRole = adminRole;
                admins.push(await Admin_1.default.create({ user_id: user._id, nama: faker.person.fullName() }));
            }
            else if (i < 15) { // 10 Doctors
                assignedRole = doctorRole;
                doctors.push(await Doctor_1.default.create({
                    user_id: user._id,
                    nama: faker.person.fullName(),
                    nomor_str: faker.string.alphanumeric(10),
                    specialization_id: new mongoose_1.default.Types.ObjectId(), // Placeholder, will update after specializations are seeded
                    biaya_konsultasi: faker.number.int({ min: 50000, max: 200000 }),
                    foto: faker.image.avatar(),
                    bio: faker.lorem.paragraph(),
                    status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
                }));
            }
            else if (i < 20) { // 5 Pharmacists
                assignedRole = pharmacistRole;
                pharmacists.push(await Pharmacist_1.default.create({
                    user_id: user._id,
                    nama: faker.person.fullName(),
                    nomor_sipa: faker.string.alphanumeric(10),
                }));
            }
            else { // Remaining are Patients
                assignedRole = patientRole;
                patients.push(await Patient_1.default.create({
                    user_id: user._id,
                    nama: faker.person.fullName(),
                    nik: faker.string.numeric(16),
                    tanggal_lahir: faker.date.past({ years: 30 }),
                    jenis_kelamin: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
                    alamat: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, Indonesia`,
                    no_telepon: `08${faker.string.numeric(9)}`,
                }));
            }
            userRoles.push({ user_id: user._id, role_id: assignedRole._id });
        }
        await UserProfile_1.default.insertMany(userProfiles);
        await UserRole_1.default.insertMany(userRoles);
        console.log(`${users.length} users, ${userProfiles.length} user profiles, ${userRoles.length} user roles created.`);
        console.log(`${doctors.length} doctors, ${patients.length} patients, ${pharmacists.length} pharmacists, ${admins.length} admins created.`);
        // Seed Specializations
        const specializations = await Specialization_1.default.insertMany([
            { nama: 'Umum', deskripsi: 'Dokter umum', is_active: true },
            { nama: 'Anak', deskripsi: 'Spesialis anak', is_active: true },
            { nama: 'Gigi', deskripsi: 'Dokter gigi', is_active: true },
            { nama: 'Jantung', deskripsi: 'Spesialis jantung', is_active: true },
            { nama: 'Kulit', deskripsi: 'Spesialis kulit', is_active: true },
        ]);
        console.log(`${specializations.length} specializations created.`);
        // Update Doctors with actual specialization_ids
        for (const doctor of doctors) {
            doctor.specialization_id = faker.helpers.arrayElement(specializations)._id;
            await doctor.save();
        }
        console.log('Doctors updated with specializations.');
        // Seed Clinics
        const clinics = [];
        for (let i = 0; i < 10; i++) {
            clinics.push(await Clinic_1.default.create({
                nama: faker.company.name() + ' Clinic',
                alamat: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, Indonesia`,
                no_telepon: `021${faker.string.numeric(8)}`,
                email: faker.internet.email(),
                status: faker.helpers.arrayElement(['active', 'inactive']),
            }));
        }
        console.log(`${clinics.length} clinics created.`);
        // Seed DoctorClinics
        const doctorClinics = [];
        for (const doctor of doctors) {
            const numClinics = faker.number.int({ min: 1, max: 3 });
            for (let i = 0; i < numClinics; i++) {
                doctorClinics.push(await DoctorClinic_1.default.create({
                    doctor_id: doctor._id,
                    clinic_id: faker.helpers.arrayElement(clinics)._id,
                    status: faker.helpers.arrayElement(['active', 'inactive']),
                }));
            }
        }
        console.log(`${doctorClinics.length} doctor clinics created.`);
        // Seed PracticeSchedules
        const practiceSchedules = [];
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        for (const doctor of doctors) {
            for (const clinic of clinics) {
                if (faker.datatype.boolean()) { // Randomly assign schedules
                    practiceSchedules.push(await PracticeSchedule_1.default.create({
                        doctor_id: doctor._id,
                        clinic_id: clinic._id,
                        hari: faker.helpers.arrayElement(days),
                        jam_mulai: '09:00',
                        jam_selesai: '17:00',
                        is_active: true,
                    }));
                }
            }
        }
        console.log(`${practiceSchedules.length} practice schedules created.`);
        // Seed MedicalRecords
        const medicalRecords = [];
        for (const patient of patients) {
            medicalRecords.push(await MedicalRecord_1.default.create({
                patient_id: patient._id,
                riwayat_penyakit: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 3 }),
                alergi: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 2 }),
                riwayat_vaksinasi: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 2 }),
            }));
        }
        console.log(`${medicalRecords.length} medical records created.`);
        // Seed Drugs
        const drugs = [];
        for (let i = 0; i < 30; i++) {
            drugs.push(await Drug_1.default.create({
                nama: faker.commerce.productName() + ' ' + faker.helpers.arrayElement(['Tablet', 'Sirup', 'Kapsul']),
                deskripsi: faker.lorem.sentence(),
                kategori: faker.commerce.department(),
                harga: faker.number.int({ min: 5000, max: 100000 }),
                stok: faker.number.int({ min: 10, max: 500 }),
                satuan: faker.helpers.arrayElement(['strip', 'botol', 'tablet', 'kapsul']),
                butuh_resep: faker.datatype.boolean(),
                tgl_kadaluarsa: faker.date.future({ years: 2 }),
            }));
        }
        console.log(`${drugs.length} drugs created.`);
        // Seed Consultations, ChatMessages, DoctorReviews, Prescriptions, PrescriptionDrugs
        const consultations = [];
        const chatMessages = [];
        const doctorReviews = [];
        const prescriptions = [];
        const prescriptionDrugs = [];
        for (let i = 0; i < 30; i++) {
            const patient = faker.helpers.arrayElement(patients);
            const doctor = faker.helpers.arrayElement(doctors);
            const schedule = faker.helpers.arrayElement(practiceSchedules.filter(s => s.doctor_id.equals(doctor._id)));
            if (!schedule)
                continue; // Skip if no schedule found for doctor
            const consultation = await Consultation_1.default.create({
                patient_id: patient._id,
                doctor_id: doctor._id,
                schedule_id: schedule._id,
                tanggal: faker.date.recent({ days: 30 }),
                status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
                keluhan: faker.lorem.sentence(),
                diagnosa: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
                tindakan: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
                catatan_dokter: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
                video_call_url: faker.datatype.boolean() ? faker.internet.url() : undefined,
            });
            consultations.push(consultation);
            // Chat Messages for consultation
            for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
                chatMessages.push(await ChatMessage_1.default.create({
                    consultation_id: consultation._id,
                    sender_id: faker.helpers.arrayElement([patient.user_id, doctor.user_id]),
                    isi: faker.lorem.sentence(),
                    tipe: 'text',
                    is_read: faker.datatype.boolean(),
                }));
            }
            // Doctor Review for completed consultations
            if (consultation.status === 'completed') {
                doctorReviews.push(await DoctorReview_1.default.create({
                    patient_id: patient._id,
                    doctor_id: doctor._id,
                    consultation_id: consultation._id,
                    rating: faker.number.int({ min: 1, max: 5 }),
                    komentar: faker.lorem.sentence(),
                }));
            }
            // Prescription for some completed consultations
            if (consultation.status === 'completed' && faker.datatype.boolean()) {
                const prescription = await Prescription_1.default.create({
                    consultation_id: consultation._id,
                    catatan: faker.lorem.sentence(),
                    status: faker.helpers.arrayElement(['active', 'inactive', 'expired']),
                    expired_at: faker.date.future({ years: 1 }),
                });
                prescriptions.push(prescription);
                // Prescription Drugs
                const numDrugs = faker.number.int({ min: 1, max: 3 });
                for (let k = 0; k < numDrugs; k++) {
                    const drug = faker.helpers.arrayElement(drugs);
                    prescriptionDrugs.push(await PrescriptionDrug_1.default.create({
                        prescription_id: prescription._id,
                        drug_id: drug._id,
                        dosis: faker.lorem.word(),
                        jumlah: faker.number.int({ min: 1, max: 10 }),
                        aturan_pakai: faker.lorem.sentence(),
                    }));
                }
            }
        }
        console.log(`${consultations.length} consultations created.`);
        console.log(`${chatMessages.length} chat messages created.`);
        console.log(`${doctorReviews.length} doctor reviews created.`);
        console.log(`${prescriptions.length} prescriptions created.`);
        console.log(`${prescriptionDrugs.length} prescription drugs created.`);
        // Seed DrugCarts
        const drugCarts = [];
        for (const patient of patients) {
            const numItems = faker.number.int({ min: 0, max: 5 });
            for (let i = 0; i < numItems; i++) {
                const drug = faker.helpers.arrayElement(drugs);
                try {
                    drugCarts.push(await DrugCart_1.default.create({
                        patient_id: patient._id,
                        drug_id: drug._id,
                        jumlah: faker.number.int({ min: 1, max: 5 }),
                    }));
                }
                catch (error) {
                    if (error.code === 11000) { // Duplicate key error for unique compound index
                        // console.log('Duplicate drug in cart for patient, skipping.');
                    }
                    else {
                        console.error('Error creating drug cart item:', error);
                    }
                }
            }
        }
        console.log(`${drugCarts.length} drug carts created.`);
        // Seed DrugOrders and DrugOrderDetails
        const drugOrders = [];
        const drugOrderDetails = [];
        for (let i = 0; i < 20; i++) {
            const patient = faker.helpers.arrayElement(patients);
            const order = await DrugOrder_1.default.create({
                patient_id: patient._id,
                kode_pesanan: faker.string.alphanumeric(12).toUpperCase(),
                total_harga: 0, // Will be calculated from details
                status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
                alamat_pengiriman: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, Indonesia`,
            });
            drugOrders.push(order);
            let currentTotalHarga = 0;
            const numOrderItems = faker.number.int({ min: 1, max: 5 });
            for (let j = 0; j < numOrderItems; j++) {
                const drug = faker.helpers.arrayElement(drugs);
                const jumlah = faker.number.int({ min: 1, max: 3 });
                const harga_satuan = drug.harga;
                const subtotal = harga_satuan * jumlah;
                drugOrderDetails.push(await DrugOrderDetail_1.default.create({
                    order_id: order._id,
                    drug_id: drug._id,
                    harga_satuan: harga_satuan,
                    jumlah: jumlah,
                    subtotal: subtotal,
                }));
                currentTotalHarga += subtotal;
            }
            order.total_harga = currentTotalHarga;
            await order.save();
        }
        console.log(`${drugOrders.length} drug orders created.`);
        console.log(`${drugOrderDetails.length} drug order details created.`);
        // Seed PaymentMethods
        const paymentMethods = await PaymentMethod_1.default.insertMany([
            { nama: 'Transfer Bank', kode: 'BANK_TRANSFER', deskripsi: 'Pembayaran melalui transfer bank', is_active: true },
            { nama: 'Kartu Kredit', kode: 'CREDIT_CARD', deskripsi: 'Pembayaran menggunakan kartu kredit', is_active: true },
            { nama: 'E-Wallet', kode: 'E_WALLET', deskripsi: 'Pembayaran melalui dompet digital', is_active: true },
        ]);
        console.log(`${paymentMethods.length} payment methods created.`);
        // Seed Transactions
        const transactions = [];
        for (let i = 0; i < 20; i++) {
            const user = faker.helpers.arrayElement(users);
            const paymentMethod = faker.helpers.arrayElement(paymentMethods);
            const isDrugOrder = faker.datatype.boolean();
            let transaksiable_id;
            let transaksiable_type;
            let total_biaya;
            if (isDrugOrder && drugOrders.length > 0) {
                const drugOrder = faker.helpers.arrayElement(drugOrders);
                transaksiable_id = drugOrder._id;
                transaksiable_type = 'DrugOrder';
                total_biaya = drugOrder.total_harga;
            }
            else if (consultations.length > 0) {
                const consultation = faker.helpers.arrayElement(consultations);
                transaksiable_id = consultation._id;
                transaksiable_type = 'Consultation';
                const doctorForConsultation = doctors.find(doc => doc._id.equals(consultation.doctor_id));
                total_biaya = doctorForConsultation ? doctorForConsultation.biaya_konsultasi : 0; // Get consultation cost from doctor
            }
            else {
                continue; // Skip if no valid transaction source
            }
            transactions.push(await Transaction_1.default.create({
                user_id: user._id,
                total_biaya: total_biaya,
                status: faker.helpers.arrayElement(['pending', 'completed', 'failed']),
                payment_method_id: paymentMethod._id,
                external_id: faker.string.uuid(),
                transaksiable_id: transaksiable_id,
                transaksiable_type: transaksiable_type,
            }));
        }
        console.log(`${transactions.length} transactions created.`);
        // Seed ActivityLogs
        const activityLogs = [];
        for (let i = 0; i < 50; i++) {
            activityLogs.push(await ActivityLog_1.default.create({
                user_id: faker.helpers.arrayElement(users)._id,
                aksi: faker.lorem.word(),
                deskripsi: faker.lorem.sentence(),
                timestamp: faker.date.recent({ days: 30 }),
            }));
        }
        console.log(`${activityLogs.length} activity logs created.`);
        // Seed Media
        const mediaItems = [];
        for (let i = 0; i < 20; i++) {
            const modelTypes = ['User', 'HealthArticle']; // Add other models that might have media
            const modelType = faker.helpers.arrayElement(modelTypes);
            let modelId;
            if (modelType === 'User') {
                modelId = faker.helpers.arrayElement(users)._id;
            }
            else if (modelType === 'HealthArticle' && HealthArticle_1.default.length > 0) {
                modelId = faker.helpers.arrayElement(await HealthArticle_1.default.find())._id;
            }
            else {
                continue;
            }
            mediaItems.push(await Media_1.default.create({
                model_type: modelType,
                model_id: modelId,
                url: faker.image.url(),
                mime_type: faker.helpers.arrayElement(['image/jpeg', 'image/png', 'application/pdf']),
                size: faker.number.int({ min: 10000, max: 5000000 }),
            }));
        }
        console.log(`${mediaItems.length} media items created.`);
        // Seed RefreshTokens
        const refreshTokens = [];
        for (const user of users) {
            if (faker.datatype.boolean()) { // Some users might have refresh tokens
                refreshTokens.push(await RefreshToken_1.default.create({
                    user_id: user._id,
                    token: faker.string.uuid(),
                    expired_at: faker.date.future({ years: 1 }),
                }));
            }
        }
        console.log(`${refreshTokens.length} refresh tokens created.`);
        // Seed Notifications
        const notifications = [];
        for (let i = 0; i < 50; i++) {
            notifications.push(await Notification_1.default.create({
                user_id: faker.helpers.arrayElement(users)._id,
                judul: faker.lorem.sentence(3),
                isi: faker.lorem.paragraph(),
                tipe: faker.helpers.arrayElement(['info', 'warning', 'error', 'success']),
                is_read: faker.datatype.boolean(),
            }));
        }
        console.log(`${notifications.length} notifications created.`);
        // Seed HealthArticles
        const healthArticles = [];
        const authors = [...admins, ...doctors];
        for (let i = 0; i < 15; i++) {
            const author = faker.helpers.arrayElement(authors);
            const authorType = author instanceof Admin_1.default ? 'Admin' : 'Doctor';
            healthArticles.push(await HealthArticle_1.default.create({
                judul: faker.lorem.sentence(5),
                slug: faker.lorem.slug(),
                konten: faker.lorem.paragraphs(3),
                author_id: author._id,
                author_type: authorType,
                status_publikasi: faker.helpers.arrayElement(['draft', 'published', 'archived']),
            }));
        }
        console.log(`${healthArticles.length} health articles created.`);
        console.log('Data seeding complete!');
        process.exit();
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
