require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const connectDB = require('./src/config/db');
const indonesiaLocations = require('./src/config/indonesiaLocations');

// Import all Mongoose Models
const Provinsi = require('./src/models/Provinsi');
const Kota = require('./src/models/Kota');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const Apotek = require('./src/models/Apotek');
const Apoteker = require('./src/models/Apoteker');
const KategoriArtikel = require('./src/models/KategoriArtikel');
const ArtikelKesehatan = require('./src/models/ArtikelKesehatan');
const FAQ = require('./src/models/FAQ');
const KategoriObat = require('./src/models/KategoriObat');
const Kurir = require('./src/models/Kurir');
const Log = require('./src/models/Log');
const Obat = require('./src/models/Obat');
const Pasien = require('./src/models/Pasien');
const Promo = require('./src/models/Promo');
const RumahSakit = require('./src/models/RumahSakit');
const Klinik = require('./src/models/Klinik');
const Spesialisasi = require('./src/models/Spesialisasi');
const Doctor = require('./src/models/Doctor');
const Konsultasi = require('./src/models/Konsultasi');
const Resep = require('./src/models/Resep');
const Pembayaran = require('./src/models/Pembayaran');
const UserPromo = require('./src/models/UserPromo');
const SystemSettings = require('./src/models/SystemSettings');
const StokObat = require('./src/models/StokObat');
const Pengiriman = require('./src/models/Pengiriman');
const DetailResep = require('./src/models/DetailResep');
const MedicalRecord = require('./src/models/MedicalRecord');
const VitalSigns = require('./src/models/VitalSigns');
const Notifikasi = require('./src/models/Notifikasi');
const ReviewRating = require('./src/models/ReviewRating');
const Feedback = require('./src/models/Feedback');
const ChatMessage = require('./src/models/ChatMessage');
const JadwalDoctor = require('./src/models/JadwalDoctor');
const Appointment = require('./src/models/Appointment');
const ChatSession = require('./src/models/ChatSession');
const AuditTrail = require('./src/models/AuditTrail');
const AppAnalytics = require('./src/models/AppAnalytics');

// Define Data Volumes

const NUM_USERS = 200; // Mix of roles
const NUM_ADMINS = 5;
const NUM_APOTEK = 20;
const NUM_APOTEKERS = 15;
const NUM_KATEGORI_ARTIKEL = 5;
const NUM_ARTIKEL_KESEHATAN = 50;
const NUM_FAQ = 20;
const NUM_KATEGORI_OBAT = 5;
const NUM_KURIR = 10;
const NUM_LOGS = 100;
const NUM_OBAT = 50;
const NUM_PASIEN = 100;
const NUM_PROMO = 10;
const NUM_RUMAH_SAKIT = 15;
const NUM_KLINIK = 15;
const NUM_SPESIALISASI = 10;
const NUM_DOCTORS = 40;
const NUM_KONSULTASI = 80;
const NUM_RESEP = 60;
const NUM_PEMBAYARAN = 70;
const NUM_USER_PROMO = 50;
const NUM_STOK_OBAT_PER_APOTEK_OBAT = 3; // Max stok entries per apotek-obat combo
const NUM_PENGIRIMAN = 50;
const NUM_DETAIL_RESEP_PER_RESEP = 5;
const NUM_MEDICAL_RECORD = 70;
const NUM_VITAL_SIGNS = 100;
const NUM_NOTIFIKASI = 150;
const NUM_REVIEW_RATING = 60;
const NUM_FEEDBACK = 30;
const NUM_CHAT_MESSAGES = 200;
const NUM_JADWAL_DOCTOR = 50;
const NUM_APPOINTMENT = 70;
const NUM_CHAT_SESSIONS = 50;
const NUM_AUDIT_TRAIL = 100;
const NUM_APP_ANALYTICS = 100;

// Helper functions
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomTime = () => {
  const hours = faker.number.int({ min: 0, max: 23 }).toString().padStart(2, '0');
  const minutes = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  const seconds = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Starting MongoDB Seeding...');

    // Clear existing data (reverse order of dependencies)
    console.log('Clearing existing data...');
    await AppAnalytics.deleteMany({});
    await AuditTrail.deleteMany({});
    await ChatSession.deleteMany({});
    await Appointment.deleteMany({});
    await JadwalDoctor.deleteMany({});
    await ChatMessage.deleteMany({});
    await Feedback.deleteMany({});
    await ReviewRating.deleteMany({});
    await Notifikasi.deleteMany({});
    await VitalSigns.deleteMany({});
    await MedicalRecord.deleteMany({});
    await DetailResep.deleteMany({});
    await Pengiriman.deleteMany({});
    await StokObat.deleteMany({});
    await UserPromo.deleteMany({});
    await Pembayaran.deleteMany({});
    await Resep.deleteMany({});
    await Konsultasi.deleteMany({});
    await Doctor.deleteMany({});
    await Spesialisasi.deleteMany({});
    await Klinik.deleteMany({});
    await RumahSakit.deleteMany({});
    await Promo.deleteMany({});
    await Pasien.deleteMany({});
    await Obat.deleteMany({});
    await Log.deleteMany({});
    await Kurir.deleteMany({});
    await KategoriObat.deleteMany({});
    await FAQ.deleteMany({});
    await ArtikelKesehatan.deleteMany({});
    await KategoriArtikel.deleteMany({});
    await Apoteker.deleteMany({});
    await Apotek.deleteMany({});
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Kota.deleteMany({});
    await Provinsi.deleteMany({});
    await SystemSettings.deleteMany({}); // System settings are often seeded once, but clearing for full reset
    console.log('Data cleared.');

    // Store IDs for relationships
    const provinsiIds = [];
    const kotaIds = [];
    const userIds = [];
    const adminIds = [];
    const apotekIds = [];
    const apotekerIds = [];
    const kategoriArtikelIds = [];
    const artikelKesehatanIds = [];
    const faqIds = [];
    const kategoriObatIds = [];
    const kurirIds = [];
    const logIds = [];
    const obatIds = [];
    const pasienIds = [];
    const promoIds = [];
    const rumahSakitIds = [];
    const klinikIds = [];
    const spesialisasiIds = [];
    const doctorIds = [];
    const konsultasiIds = [];
    const resepIds = [];
    const pembayaranIds = [];
    const userPromoIds = [];
    const stokObatIds = [];
    const pengirimanIds = [];
    const detailResepIds = [];
    const medicalRecordIds = [];
    const vitalSignsIds = [];
    const notifikasiIds = [];
    const reviewRatingIds = [];
    const feedbackIds = [];
    const chatMessageIds = [];
    const jadwalDoctorIds = [];
    const appointmentIds = [];
    const chatSessionIds = [];
    const auditTrailIds = [];
    const appAnalyticsIds = [];

    // 1. SystemSettings (Independent)
    console.log('Seeding SystemSettings...');
    const systemSettingsData = [
      {
        setting_key: 'app_name',
        setting_value: 'Harmoni Sehat',
        setting_type: 'string',
        category: 'general',
        description: 'Application name',
        is_public: true,
        is_editable: true
      },
      {
        setting_key: 'app_version',
        setting_value: '1.0.0',
        setting_type: 'string',
        category: 'general',
        description: 'Current application version',
        is_public: true,
        is_editable: false
      },
      {
        setting_key: 'max_consultation_duration',
        setting_value: '60',
        setting_type: 'number',
        category: 'consultation',
        description: 'Maximum consultation duration in minutes',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'consultation_reminder_minutes',
        setting_value: '15',
        setting_type: 'number',
        category: 'consultation',
        description: 'Send reminder X minutes before consultation',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'prescription_expiry_days',
        setting_value: '30',
        setting_type: 'number',
        category: 'prescription',
        description: 'Prescription validity in days',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'enable_push_notifications',
        setting_value: 'true',
        setting_type: 'boolean',
        category: 'notifications',
        description: 'Enable push notifications',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'maintenance_mode',
        setting_value: 'false',
        setting_type: 'boolean',
        category: 'system',
        description: 'Enable maintenance mode',
        is_public: true,
        is_editable: true
      },
      {
        setting_key: 'default_consultation_fee',
        setting_value: '50000',
        setting_type: 'number',
        category: 'billing',
        description: 'Default consultation fee in rupiah',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'payment_gateway_fee_percentage',
        setting_value: '2.5',
        setting_type: 'number',
        category: 'billing',
        description: 'Payment gateway fee percentage',
        is_public: false,
        is_editable: true
      },
      {
        setting_key: 'max_file_upload_size',
        setting_value: '10485760',
        setting_type: 'number',
        category: 'system',
        description: 'Maximum file upload size in bytes (10MB)',
        is_public: false,
        is_editable: true
      }
    ];
    await SystemSettings.insertMany(systemSettingsData);
    console.log(`Seeded ${systemSettingsData.length} SystemSettings.`);

    // 2. Provinsi (Independent)
    console.log('Seeding Provinsi...');
    for (const loc of indonesiaLocations) {
      const provinsi = await Provinsi.create({
        nama_provinsi: loc.provinsi,
        kode_provinsi: faker.string.alphanumeric(5).toUpperCase(),
        is_active: true,
      });
      provinsiIds.push({ _id: provinsi._id, nama_provinsi: provinsi.nama_provinsi });
    }
    console.log(`Seeded ${provinsiIds.length} Provinsi.`);

    // 3. Kota (Depends on Provinsi)
    console.log('Seeding Kota...');
    const uniqueKotaCombinations = new Set();
    for (const loc of indonesiaLocations) {
      const foundProvinsi = provinsiIds.find(p => p.nama_provinsi === loc.provinsi);
      if (foundProvinsi) {
        for (const nama_kota_kabupaten of loc.kota_kabupaten) {
          const combinationKey = `${foundProvinsi._id}-${nama_kota_kabupaten}`;
          if (!uniqueKotaCombinations.has(combinationKey)) {
            uniqueKotaCombinations.add(combinationKey);
            const kota = await Kota.create({
              provinsi_id: foundProvinsi._id,
              nama_kota: nama_kota_kabupaten,
              kode_kota: faker.string.alphanumeric(5).toUpperCase(),
              is_active: true,
            });
            kotaIds.push(kota._id);
          }
        }
      }
    }
    console.log(`Seeded ${kotaIds.length} Kota.`);

    // 4. Users (Independent, but roles are important for later)
    console.log('Seeding Users...');
    const roles = ['pasien', 'doctor', 'apoteker', 'admin'];
    const uniqueEmails = new Set();
    for (let i = 0; i < NUM_USERS; i++) {
      let email;
      do {
        email = faker.internet.email();
        if (uniqueEmails.has(email)) {
          email = `${faker.string.uuid()}_` + email; // Add UUID prefix for strong uniqueness
        }
      } while (uniqueEmails.has(email));
      uniqueEmails.add(email);

      const role = faker.helpers.arrayElement(roles);
      const user = await User.create({
        email: email,
        password: 'password123', // Password will be hashed by pre-save hook
        phone: faker.phone.number('+628##########'),
        role: role,
        is_active: faker.datatype.boolean(),
        is_verified: faker.datatype.boolean(),
        last_login: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
        password_reset_token: faker.datatype.boolean() ? faker.string.uuid() : '',
        password_reset_expires: faker.datatype.boolean() ? randomDate(new Date(), new Date(Date.now() + 3600000)) : new Date(0),
        provider: faker.datatype.boolean() ? faker.helpers.arrayElement(['google', 'facebook']) : '',
        provider_id: faker.datatype.boolean() ? faker.string.uuid() : '',
        login_attempts: faker.number.int({ min: 0, max: 5 }),
        locked_until: faker.datatype.boolean() ? randomDate(new Date(), new Date(Date.now() + 3600000)) : new Date(0),
        verification_token: faker.datatype.boolean() ? faker.string.uuid() : '',
        verification_expires: faker.datatype.boolean() ? randomDate(new Date(), new Date(Date.now() + 3600000)) : new Date(0),
      });
      userIds.push({ _id: user._id, role: user.role });
    }
    console.log(`Seeded ${userIds.length} Users.`);

    // 5. Admin (Depends on User)
    console.log('Seeding Admin...');
    const adminUsers = userIds.filter(u => u.role === 'admin').map(u => u._id);
    for (let i = 0; i < Math.min(NUM_ADMINS, adminUsers.length); i++) {
      const admin = await Admin.create({
        user_id: adminUsers[i],
        nama_lengkap: faker.person.fullName(),
        level_akses: faker.helpers.arrayElement(['super_admin', 'admin', 'moderator']),
        foto_profil: faker.image.avatar(),
        departemen: faker.commerce.department(),
        permissions: faker.helpers.arrayElements(['read', 'write', 'delete', 'manage_users'], { min: 1, max: 3 }),
      });
      adminIds.push(admin._id);
    }
    console.log(`Seeded ${adminIds.length} Admin.`);

    // 6. Apotek (Depends on Provinsi, Kota)
    console.log('Seeding Apotek...');
    const uniqueApotekEmails = new Set();
    for (let i = 0; i < NUM_APOTEK; i++) {
      let email;
      do {
        email = faker.internet.email();
      } while (uniqueApotekEmails.has(email));
      uniqueApotekEmails.add(email);

      const apotek = await Apotek.create({
        nama_apotek: faker.company.name() + ' Apotek',
        alamat: faker.location.streetAddress(true),
        no_telepon: faker.phone.number('+628##########'),
        email: email,
        jam_buka: randomTime(),
        jam_tutup: randomTime(),
        koordinat_lat: faker.location.latitude(),
        koordinat_lng: faker.location.longitude(),
        foto_apotek: faker.image.urlLoremFlickr({ category: 'pharmacy' }),
        is_24_jam: faker.datatype.boolean(),
        is_active: faker.datatype.boolean(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
        no_sipa: faker.string.alphanumeric(15).toUpperCase(),
        pemilik: faker.person.fullName(),
        provinsi_id: faker.helpers.arrayElement(provinsiIds)._id,
        kota_id: faker.helpers.arrayElement(kotaIds),
      });
      apotekIds.push(apotek._id);
    }
    console.log(`Seeded ${apotekIds.length} Apotek.`);

    // 7. KategoriArtikel (Independent)
    console.log('Seeding KategoriArtikel...');
    const defaultKategoriArtikel = [
      {
        nama_kategori: 'Kesehatan Umum',
        deskripsi: 'Artikel tentang kesehatan umum dan pencegahan penyakit',
        icon: 'heart',
        color: '#EF4444'
      },
      {
        nama_kategori: 'Gizi dan Diet',
        deskripsi: 'Artikel tentang nutrisi, diet, dan pola makan sehat',
        icon: 'apple',
        color: '#10B981'
      },
      {
        nama_kategori: 'Kesehatan Mental',
        deskripsi: 'Artikel tentang kesehatan mental dan psikologi',
        icon: 'brain',
        color: '#8B5CF6'
      },
      {
        nama_kategori: 'Kesehatan Anak',
        deskripsi: 'Artikel tentang kesehatan dan tumbuh kembang anak',
        icon: 'baby',
        color: '#F59E0B'
      },
      {
        nama_kategori: 'Kesehatan Wanita',
        deskripsi: 'Artikel tentang kesehatan reproduksi dan khusus wanita',
        icon: 'user-plus',
        color: '#EC4899'
      }
    ];
    for (const data of defaultKategoriArtikel) {
      const kategori = await KategoriArtikel.create(data);
      kategoriArtikelIds.push(kategori._id);
    }
    const uniqueKategoriArtikelNames = new Set(defaultKategoriArtikel.map(k => k.nama_kategori));
    let kategoriArtikelCounter = 0;
    while (kategoriArtikelIds.length < NUM_KATEGORI_ARTIKEL) {
      let namaKategori;
      do {
        namaKategori = faker.lorem.word();
        if (uniqueKategoriArtikelNames.has(namaKategori)) {
          namaKategori = `temp_${kategoriArtikelCounter++}_` + namaKategori;
        }
      } while (uniqueKategoriArtikelNames.has(namaKategori));
      uniqueKategoriArtikelNames.add(namaKategori);

      const kategori = await KategoriArtikel.create({
        nama_kategori: namaKategori,
        deskripsi: faker.lorem.sentence(),
        icon: faker.image.urlLoremFlickr({ category: 'icon' }),
        color: faker.color.rgb(),
        urutan: faker.number.int({ min: 0, max: 100 }),
        is_active: faker.datatype.boolean(),
      });
      kategoriArtikelIds.push(kategori._id);
    }
    console.log(`Seeded ${kategoriArtikelIds.length} KategoriArtikel.`);

    // 7. FAQ (Independent)
    console.log('Seeding FAQ...');
    for (let i = 0; i < NUM_FAQ; i++) {
      const faq = await FAQ.create({
        pertanyaan: faker.lorem.sentence() + '?',
        jawaban: faker.lorem.paragraph(),
        kategori: faker.lorem.word(),
        urutan: faker.number.int({ min: 0, max: 100 }),
        is_active: faker.datatype.boolean(),
        views: faker.number.int({ min: 0, max: 5000 }),
        helpful_count: faker.number.int({ min: 0, max: 100 }),
        not_helpful_count: faker.number.int({ min: 0, max: 50 }),
        tags: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word(), faker.lorem.word()], { min: 0, max: 3 }),
      });
      faqIds.push(faq._id);
    }
    console.log(`Seeded ${faqIds.length} FAQ.`);

    // 8. KategoriObat (Independent)
    console.log('Seeding KategoriObat...');
    const defaultKategoriObat = [
      {
        nama_kategori: 'Analgesik',
        deskripsi: 'Obat pereda nyeri dan demam',
        icon: 'activity',
        color: '#EF4444'
      },
      {
        nama_kategori: 'Antibiotik',
        deskripsi: 'Obat untuk infeksi bakteri',
        icon: 'shield',
        color: '#10B981'
      },
      {
        nama_kategori: 'Vitamin & Suplemen',
        deskripsi: 'Vitamin dan suplemen kesehatan',
        icon: 'plus-circle',
        color: '#F59E0B'
      },
      {
        nama_kategori: 'Obat Pencernaan',
        deskripsi: 'Obat untuk gangguan pencernaan',
        icon: 'circle',
        color: '#8B5CF6'
      },
      {
        nama_kategori: 'Obat Batuk & Pilek',
        deskripsi: 'Obat untuk gangguan pernapasan',
        icon: 'wind',
        color: '#06B6D4'
      }
    ];
    for (const data of defaultKategoriObat) {
      const kategori = await KategoriObat.create(data);
      kategoriObatIds.push(kategori._id);
    }
    const uniqueKategoriObatNames = new Set(defaultKategoriObat.map(k => k.nama_kategori));
    let kategoriObatCounter = 0;
    while (kategoriObatIds.length < NUM_KATEGORI_OBAT) {
      let namaKategori;
      do {
        namaKategori = faker.commerce.productAdjective() + ' Obat';
        if (uniqueKategoriObatNames.has(namaKategori)) {
          namaKategori = `temp_${kategoriObatCounter++}_` + namaKategori;
        }
      } while (uniqueKategoriObatNames.has(namaKategori));
      uniqueKategoriObatNames.add(namaKategori);

      const kategori = await KategoriObat.create({
        nama_kategori: namaKategori,
        deskripsi: faker.lorem.sentence(),
        icon: faker.image.urlLoremFlickr({ category: 'medicine' }),
        color: faker.color.rgb(),
        is_active: faker.datatype.boolean(),
      });
      kategoriObatIds.push(kategori._id);
    }
    console.log(`Seeded ${kategoriObatIds.length} KategoriObat.`);

    // 9. Kurir (Depends on Kota for area_layanan, but can be seeded independently if Kota is already done)
    console.log('Seeding Kurir...');
    const kendaraanOptions = ['motor', 'mobil', 'sepeda'];
    const uniqueKurirEmails = new Set();
    const uniqueKurirPhones = new Set();
    for (let i = 0; i < NUM_KURIR; i++) {
      let email, phone;
      do { email = faker.internet.email(); } while (uniqueKurirEmails.has(email)); uniqueKurirEmails.add(email);
      do { phone = faker.phone.number('+628##########'); } while (uniqueKurirPhones.has(phone)); uniqueKurirPhones.add(phone);

      const kurir = await Kurir.create({
        nama_kurir: faker.person.fullName(),
        no_telepon: phone,
        email: email,
        kendaraan: faker.helpers.arrayElement(kendaraanOptions),
        nomor_plat: faker.vehicle.vrm(),
        foto_profil: faker.image.avatar(),
        foto_kendaraan: faker.image.urlLoremFlickr({ category: 'vehicle' }),
        foto_stnk: faker.image.urlLoremFlickr({ category: 'document' }),
        foto_sim: faker.image.urlLoremFlickr({ category: 'document' }),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
        total_pengiriman: faker.number.int({ min: 0, max: 500 }),
        is_active: faker.datatype.boolean(),
        is_verified: faker.datatype.boolean(),
        is_online: faker.datatype.boolean(),
        area_layanan: faker.helpers.arrayElements(kotaIds, { min: 1, max: 3 }),
        koordinat_lat: faker.location.latitude(),
        koordinat_lng: faker.location.longitude(),
      });
      kurirIds.push(kurir._id);
    }
    console.log(`Seeded ${kurirIds.length} Kurir.`);

    // 10. Obat (Depends on KategoriObat)
    console.log('Seeding Obat...');
    const bentukObatOptions = ['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes', 'gel', 'spray', 'inhaler'];
    const uniqueNomorBpom = new Set();
    for (let i = 0; i < NUM_OBAT; i++) {
      let nomorBpom;
      do { nomorBpom = faker.string.alphanumeric(12).toUpperCase(); } while (uniqueNomorBpom.has(nomorBpom)); uniqueNomorBpom.add(nomorBpom);

      const obat = await Obat.create({
        nama_obat: faker.commerce.productName() + ' ' + faker.helpers.arrayElement(['Forte', 'Plus', 'Kids', 'Extra']),
        nama_generik: faker.commerce.productMaterial(),
        kategori_obat_id: faker.helpers.arrayElement(kategoriObatIds),
        bentuk_obat: faker.helpers.arrayElement(bentukObatOptions),
        kemasan: faker.lorem.word(),
        kandungan: faker.lorem.sentence(),
        deskripsi: faker.lorem.paragraph(),
        indikasi: faker.lorem.sentence(),
        kontraindikasi: faker.lorem.sentence(),
        efek_samping: faker.lorem.sentence(),
        dosis_dewasa: faker.lorem.sentence(),
        dosis_anak: faker.lorem.sentence(),
        cara_pakai: faker.lorem.sentence(),
        cara_penyimpanan: faker.lorem.sentence(),
        peringatan: faker.lorem.sentence(),
        nomor_bpom: nomorBpom,
        produsen: faker.company.name(),
        harga: faker.number.float({ min: 10000, max: 500000, precision: 0.01 }),
        foto_obat: faker.image.urlLoremFlickr({ category: 'pills' }),
        galeri_foto: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        is_resep_dokter: faker.datatype.boolean(),
        is_active: faker.datatype.boolean(),
        tanggal_kadaluarsa: randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 5))),
        barcode: faker.string.alphanumeric(20),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
      });
      obatIds.push(obat._id);
    }
    console.log(`Seeded ${obatIds.length} Obat.`);

    // 11. Pasien (Depends on User, Provinsi, Kota)
    console.log('Seeding Pasien...');
    const pasienUsers = userIds.filter(u => u.role === 'pasien').map(u => u._id);
    const jenisKelaminOptions = ['L', 'P'];
    const golonganDarahOptions = ['A', 'B', 'AB', 'O'];
    const rhesusOptions = ['+', '-'];
    const statusPernikahanOptions = ['single', 'married', 'divorced', 'widowed'];
    const uniqueNoKtp = new Set();
    const uniqueNoBpjs = new Set();

    for (let i = 0; i < Math.min(NUM_PASIEN, pasienUsers.length); i++) {
      let noKtp, noBpjs;
      do { noKtp = faker.string.numeric(16); } while (uniqueNoKtp.has(noKtp)); uniqueNoKtp.add(noKtp);
      do { noBpjs = faker.string.numeric(10); } while (uniqueNoBpjs.has(noBpjs)); uniqueNoBpjs.add(noBpjs);

      const pasien = await Pasien.create({
        user_id: pasienUsers[i],
        nama_lengkap: faker.person.fullName(),
        tanggal_lahir: faker.date.past({ years: 50, refDate: new Date() }),
        jenis_kelamin: faker.helpers.arrayElement(jenisKelaminOptions),
        alamat: faker.location.streetAddress(true),
        no_ktp: noKtp,
        no_bpjs: noBpjs,
        golongan_darah: faker.helpers.arrayElement(golonganDarahOptions),
        rhesus: faker.helpers.arrayElement(rhesusOptions),
        riwayat_alergi: faker.datatype.boolean() ? faker.lorem.words(5) : '',
        riwayat_penyakit: faker.datatype.boolean() ? faker.lorem.words(5) : '',
        kontak_darurat: faker.phone.number('+628##########'),
        nama_kontak_darurat: faker.person.fullName(),
        hubungan_kontak_darurat: faker.helpers.arrayElement(['Saudara', 'Orang Tua', 'Pasangan', 'Teman']),
        foto_profil: faker.image.avatar(),
        berat_badan: faker.number.float({ min: 40, max: 100, precision: 0.01 }),
        tinggi_badan: faker.number.float({ min: 150, max: 190, precision: 0.01 }),
        provinsi_id: faker.helpers.arrayElement(provinsiIds)._id,
        kota_id: faker.helpers.arrayElement(kotaIds),
        pekerjaan: faker.person.jobTitle(),
        status_pernikahan: faker.helpers.arrayElement(statusPernikahanOptions),
        agama: faker.lorem.word(),
      });
      pasienIds.push(pasien._id);
    }
    console.log(`Seeded ${pasienIds.length} Pasien.`);

    // 12. Promo (Independent)
    console.log('Seeding Promo...');
    const tipeDiskonOptions = ['percentage', 'fixed_amount', 'free_shipping', 'buy_one_get_one'];
    const uniqueKodePromo = new Set();
    for (let i = 0; i < NUM_PROMO; i++) {
      let kodePromo;
      do { kodePromo = faker.string.alphanumeric(10).toUpperCase(); } while (uniqueKodePromo.has(kodePromo)); uniqueKodePromo.add(kodePromo);

      const tipeDiskon = faker.helpers.arrayElement(tipeDiskonOptions);
      const nilaiDiskon = tipeDiskon === 'percentage' ? faker.number.float({ min: 5, max: 50, precision: 0.01 }) : faker.number.float({ min: 10000, max: 100000, precision: 0.01 });
      const tanggalMulai = randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1));
      const tanggalBerakhir = randomDate(tanggalMulai, new Date(tanggalMulai.getTime() + (30 * 24 * 60 * 60 * 1000))); // 30 days after start

      const promo = await Promo.create({
        kode_promo: kodePromo,
        nama_promo: faker.commerce.productAdjective() + ' Promo',
        deskripsi: faker.lorem.sentence(),
        tipe_diskon: tipeDiskon,
        nilai_diskon: nilaiDiskon,
        minimum_pembelian: faker.number.float({ min: 0, max: 500000, precision: 0.01 }),
        maksimum_diskon: tipeDiskon === 'percentage' ? faker.number.float({ min: 50000, max: 200000, precision: 0.01 }) : 0.00,
        tanggal_mulai: tanggalMulai,
        tanggal_berakhir: tanggalBerakhir,
        quota_penggunaan: faker.number.int({ min: 100, max: 1000 }),
        sudah_digunakan: faker.number.int({ min: 0, max: 500 }),
        is_active: faker.datatype.boolean(),
        banner_promo: faker.image.urlLoremFlickr({ category: 'promo' }),
        syarat_ketentuan: faker.helpers.arrayElements([faker.lorem.sentence(), faker.lorem.sentence()], { min: 0, max: 2 }),
        target_user: faker.helpers.arrayElements(['pasien', 'doctor', 'all'], { min: 1, max: 2 }),
        kategori_produk: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 2 }),
        is_first_time_only: faker.datatype.boolean(),
      });
      promoIds.push(promo._id);
    }
    console.log(`Seeded ${promoIds.length} Promo.`);

    // 13. RumahSakit (Depends on Provinsi, Kota)
    console.log('Seeding RumahSakit...');
    const tipeRumahSakitOptions = ['pemerintah', 'swasta', 'militer'];
    const kelasRumahSakitOptions = ['A', 'B', 'C', 'D'];
    const uniqueRSEmails = new Set();
    for (let i = 0; i < NUM_RUMAH_SAKIT; i++) {
      let email;
      do { email = faker.internet.email(); } while (uniqueRSEmails.has(email)); uniqueRSEmails.add(email);

      const rumahSakit = await RumahSakit.create({
        nama_rumah_sakit: faker.company.name() + ' Hospital',
        alamat: faker.location.streetAddress(true),
        no_telepon: faker.phone.number('+6221########'),
        email: email,
        website: faker.internet.url(),
        tipe_rumah_sakit: faker.helpers.arrayElement(tipeRumahSakitOptions),
        kelas_rumah_sakit: faker.helpers.arrayElement(kelasRumahSakitOptions),
        koordinat_lat: faker.location.latitude(),
        koordinat_lng: faker.location.longitude(),
        foto_rumah_sakit: faker.image.urlLoremFlickr({ category: 'hospital' }),
        galeri_foto: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        fasilitas: faker.helpers.arrayElements(['IGD', 'Rawat Inap', 'Laboratorium', 'Radiologi'], { min: 1, max: 3 }),
        layanan: faker.helpers.arrayElements(['Bedah', 'Penyakit Dalam', 'Anak', 'Gigi'], { min: 1, max: 3 }),
        is_active: faker.datatype.boolean(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
        provinsi_id: faker.helpers.arrayElement(provinsiIds)._id,
        kota_id: faker.helpers.arrayElement(kotaIds),
      });
      rumahSakitIds.push(rumahSakit._id);
    }
    console.log(`Seeded ${rumahSakitIds.length} RumahSakit.`);

    // 14. Klinik (Depends on Provinsi, Kota)
    console.log('Seeding Klinik...');
    const tipeKlinikOptions = ['pratama', 'utama'];
    const uniqueKlinikEmails = new Set();
    for (let i = 0; i < NUM_KLINIK; i++) {
      let email;
      do { email = faker.internet.email(); } while (uniqueKlinikEmails.has(email)); uniqueKlinikEmails.add(email);

      const klinik = await Klinik.create({
        nama_klinik: `Klinik ${faker.company.name()}`,
        alamat: faker.location.streetAddress(true),
        no_telepon: faker.phone.number('+6221########'),
        email: email,
        jam_buka: randomTime(),
        jam_tutup: randomTime(),
        koordinat_lat: faker.location.latitude(),
        koordinat_lng: faker.location.longitude(),
        foto_klinik: faker.image.urlLoremFlickr({ category: 'clinic' }),
        galeri_foto: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        fasilitas: faker.helpers.arrayElements(['Poli Umum', 'Poli Gigi', 'Farmasi'], { min: 1, max: 3 }),
        layanan: faker.helpers.arrayElements(['Konsultasi', 'Vaksinasi', 'Pemeriksaan'], { min: 1, max: 3 }),
        is_24_jam: faker.datatype.boolean(),
        is_active: faker.datatype.boolean(),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
        tipe_klinik: faker.helpers.arrayElement(tipeKlinikOptions),
        provinsi_id: faker.helpers.arrayElement(provinsiIds)._id,
        kota_id: faker.helpers.arrayElement(kotaIds),
      });
      klinikIds.push(klinik._id);
    }
    console.log(`Seeded ${klinikIds.length} Klinik.`);

    // 15. Spesialisasi (Independent)
    console.log('Seeding Spesialisasi...');
    const defaultSpesialisasi = [
      {
        nama_spesialisasi: 'Dokter Umum',
        deskripsi: 'Praktisi medis umum untuk berbagai kondisi kesehatan',
        icon: 'user-md',
        color: '#3B82F6'
      },
      {
        nama_spesialisasi: 'Spesialis Anak',
        deskripsi: 'Spesialis kesehatan anak dan remaja',
        icon: 'baby',
        color: '#F59E0B'
      },
      {
        nama_spesialisasi: 'Spesialis Penyakit Dalam',
        deskripsi: 'Spesialis penyakit dalam dan metabolisme',
        icon: 'heart',
        color: '#EF4444'
      },
      {
        nama_spesialisasi: 'Spesialis Kulit dan Kelamin',
        deskripsi: 'Spesialis dermatologi dan venereologi',
        icon: 'eye',
        color: '#10B981'
      },
      {
        nama_spesialisasi: 'Spesialis Mata',
        deskripsi: 'Spesialis oftalmologi dan kesehatan mata',
        icon: 'eye',
        color: '#8B5CF6'
      },
      {
        nama_spesialisasi: 'Spesialis THT',
        deskripsi: 'Spesialis telinga, hidung, dan tenggorokan',
        icon: 'ear',
        color: '#EC4899'
      },
      {
        nama_spesialisasi: 'Spesialis Kandungan',
        deskripsi: 'Spesialis obstetri dan ginekologi',
        icon: 'user-plus',
        color: '#F97316'
      }
    ];
    for (const data of defaultSpesialisasi) {
      const spesialisasi = await Spesialisasi.create(data);
      spesialisasiIds.push(spesialisasi._id);
    }
    const uniqueSpesialisasiNames = new Set(defaultSpesialisasi.map(s => s.nama_spesialisasi));
    let spesialisasiCounter = 0;
    while (spesialisasiIds.length < NUM_SPESIALISASI) {
      let namaSpesialisasi;
      do {
        namaSpesialisasi = faker.lorem.word() + ' Spesialisasi';
        if (uniqueSpesialisasiNames.has(namaSpesialisasi)) {
          namaSpesialisasi = `temp_${spesialisasiCounter++}_` + namaSpesialisasi;
        }
      } while (uniqueSpesialisasiNames.has(namaSpesialisasi));
      uniqueSpesialisasiNames.add(namaSpesialisasi);

      const spesialisasi = await Spesialisasi.create({
        nama_spesialisasi: namaSpesialisasi,
        deskripsi: faker.lorem.sentence(),
        icon: faker.image.urlLoremFlickr({ category: 'medical_icon' }),
        color: faker.color.rgb(),
        is_active: faker.datatype.boolean(),
      });
      spesialisasiIds.push(spesialisasi._id);
    }
    console.log(`Seeded ${spesialisasiIds.length} Spesialisasi.`);

    // 16. Doctor (Depends on User, Spesialisasi, RumahSakit, Klinik)
    console.log('Seeding Doctor...');
    const doctorUsers = userIds.filter(u => u.role === 'doctor').map(u => u._id);
    const uniqueNoSip = new Set();
    const uniqueNoStr = new Set();
    const metodeKonsultasiOptions = ['chat', 'video_call', 'voice_call'];

    for (let i = 0; i < Math.min(NUM_DOCTORS, doctorUsers.length); i++) {
      let noSip, noStr;
      do { noSip = faker.string.alphanumeric(15).toUpperCase(); } while (uniqueNoSip.has(noSip)); uniqueNoSip.add(noSip);
      do { noStr = faker.string.alphanumeric(15).toUpperCase(); } while (uniqueNoStr.has(noStr)); uniqueNoStr.add(noStr);

      const doctor = await Doctor.create({
        user_id: doctorUsers[i],
        nama_lengkap: faker.person.fullName(),
        no_sip: noSip,
        spesialisasi_id: faker.helpers.arrayElement(spesialisasiIds),
        pengalaman_tahun: faker.number.int({ min: 1, max: 30 }),
        tarif_konsultasi: faker.number.float({ min: 50000, max: 500000, precision: 0.01 }),
        rumah_sakit_id: faker.helpers.arrayElement(rumahSakitIds),
        klinik_id: faker.helpers.arrayElement(klinikIds),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
        total_reviews: faker.number.int({ min: 0, max: 100 }),
        total_konsultasi: faker.number.int({ min: 0, max: 1000 }),
        total_pasien: faker.number.int({ min: 0, max: 500 }),
        is_verified: faker.datatype.boolean(),
        is_available: faker.datatype.boolean(),
        foto_profil: faker.image.avatar(),
        alumnus: faker.company.name(),
        bio: faker.lorem.paragraph(),
        sertifikasi: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 2 }),
        jadwal_praktek: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word()], { min: 0, max: 2 }),
        metode_konsultasi: faker.helpers.arrayElements(metodeKonsultasiOptions, { min: 1, max: 3 }),
        tanggal_lahir: faker.date.past({ years: 50, refDate: new Date() }),
        jenis_kelamin: faker.helpers.arrayElement(['L', 'P']),
        alamat: faker.location.streetAddress(true),
        no_str: noStr,
      });
      doctorIds.push(doctor._id);
    }
    console.log(`Seeded ${doctorIds.length} Doctor.`);

    // 17. ArtikelKesehatan (Depends on KategoriArtikel, User for penulis_id)
    console.log('Seeding ArtikelKesehatan...');
    const penulisUsers = userIds.map(u => u._id);
    const uniqueSlugs = new Set();
    for (let i = 0; i < NUM_ARTIKEL_KESEHATAN; i++) {
      const judul = faker.lorem.sentence();
      let slug;
      do { slug = faker.helpers.slugify(judul).toLowerCase(); } while (uniqueSlugs.has(slug)); uniqueSlugs.add(slug);

      const artikel = await ArtikelKesehatan.create({
        judul: judul,
        slug: slug,
        ringkasan: faker.lorem.sentence(),
        konten: faker.lorem.paragraphs(5),
        kategori_artikel_id: faker.helpers.arrayElement(kategoriArtikelIds),
        penulis_id: faker.helpers.arrayElement(penulisUsers),
        penulis: faker.person.fullName(),
        gambar_utama: faker.image.urlLoremFlickr({ category: 'health' }),
        galeri_gambar: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        tags: faker.helpers.arrayElements([faker.lorem.word(), faker.lorem.word(), faker.lorem.word()], { min: 0, max: 3 }),
        meta_description: faker.lorem.sentence(),
        meta_keywords: faker.lorem.words(5),
        views: faker.number.int({ min: 0, max: 10000 }),
        likes: faker.number.int({ min: 0, max: 1000 }),
        shares: faker.number.int({ min: 0, max: 500 }),
        waktu_baca: faker.number.int({ min: 1, max: 10 }),
        is_featured: faker.datatype.boolean(),
        is_published: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(['draft', 'review', 'published', 'archived']),
        tanggal_publish: randomDate(new Date(2023, 0, 1), new Date()),
      });
      artikelKesehatanIds.push(artikel._id);
    }
    console.log(`Seeded ${artikelKesehatanIds.length} ArtikelKesehatan.`);

    // 18. Konsultasi (Depends on Pasien, Doctor)
    console.log('Seeding Konsultasi...');
    const statusKonsultasiOptions = ['pending', 'ongoing', 'waiting_payment', 'completed', 'cancelled'];
    const jenisKonsultasiOptions = ['chat', 'video_call', 'voice_call'];
    const uniqueKodeKonsultasi = new Set();
    for (let i = 0; i < NUM_KONSULTASI; i++) {
      let kodeKonsultasi;
      do { kodeKonsultasi = faker.string.alphanumeric(10).toUpperCase(); } while (uniqueKodeKonsultasi.has(kodeKonsultasi)); uniqueKodeKonsultasi.add(kodeKonsultasi);

      const pasienId = faker.helpers.arrayElement(pasienIds);
      const doctorId = faker.helpers.arrayElement(doctorIds);
      const tanggalKonsultasi = randomDate(new Date(2024, 0, 1), new Date());
      const status = faker.helpers.arrayElement(statusKonsultasiOptions);

      const konsultasi = await Konsultasi.create({
        pasien_id: pasienId,
        doctor_id: doctorId,
        kode_konsultasi: kodeKonsultasi,
        keluhan_utama: faker.lorem.sentence(),
        riwayat_penyakit: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        gejala: faker.lorem.words(5),
        tanggal_konsultasi: tanggalKonsultasi,
        tanggal_selesai: status === 'completed' ? randomDate(tanggalKonsultasi, new Date()) : new Date(0),
        anamnesis: status === 'completed' ? faker.lorem.paragraph() : '',
        diagnosa: status === 'completed' ? faker.lorem.sentence() : '',
        tindakan: status === 'completed' ? faker.lorem.sentence() : '',
        catatan_dokter: status === 'completed' ? faker.lorem.paragraph() : '',
        saran_dokter: status === 'completed' ? faker.lorem.sentence() : '',
        status: status,
        jenis_konsultasi: faker.helpers.arrayElement(jenisKonsultasiOptions),
        durasi_konsultasi: status === 'completed' ? faker.number.int({ min: 5, max: 60 }) : 0,
        biaya: faker.number.float({ min: 50000, max: 500000, precision: 0.01 }),
        biaya_admin: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
        total_biaya: faker.number.float({ min: 50000, max: 510000, precision: 0.01 }),
        rating_pasien: status === 'completed' ? faker.number.int({ min: 1, max: 5 }) : 0,
        review_pasien: status === 'completed' && faker.datatype.boolean() ? faker.lorem.sentence() : '',
        rating_dokter: status === 'completed' ? faker.number.int({ min: 1, max: 5 }) : 0,
        review_dokter: status === 'completed' && faker.datatype.boolean() ? faker.lorem.sentence() : '',
        is_emergency: faker.datatype.boolean(),
        vital_signs: faker.datatype.boolean() ? { blood_pressure: '120/80', temperature: '36.5' } : {},
        attachments: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
      });
      konsultasiIds.push(konsultasi._id);
    }
    console.log(`Seeded ${konsultasiIds.length} Konsultasi.`);

    // 19. Resep (Depends on Konsultasi, Doctor, Pasien, Apotek)
    console.log('Seeding Resep...');
    const statusResepOptions = ['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled'];
    const jenisResepOptions = ['tunai', 'bpjs', 'asuransi'];
    const uniqueKodeResep = new Set();
    const availableKonsultasiIds = [...konsultasiIds]; // Create a mutable copy

    for (let i = 0; i < NUM_RESEP; i++) {
      if (availableKonsultasiIds.length === 0) {
        console.warn('Not enough konsultasi to create unique resep. Stopping resep seeding.');
        break;
      }

      let kodeResep;
      do { kodeResep = faker.string.alphanumeric(10).toUpperCase(); } while (uniqueKodeResep.has(kodeResep)); uniqueKodeResep.add(kodeResep);

      const konsultasiIndex = faker.number.int({ min: 0, max: availableKonsultasiIds.length - 1 });
      const konsultasiId = availableKonsultasiIds.splice(konsultasiIndex, 1)[0]; // Use and remove

      const doctorId = faker.helpers.arrayElement(doctorIds);
      const pasienId = faker.helpers.arrayElement(pasienIds);
      const apotekId = faker.helpers.arrayElement(apotekIds);
      const tanggalResep = randomDate(new Date(2024, 0, 1), new Date());
      const tanggalKadaluarsa = randomDate(tanggalResep, new Date(tanggalResep.getTime() + (7 * 24 * 60 * 60 * 1000))); // 7 days after resep

      const resep = await Resep.create({
        konsultasi_id: konsultasiId,
        doctor_id: doctorId,
        pasien_id: pasienId,
        apotek_id: apotekId,
        kode_resep: kodeResep,
        tanggal_resep: tanggalResep,
        tanggal_kadaluarsa: tanggalKadaluarsa,
        catatan_resep: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        aturan_umum: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        status: faker.helpers.arrayElement(statusResepOptions),
        jenis_resep: faker.helpers.arrayElement(jenisResepOptions),
        total_harga: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
        biaya_pengiriman: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
        biaya_admin: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
        total_bayar: faker.number.float({ min: 10000, max: 1050000, precision: 0.01 }),
        is_urgent: faker.datatype.boolean(),
        alamat_pengiriman: faker.location.streetAddress(true),
        koordinat_pengiriman: { lat: faker.location.latitude(), lng: faker.location.longitude() },
      });
      resepIds.push(resep._id);
    }
    console.log(`Seeded ${resepIds.length} Resep.`);

    // 20. Pembayaran (Depends on Konsultasi, Resep, Pasien)
    console.log('Seeding Pembayaran...');
    const jenisPembayaranOptions = ['konsultasi', 'obat', 'keduanya'];
    const metodePembayaranOptions = ['transfer', 'ewallet', 'va', 'kartu_kredit', 'qris', 'cod'];
    const statusPembayaranOptions = ['pending', 'processing', 'success', 'failed', 'refunded', 'expired'];
    const uniqueKodePembayaran = new Set();

    for (let i = 0; i < NUM_PEMBAYARAN; i++) {
      let kodePembayaran;
      do { kodePembayaran = faker.string.alphanumeric(15).toUpperCase(); } while (uniqueKodePembayaran.has(kodePembayaran)); uniqueKodePembayaran.add(kodePembayaran);

      const pasienId = faker.helpers.arrayElement(pasienIds);
      const jenisPembayaran = faker.helpers.arrayElement(jenisPembayaranOptions);
      const konsultasiId = jenisPembayaran === 'konsultasi' || jenisPembayaran === 'keduanya' ? faker.helpers.arrayElement(konsultasiIds) : faker.helpers.arrayElement(konsultasiIds); // Ensure it's always a valid ID
      const resepId = jenisPembayaran === 'obat' || jenisPembayaran === 'keduanya' ? faker.helpers.arrayElement(resepIds) : faker.helpers.arrayElement(resepIds); // Ensure it's always a valid ID
      const jumlahBayar = faker.number.float({ min: 50000, max: 1500000, precision: 0.01 });
      const biayaAdmin = faker.number.float({ min: 0, max: 10000, precision: 0.01 });
      const diskon = faker.number.float({ min: 0, max: 50000, precision: 0.01 });
      const totalBayar = jumlahBayar + biayaAdmin - diskon;
      const tanggalPembayaran = randomDate(new Date(2024, 0, 1), new Date());
      const tanggalKadaluarsa = randomDate(tanggalPembayaran, new Date(tanggalPembayaran.getTime() + (1 * 24 * 60 * 60 * 1000))); // 1 day after payment
      const status = faker.helpers.arrayElement(statusPembayaranOptions);

      const pembayaran = await Pembayaran.create({
        konsultasi_id: konsultasiId,
        resep_id: resepId,
        pasien_id: pasienId,
        kode_pembayaran: kodePembayaran,
        jenis_pembayaran: jenisPembayaran,
        jumlah_bayar: jumlahBayar,
        biaya_admin: biayaAdmin,
        diskon: diskon,
        total_bayar: totalBayar,
        metode_pembayaran: faker.helpers.arrayElement(metodePembayaranOptions),
        provider_pembayaran: faker.company.name(),
        status_pembayaran: status,
        tanggal_pembayaran: tanggalPembayaran,
        tanggal_kadaluarsa: tanggalKadaluarsa,
        tanggal_berhasil: status === 'success' ? randomDate(tanggalPembayaran, new Date()) : new Date(0),
        payment_gateway_id: faker.string.uuid(),
        payment_gateway_response: faker.lorem.sentence(),
        virtual_account: faker.string.numeric(16),
        qr_code: faker.image.url(),
        bukti_pembayaran: faker.image.urlLoremFlickr({ category: 'receipt' }),
        catatan_pembayaran: faker.lorem.sentence(),
        fee_payment_gateway: faker.number.float({ min: 0, max: 5000, precision: 0.01 }),
      });
      pembayaranIds.push(pembayaran._id);
    }
    console.log(`Seeded ${pembayaranIds.length} Pembayaran.`);

    // 21. UserPromo (Depends on User, Promo, Pembayaran)
    console.log('Seeding UserPromo...');
    for (let i = 0; i < NUM_USER_PROMO; i++) {
      const userId = faker.helpers.arrayElement(userIds.map(u => u._id));
      const promoId = faker.helpers.arrayElement(promoIds);
      const pembayaranId = faker.helpers.arrayElement(pembayaranIds);

      // Ensure unique combination for user_id, promo_id, pembayaran_id
      let userPromoExists = true;
      let attempts = 0;
      while (userPromoExists && attempts < 10) {
        try {
          const existingUserPromo = await UserPromo.findOne({ user_id: userId, promo_id: promoId, pembayaran_id: pembayaranId });
          if (!existingUserPromo) {
            userPromoExists = false;
          } else {
            // Try different IDs if combination already exists
            promoId = faker.helpers.arrayElement(promoIds);
            pembayaranId = faker.helpers.arrayElement(pembayaranIds);
            attempts++;
          }
        } catch (error) {
          console.error('Error checking existing user promo:', error.message);
          userPromoExists = false; // Break loop on error
        }
      }

      if (!userPromoExists) {
        const userPromo = await UserPromo.create({
          user_id: userId,
          promo_id: promoId,
          pembayaran_id: pembayaranId,
          tanggal_digunakan: randomDate(new Date(2024, 0, 1), new Date()),
          nilai_diskon_diterima: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
          status: faker.helpers.arrayElement(['used', 'expired', 'cancelled']),
        });
        userPromoIds.push(userPromo._id);
      }
    }
    console.log(`Seeded ${userPromoIds.length} UserPromo.`);

    // 22. StokObat (Depends on Obat, Apotek)
    console.log('Seeding StokObat...');
    const uniqueStokObatCombinations = new Set();
    for (let i = 0; i < NUM_STOK_OBAT_PER_APOTEK_OBAT * apotekIds.length * obatIds.length; i++) {
      const obatId = faker.helpers.arrayElement(obatIds);
      const apotekId = faker.helpers.arrayElement(apotekIds);
      const batchNumber = faker.string.alphanumeric(10).toUpperCase();
      const combinationKey = `${obatId}-${apotekId}-${batchNumber}`;

      if (!uniqueStokObatCombinations.has(combinationKey)) {
        uniqueStokObatCombinations.add(combinationKey);
        const tanggalKadaluarsa = randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 5)));

        const stokObat = await StokObat.create({
          obat_id: obatId,
          apotek_id: apotekId,
          jumlah_stok: faker.number.int({ min: 0, max: 1000 }),
          stok_minimum: faker.number.int({ min: 0, max: 100 }),
          stok_reserved: faker.number.int({ min: 0, max: 50 }),
          tanggal_kadaluarsa: tanggalKadaluarsa,
          harga_beli: faker.number.float({ min: 5000, max: 100000, precision: 0.01 }),
          harga_jual: faker.number.float({ min: 10000, max: 500000, precision: 0.01 }),
          margin_profit: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
          batch_number: batchNumber,
          is_available: faker.datatype.boolean(),
          last_updated: new Date(),
        });
        stokObatIds.push(stokObat._id);
      }
    }
    console.log(`Seeded ${stokObatIds.length} StokObat.`);

    // 23. Pengiriman (Depends on Resep, Kurir)
    console.log('Seeding Pengiriman...');
    const statusPengirimanOptions = ['pending', 'assigned', 'picked_up', 'on_delivery', 'delivered', 'returned', 'cancelled'];
    const availableResepIds = [...resepIds]; // Create a mutable copy

    for (let i = 0; i < NUM_PENGIRIMAN; i++) {
      if (availableResepIds.length === 0) {
        console.warn('Not enough resep to create unique pengiriman. Stopping pengiriman seeding.');
        break;
      }

      const resepIndex = faker.number.int({ min: 0, max: availableResepIds.length - 1 });
      const resepId = availableResepIds.splice(resepIndex, 1)[0]; // Use and remove

      const kurirId = faker.helpers.arrayElement(kurirIds);
      const tanggalKirim = randomDate(new Date(2024, 0, 1), new Date());
      const estimasiTiba = randomDate(tanggalKirim, new Date(tanggalKirim.getTime() + (2 * 24 * 60 * 60 * 1000))); // 2 days after kirim
      const tanggalTerima = faker.datatype.boolean() ? randomDate(estimasiTiba, new Date()) : new Date(0);

      const pengiriman = await Pengiriman.create({
        resep_id: resepId,
        kurir_id: kurirId,
        alamat_pengiriman: faker.location.streetAddress(true),
        koordinat_lat: faker.location.latitude(),
        koordinat_lng: faker.location.longitude(),
        nama_penerima: faker.person.fullName(),
        no_telepon_penerima: faker.phone.number('+628##########'),
        tanggal_kirim: tanggalKirim,
        estimasi_tiba: estimasiTiba,
        tanggal_terima: tanggalTerima,
        status_pengiriman: faker.helpers.arrayElement(statusPengirimanOptions),
        catatan_pengiriman: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        catatan_kurir: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        foto_bukti_terima: faker.image.urlLoremFlickr({ category: 'delivery' }),
        biaya_pengiriman: faker.number.float({ min: 10000, max: 50000, precision: 0.01 }),
        jarak_km: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
        tracking_history: faker.helpers.arrayElements([{}, {}], { min: 0, max: 2 }),
        no_resi: faker.string.alphanumeric(15).toUpperCase(),
      });
      pengirimanIds.push(pengiriman._id);
    }
    console.log(`Seeded ${pengirimanIds.length} Pengiriman.`);

    // 24. DetailResep (Depends on Resep, Obat)
    console.log('Seeding DetailResep...');
    for (const resepId of resepIds) {
      const numItems = faker.number.int({ min: 1, max: NUM_DETAIL_RESEP_PER_RESEP });
      for (let j = 0; j < numItems; j++) {
        const obatId = faker.helpers.arrayElement(obatIds);
        const jumlah = faker.number.int({ min: 1, max: 10 });
        const hargaSatuan = faker.number.float({ min: 5000, max: 200000, precision: 0.01 });
        const subtotal = jumlah * hargaSatuan;

        const detailResep = await DetailResep.create({
          resep_id: resepId,
          obat_id: obatId,
          dosis: faker.lorem.words(2),
          jumlah: jumlah,
          aturan_pakai: faker.lorem.sentence(),
          catatan_khusus: faker.datatype.boolean() ? faker.lorem.sentence() : '',
          harga_satuan: hargaSatuan,
          subtotal: subtotal,
          is_tersedia: faker.datatype.boolean(),
          alasan_tidak_tersedia: faker.datatype.boolean() ? faker.lorem.sentence() : '',
          obat_pengganti_id: faker.helpers.arrayElement(obatIds), // Always provide a valid ID
        });
        detailResepIds.push(detailResep._id);
      }
    }
    console.log(`Seeded ${detailResepIds.length} DetailResep.`);

    // 25. MedicalRecord (Depends on Pasien, Konsultasi, Doctor)
    console.log('Seeding MedicalRecord...');
    for (let i = 0; i < NUM_MEDICAL_RECORD; i++) {
      const pasienId = faker.helpers.arrayElement(pasienIds);
      const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
      const doctorId = faker.helpers.arrayElement(doctorIds);

      const medicalRecord = await MedicalRecord.create({
        pasien_id: pasienId,
        konsultasi_id: konsultasiId,
        doctor_id: doctorId,
        tanggal_rekam: randomDate(new Date(2023, 0, 1), new Date()),
        keluhan_utama: faker.lorem.sentence(),
        anamnesis: faker.lorem.paragraph(),
        pemeriksaan_fisik: faker.lorem.paragraph(),
        pemeriksaan_penunjang: faker.datatype.boolean() ? faker.lorem.paragraph() : '',
        diagnosa_utama: faker.lorem.sentence(),
        diagnosa_sekunder: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        terapi: faker.lorem.paragraph(),
        prognosis: faker.lorem.sentence(),
        follow_up: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        catatan_tambahan: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        file_pendukung: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        is_confidential: faker.datatype.boolean(),
      });
      medicalRecordIds.push(medicalRecord._id);
    }
    console.log(`Seeded ${medicalRecordIds.length} MedicalRecord.`);

    // 26. VitalSigns (Depends on Pasien, Konsultasi, MedicalRecord)
    console.log('Seeding VitalSigns...');
    const kondisiUmumOptions = ['baik', 'sedang', 'buruk'];
    for (let i = 0; i < NUM_VITAL_SIGNS; i++) {
      const pasienId = faker.helpers.arrayElement(pasienIds);
      const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
      const medicalRecordId = faker.helpers.arrayElement(medicalRecordIds);
      const bb = faker.number.float({ min: 40, max: 100, precision: 0.01 });
      const tb = faker.number.float({ min: 150, max: 190, precision: 0.01 });
      const bmi = bb / ((tb / 100) * (tb / 100));

      const vitalSigns = await VitalSigns.create({
        pasien_id: pasienId,
        konsultasi_id: konsultasiId,
        medical_record_id: medicalRecordId,
        tanggal_periksa: randomDate(new Date(2023, 0, 1), new Date()),
        tekanan_darah_sistolik: faker.number.int({ min: 90, max: 180 }),
        tekanan_darah_diastolik: faker.number.int({ min: 60, max: 120 }),
        denyut_nadi: faker.number.int({ min: 60, max: 100 }),
        suhu_tubuh: faker.number.float({ min: 36.0, max: 39.0, precision: 0.01 }),
        respiratory_rate: faker.number.int({ min: 12, max: 20 }),
        berat_badan: bb,
        tinggi_badan: tb,
        bmi: parseFloat(bmi.toFixed(2)),
        saturasi_oksigen: faker.number.float({ min: 95.0, max: 100.0, precision: 0.01 }),
        gula_darah: faker.number.float({ min: 70, max: 200, precision: 0.01 }),
        kolesterol: faker.number.float({ min: 150, max: 250, precision: 0.01 }),
        asam_urat: faker.number.float({ min: 2, max: 10, precision: 0.01 }),
        catatan: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        kondisi_umum: faker.helpers.arrayElement(kondisiUmumOptions),
      });
      vitalSignsIds.push(vitalSigns._id);
    }
    console.log(`Seeded ${vitalSignsIds.length} VitalSigns.`);

    // 27. Notifikasi (Depends on User)
    console.log('Seeding Notifikasi...');
    const tipeNotifikasiOptions = ['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo', 'reminder', 'appointment'];
    const priorityOptions = ['low', 'medium', 'high', 'urgent'];
    for (let i = 0; i < NUM_NOTIFIKASI; i++) {
      const userId = faker.helpers.arrayElement(userIds.map(u => u._id));

      const notifikasi = await Notifikasi.create({
        user_id: userId,
        judul: faker.lorem.sentence(3),
        isi: faker.lorem.paragraph(),
        tipe: faker.helpers.arrayElement(tipeNotifikasiOptions),
        priority: faker.helpers.arrayElement(priorityOptions),
        data_payload: { id: faker.string.uuid(), type: faker.lorem.word() },
        is_read: faker.datatype.boolean(),
        is_push: faker.datatype.boolean(),
        is_email: faker.datatype.boolean(),
        is_sms: faker.datatype.boolean(),
        scheduled_at: randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)),
        sent_at: randomDate(new Date(2024, 0, 1), new Date()),
      });
      notifikasiIds.push(notifikasi._id);
    }
    console.log(`Seeded ${notifikasiIds.length} Notifikasi.`);

    // 28. ReviewRating (Depends on Konsultasi, User)
    console.log('Seeding ReviewRating...');
    const reviewTypeOptions = ['doctor', 'apotek', 'kurir', 'aplikasi', 'klinik', 'rumah_sakit'];
    for (let i = 0; i < NUM_REVIEW_RATING; i++) {
      const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
      const reviewerId = faker.helpers.arrayElement(userIds.map(u => u._id));
      const reviewedId = faker.helpers.arrayElement(userIds.map(u => u._id));

      const reviewRating = await ReviewRating.create({
        konsultasi_id: konsultasiId,
        reviewer_id: reviewerId,
        reviewed_id: reviewedId,
        rating: faker.number.int({ min: 1, max: 5 }),
        review_text: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        review_type: faker.helpers.arrayElement(reviewTypeOptions),
        is_anonymous: faker.datatype.boolean(),
        is_approved: faker.datatype.boolean(),
        rating_aspects: { punctuality: faker.number.int({ min: 1, max: 5 }), friendliness: faker.number.int({ min: 1, max: 5 }) },
        response_from_reviewed: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        response_date: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
      });
      reviewRatingIds.push(reviewRating._id);
    }
    console.log(`Seeded ${reviewRatingIds.length} ReviewRating.`);

    // 29. Feedback (Depends on User)
    console.log('Seeding Feedback...');
    const tipeFeedbackOptions = ['bug', 'suggestion', 'complaint', 'praise', 'feature_request'];
    const statusFeedbackOptions = ['open', 'in_progress', 'resolved', 'closed', 'duplicate'];
    const feedbackPriorityOptions = ['low', 'medium', 'high', 'urgent'];
    const assignedToUsers = userIds.filter(u => u.role === 'admin' || u.role === 'doctor').map(u => u._id);

    for (let i = 0; i < NUM_FEEDBACK; i++) {
      const userId = faker.helpers.arrayElement(userIds.map(u => u._id));

      const feedback = await Feedback.create({
        user_id: userId,
        tipe_feedback: faker.helpers.arrayElement(tipeFeedbackOptions),
        judul: faker.lorem.sentence(4),
        deskripsi: faker.lorem.paragraph(),
        screenshots: faker.helpers.arrayElements([faker.image.url(), faker.image.url()], { min: 0, max: 2 }),
        device_info: faker.lorem.word(),
        app_version: faker.system.semver(),
        os_version: faker.system.semver(),
        status: faker.helpers.arrayElement(statusFeedbackOptions),
        priority: faker.helpers.arrayElement(feedbackPriorityOptions),
        admin_response: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        assigned_to: faker.helpers.arrayElement(assignedToUsers),
        resolved_at: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
      });
      feedbackIds.push(feedback._id);
    }
    console.log(`Seeded ${feedbackIds.length} Feedback.`);

    // 30. ChatMessage (Depends on Konsultasi, User)
    console.log('Seeding ChatMessage...');
    const messageTypeOptions = ['text', 'image', 'file', 'voice', 'video', 'prescription', 'location'];
    for (let i = 0; i < NUM_CHAT_MESSAGES; i++) {
      const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
      const senderId = faker.helpers.arrayElement(userIds.map(u => u._id));
      const messageType = faker.helpers.arrayElement(messageTypeOptions);

      const chatMessage = await ChatMessage.create({
        konsultasi_id: konsultasiId,
        sender_id: senderId,
        message_text: messageType === 'text' ? faker.lorem.sentence() : '',
        message_type: messageType,
        file_path: messageType !== 'text' ? faker.internet.url() : '',
        file_name: messageType !== 'text' ? faker.system.fileName() : '',
        file_size: messageType !== 'text' ? faker.number.int({ min: 100, max: 5000000 }) : 0,
        mime_type: messageType !== 'text' ? faker.system.mimeType() : '',
        duration: messageType === 'voice' || messageType === 'video' ? faker.number.int({ min: 5, max: 300 }) : 0,
        timestamp: randomDate(new Date(2024, 0, 1), new Date()),
        is_read: faker.datatype.boolean(),
        is_edited: faker.datatype.boolean(),
        is_deleted: faker.datatype.boolean(),
        reply_to_message_id: faker.helpers.arrayElement(chatMessageIds.length > 0 ? chatMessageIds : [new mongoose.Types.ObjectId()]), // Ensure valid ID or placeholder
        metadata: faker.datatype.boolean() ? { lat: faker.location.latitude(), lng: faker.location.longitude() } : {},
        edited_at: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
        deleted_at: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
      });
      chatMessageIds.push(chatMessage._id);
    }
    console.log(`Seeded ${chatMessageIds.length} ChatMessage.`);

    // 31. JadwalDoctor (Depends on Doctor)
    console.log('Seeding JadwalDoctor...');
    const hariOptions = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const uniqueJadwalCombinations = new Set();
    for (let i = 0; i < NUM_JADWAL_DOCTOR; i++) {
      const doctorId = faker.helpers.arrayElement(doctorIds);
      const hari = faker.helpers.arrayElement(hariOptions);
      const jamMulai = randomTime();
      const tanggalKhusus = faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)) : new Date(0);
      const combinationKey = `${doctorId}-${hari}-${jamMulai}-${tanggalKhusus.toISOString()}`;

      if (!uniqueJadwalCombinations.has(combinationKey)) {
        uniqueJadwalCombinations.add(combinationKey);
        const jamSelesai = randomTime();

        const jadwalDoctor = await JadwalDoctor.create({
          doctor_id: doctorId,
          hari: hari,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
          quota_pasien: faker.number.int({ min: 1, max: 20 }),
          durasi_konsultasi: faker.number.int({ min: 15, max: 60 }),
          is_available: faker.datatype.boolean(),
          catatan: faker.datatype.boolean() ? faker.lorem.sentence() : '',
          tipe_jadwal: faker.helpers.arrayElement(['reguler', 'khusus', 'emergency']),
          tanggal_khusus: tanggalKhusus,
        });
        jadwalDoctorIds.push(jadwalDoctor._id);
      }
    }
    console.log(`Seeded ${jadwalDoctorIds.length} JadwalDoctor.`);

    // 32. Appointment (Depends on Pasien, Doctor, self-referencing)
    console.log('Seeding Appointment...');
    const statusAppointmentOptions = ['scheduled', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'];
    const jenisAppointmentOptions = ['konsultasi', 'follow_up', 'emergency'];
    const uniqueKodeAppointment = new Set();

    for (let i = 0; i < NUM_APPOINTMENT; i++) {
      let kodeAppointment;
      do { kodeAppointment = faker.string.alphanumeric(10).toUpperCase(); } while (uniqueKodeAppointment.has(kodeAppointment)); uniqueKodeAppointment.add(kodeAppointment);

      const pasienId = faker.helpers.arrayElement(pasienIds);
      const doctorId = faker.helpers.arrayElement(doctorIds);
      const tanggalAppointment = randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1));
      const jamAppointment = randomTime();
      const status = faker.helpers.arrayElement(statusAppointmentOptions);

      const appointment = await Appointment.create({
        pasien_id: pasienId,
        doctor_id: doctorId,
        kode_appointment: kodeAppointment,
        tanggal_appointment: tanggalAppointment,
        jam_appointment: jamAppointment,
        estimasi_selesai: randomDate(tanggalAppointment, new Date(tanggalAppointment.getTime() + (2 * 60 * 60 * 1000))), // 2 hours after start
        keluhan: faker.lorem.sentence(),
        catatan_pasien: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        status: status,
        jenis_appointment: faker.helpers.arrayElement(jenisAppointmentOptions),
        reminder_sent: faker.datatype.boolean(),
        reminder_sent_at: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : new Date(0),
        alasan_batal: faker.datatype.boolean() ? faker.lorem.sentence() : '',
        rescheduled_from: faker.helpers.arrayElement(appointmentIds.length > 0 ? appointmentIds : [new mongoose.Types.ObjectId()]), // Ensure valid ID or placeholder
        rescheduled_to: faker.helpers.arrayElement(appointmentIds.length > 0 ? appointmentIds : [new mongoose.Types.ObjectId()]), // Ensure valid ID or placeholder
      });
      appointmentIds.push(appointment._id);
    }
    console.log(`Seeded ${appointmentIds.length} Appointment.`);

    // 33. ChatSession (Depends on Konsultasi, User)
    console.log('Seeding ChatSession...');
    const availableKonsultasiIdsForChat = [...konsultasiIds]; // Create a mutable copy

    for (let i = 0; i < NUM_CHAT_SESSIONS; i++) {
      if (availableKonsultasiIdsForChat.length === 0) {
        console.warn('Not enough konsultasi to create unique chat sessions. Stopping chat session seeding.');
        break;
      }

      const konsultasiIndex = faker.number.int({ min: 0, max: availableKonsultasiIdsForChat.length - 1 });
      const konsultasiId = availableKonsultasiIdsForChat.splice(konsultasiIndex, 1)[0]; // Use and remove

      const sessionStart = randomDate(new Date(2024, 0, 1), new Date());
      const sessionEnd = faker.datatype.boolean() ? randomDate(sessionStart, new Date()) : new Date(0);
      const lastMessageBy = faker.helpers.arrayElement(userIds.map(u => u._id));

      const chatSession = await ChatSession.create({
        konsultasi_id: konsultasiId,
        session_start: sessionStart,
        session_end: sessionEnd,
        is_active: faker.datatype.boolean(),
        total_messages: faker.number.int({ min: 0, max: 100 }),
        unread_doctor: faker.number.int({ min: 0, max: 10 }),
        unread_patient: faker.number.int({ min: 0, max: 10 }),
        last_message_at: faker.datatype.boolean() ? randomDate(sessionStart, new Date()) : new Date(0),
        last_message_by: lastMessageBy,
      });
      chatSessionIds.push(chatSession._id);
    }
    console.log(`Seeded ${chatSessionIds.length} ChatSession.`);

    // 34. AuditTrail (Depends on User)
    console.log('Seeding AuditTrail...');
    const severityOptions = ['low', 'medium', 'high', 'critical'];
    const entityTypes = ['User', 'Pasien', 'Doctor', 'Obat', 'Konsultasi', 'Resep', 'Pembayaran'];
    const allEntityIds = [...userIds.map(u => u._id), ...pasienIds, ...doctorIds, ...obatIds, ...konsultasiIds, ...resepIds, ...pembayaranIds];

    for (let i = 0; i < NUM_AUDIT_TRAIL; i++) {
      const userId = faker.helpers.arrayElement(userIds.map(u => u._id));
      const entityType = faker.helpers.arrayElement(entityTypes);
      const entityId = faker.helpers.arrayElement(allEntityIds);

      const auditTrail = await AuditTrail.create({
        user_id: userId,
        action: faker.lorem.word(),
        entity_type: entityType,
        entity_id: entityId,
        old_values: faker.datatype.boolean() ? { field1: faker.lorem.word(), field2: faker.number.int() } : {},
        new_values: faker.datatype.boolean() ? { field1: faker.lorem.word(), field2: faker.number.int() } : {},
        ip_address: faker.internet.ip(),
        user_agent: faker.internet.userAgent(),
        description: faker.lorem.sentence(),
        severity: faker.helpers.arrayElement(severityOptions),
        created_at: randomDate(new Date(2024, 0, 1), new Date()),
      });
      auditTrailIds.push(auditTrail._id);
    }
    console.log(`Seeded ${auditTrailIds.length} AuditTrail.`);

    // 35. AppAnalytics (Depends on User)
    console.log('Seeding AppAnalytics...');
    const platformOptions = ['android', 'ios', 'web'];
    const deviceTypeOptions = ['mobile', 'tablet', 'desktop'];
    for (let i = 0; i < NUM_APP_ANALYTICS; i++) {
      const userId = faker.helpers.arrayElement(userIds.map(u => u._id));

      const appAnalytics = await AppAnalytics.create({
        user_id: userId,
        event_name: faker.lorem.word() + '_event',
        event_category: faker.lorem.word(),
        event_data: { item_id: faker.string.uuid(), value: faker.number.int({ min: 1, max: 100 }) },
        platform: faker.helpers.arrayElement(platformOptions),
        app_version: faker.system.semver(),
        device_type: faker.helpers.arrayElement(deviceTypeOptions),
        os_version: faker.system.semver(),
        screen_resolution: `${faker.number.int({ min: 800, max: 1920 })}x${faker.number.int({ min: 600, max: 1080 })}`,
        session_id: faker.string.uuid(),
        created_at: randomDate(new Date(2024, 0, 1), new Date()),
      });
      appAnalyticsIds.push(appAnalytics._id);
    }
    console.log(`Seeded ${appAnalyticsIds.length} AppAnalytics.`);

    console.log('MongoDB Seeding Completed!');
  } catch (error) {
    console.error('MongoDB Seeding Failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();