const { faker, bcrypt, NUM_PROVINSI, NUM_KOTA_PER_PROVINSI, NUM_USERS, NUM_APOTEK, NUM_KATEGORI_ARTIKEL, NUM_FAQ, NUM_KATEGORI_OBAT, NUM_KURIR, NUM_PROMO, NUM_RUMAH_SAKIT, NUM_SPESIALISASI, NUM_SYSTEM_SETTINGS, randomDate, randomTime } = require('../seed_utils');

exports.seed = async function(knex) {
  // Clear existing data in reverse order of foreign key dependencies
  await knex('appointment').del();
  await knex('jadwal_doctor').del();
  await knex('chat_messages').del();
  await knex('feedback').del();
  await knex('review_rating').del();
  await knex('notifikasi').del();
  await knex('vital_signs').del();
  await knex('medical_record').del();
  await knex('detail_resep').del();
  await knex('pengiriman').del();
  await knex('stok_obat').del();
  await knex('system_settings').del();
  await knex('user_promo').del();
  await knex('pembayaran').del();
  await knex('resep').del();
  await knex('konsultasi').del();
  await knex('doctor').del();
  await knex('spesialisasi').del();
  await knex('rumah_sakit').del();
  await knex('promo').del();
  await knex('pasien').del();
  await knex('obat').del();
  await knex('logs').del();
  await knex('kurir').del();
  await knex('kategori_obat').del();
  await knex('faq').del();
  await knex('artikel_kesehatan').del();
  await knex('kategori_artikel').del();
  await knex('apoteker').del();
  await knex('apotek').del();
  await knex('admin').del();
  await knex('users').del();
  await knex('kota').del();
  await knex('provinsi').del();

  // 1. provinsi
  console.log('Seeding provinsi...');
  const uniqueProvinsiNames = new Set();
  while (uniqueProvinsiNames.size < NUM_PROVINSI) {
    uniqueProvinsiNames.add(faker.location.state());
  }
  const provinsiData = Array.from(uniqueProvinsiNames).map(name => ({
    nama_provinsi: name,
    kode_provinsi: faker.string.alphanumeric(5).toUpperCase(),
    is_active: faker.datatype.boolean(),
  }));
  await knex.batchInsert('provinsi', provinsiData, 1000);
  const provinsiIds = (await knex.select('provinsi_id').from('provinsi')).map(row => row.provinsi_id);
  console.log(`Seeded ${provinsiIds.length} provinsi.`);

  // 2. kota
  console.log('Seeding kota...');
  const kotaData = [];
  for (let i = 0; i < provinsiIds.length; i++) {
    for (let j = 0; j < NUM_KOTA_PER_PROVINSI; j++) {
      kotaData.push({
        provinsi_id: provinsiIds[i],
        nama_kota: faker.location.city(),
        kode_kota: faker.string.alphanumeric(5).toUpperCase(),
        is_active: faker.datatype.boolean(),
      });
    }
  }
  await knex.batchInsert('kota', kotaData, 1000);
  const kotaIds = (await knex.select('kota_id').from('kota')).map(row => row.kota_id);
  console.log(`Seeded ${kotaIds.length} kota.`);

  // 3. users
  console.log('Seeding users...');
  const usersData = [];
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
    usersData.push({
      email: email,
      password_hash: await bcrypt.hash('password123', 10), // Example password
      phone: faker.phone.number('+628##########'),
      role: role,
      is_active: faker.datatype.boolean(),
      is_verified: faker.datatype.boolean(),
      last_login: faker.datatype.boolean() ? randomDate(new Date(2024, 0, 1), new Date()) : null,
      created_at: randomDate(new Date(2023, 0, 1), new Date()),
      updated_at: randomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('users', usersData, 1000);
  const userIds = (await knex.select('user_id').from('users')).map(row => row.user_id);
  global.allUsersData = await knex.select('user_id', 'role').from('users'); // Store user_id and role for filtering
  console.log(`Seeded ${userIds.length} users.`);

  // 5. apotek
  console.log('Seeding apotek...');
  const apotekData = [];
  for (let i = 0; i < NUM_APOTEK; i++) {
    apotekData.push({
      nama_apotek: faker.company.name() + ' Apotek',
      alamat: faker.location.streetAddress(true),
      no_telepon: faker.phone.number('+6221########'),
      email: faker.internet.email(),
      jam_buka: randomTime(),
      jam_tutup: randomTime(),
      koordinat_lat: faker.location.latitude(),
      koordinat_lng: faker.location.longitude(),
      foto_apotek: faker.image.urlLoremFlickr({ category: 'pharmacy' }),
      is_24_jam: faker.datatype.boolean(),
      is_active: faker.datatype.boolean(),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
    });
  }
  await knex.batchInsert('apotek', apotekData, 1000);
  const apotekIds = (await knex.select('apotek_id').from('apotek')).map(row => row.apotek_id);
  console.log(`Seeded ${apotekIds.length} apotek.`);

  // 7. kategori_artikel
  console.log('Seeding kategori_artikel...');
  const kategoriArtikelData = [];
  const uniqueKategoriArtikelNames = new Set();
  let kategoriArtikelCounter = 0;
  for (let i = 0; i < NUM_KATEGORI_ARTIKEL; i++) {
    let namaKategori;
    do {
      namaKategori = faker.lorem.word();
      if (uniqueKategoriArtikelNames.has(namaKategori)) {
        namaKategori = `temp_${kategoriArtikelCounter++}_` + namaKategori;
      }
    } while (uniqueKategoriArtikelNames.has(namaKategori));
    uniqueKategoriArtikelNames.add(namaKategori);

    kategoriArtikelData.push({
      nama_kategori: namaKategori,
      deskripsi: faker.lorem.sentence(),
      icon: faker.image.urlLoremFlickr({ category: 'icon' }),
      is_active: faker.datatype.boolean(),
    });
  }
  await knex.batchInsert('kategori_artikel', kategoriArtikelData, 1000);
  const kategoriArtikelIds = (await knex.select('kategori_id').from('kategori_artikel')).map(row => row.kategori_id);
  console.log(`Seeded ${kategoriArtikelIds.length} kategori_artikel.`);

  // 9. faq
  console.log('Seeding faq...');
  const faqData = [];
  for (let i = 0; i < NUM_FAQ; i++) {
    faqData.push({
      pertanyaan: faker.lorem.sentence() + '?',
      jawaban: faker.lorem.paragraph(),
      kategori: faker.lorem.word(),
      urutan: faker.number.int({ min: 0, max: 100 }),
      is_active: faker.datatype.boolean(),
      views: faker.number.int({ min: 0, max: 5000 }),
      created_at: randomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('faq', faqData, 1000);
  const faqIds = (await knex.select('faq_id').from('faq')).map(row => row.faq_id);
  console.log(`Seeded ${faqIds.length} faq.`);

  // 10. kategori_obat
  console.log('Seeding kategori_obat...');
  const kategoriObatData = [];
  const uniqueKategoriObatNames = new Set();
  let kategoriObatCounter = 0;
  for (let i = 0; i < NUM_KATEGORI_OBAT; i++) {
    let namaKategori;
    do {
      namaKategori = faker.commerce.productAdjective() + ' Obat';
      if (uniqueKategoriObatNames.has(namaKategori)) {
        namaKategori = `temp_${kategoriObatCounter++}_` + namaKategori;
      }
    } while (uniqueKategoriObatNames.has(namaKategori));
    uniqueKategoriObatNames.add(namaKategori);

    kategoriObatData.push({
      nama_kategori: namaKategori,
      deskripsi: faker.lorem.sentence(),
      icon: faker.image.urlLoremFlickr({ category: 'medicine' }),
      is_active: faker.datatype.boolean(),
    });
  }
  await knex.batchInsert('kategori_obat', kategoriObatData, 1000);
  const kategoriObatIds = (await knex.select('kategori_id').from('kategori_obat')).map(row => row.kategori_id);
  console.log(`Seeded ${kategoriObatIds.length} kategori_obat.`);

  // 11. kurir
  console.log('Seeding kurir...');
  const kurirData = [];
  const kendaraanOptions = ['motor', 'mobil', 'sepeda'];
  for (let i = 0; i < NUM_KURIR; i++) {
    kurirData.push({
      nama_kurir: faker.person.fullName(),
      no_telepon: faker.phone.number('+628##########'),
      email: faker.internet.email(),
      kendaraan: faker.helpers.arrayElement(kendaraanOptions),
      nomor_plat: faker.vehicle.vrm(),
      foto_profil: faker.image.avatar(),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.01 }),
      is_active: faker.datatype.boolean(),
      area_layanan: JSON.stringify(faker.helpers.arrayElements(kotaIds, { min: 1, max: 3 })),
    });
  }
  await knex.batchInsert('kurir', kurirData, 1000);
  const kurirIds = (await knex.select('kurir_id').from('kurir')).map(row => row.kurir_id);
  console.log(`Seeded ${kurirIds.length} kurir.`);

  // 14. promo
  console.log('Seeding promo...');
  const promoData = [];
  const tipeDiskonOptions = ['percentage', 'fixed_amount', 'free_shipping'];
  for (let i = 0; i < NUM_PROMO; i++) {
    const tipeDiskon = faker.helpers.arrayElement(tipeDiskonOptions);
    const nilaiDiskon = tipeDiskon === 'percentage' ? faker.number.float({ min: 5, max: 50, precision: 0.01 }) : faker.number.float({ min: 10000, max: 100000, precision: 0.01 });
    const tanggalMulai = randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1));
    const tanggalBerakhir = randomDate(tanggalMulai, new Date(tanggalMulai.getTime() + (30 * 24 * 60 * 60 * 1000))); // 30 days after start
    promoData.push({
      kode_promo: faker.string.alphanumeric(10).toUpperCase(),
      nama_promo: faker.commerce.productAdjective() + ' Promo',
      deskripsi: faker.lorem.sentence(),
      tipe_diskon: tipeDiskon,
      nilai_diskon: nilaiDiskon,
      minimum_pembelian: faker.number.float({ min: 0, max: 500000, precision: 0.01 }),
      maksimum_diskon: tipeDiskon === 'percentage' ? faker.number.float({ min: 50000, max: 200000, precision: 0.01 }) : null,
      tanggal_mulai: tanggalMulai,
      tanggal_berakhir: tanggalBerakhir,
      quota_penggunaan: faker.number.int({ min: 100, max: 1000 }),
      sudah_digunakan: faker.number.int({ min: 0, max: 500 }),
      is_active: faker.datatype.boolean(),
      banner_promo: faker.image.urlLoremFlickr({ category: 'promo' }),
    });
  }
  await knex.batchInsert('promo', promoData, 1000);
  const promoIds = (await knex.select('promo_id').from('promo')).map(row => row.promo_id);
  console.log(`Seeded ${promoIds.length} promo.`);

  // 15. rumah_sakit
  console.log('Seeding rumah_sakit...');
  const rumahSakitData = [];
  const tipeRumahSakitOptions = ['pemerintah', 'swasta', 'militer'];
  const kelasRumahSakitOptions = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < NUM_RUMAH_SAKIT; i++) {
    rumahSakitData.push({
      nama_rumah_sakit: faker.company.name() + ' Hospital',
      alamat: faker.location.streetAddress(true),
      no_telepon: faker.phone.number('+6221########'),
      email: faker.internet.email(),
      website: faker.internet.url(),
      tipe_rumah_sakit: faker.helpers.arrayElement(tipeRumahSakitOptions),
      kelas_rumah_sakit: faker.helpers.arrayElement(kelasRumahSakitOptions),
      koordinat_lat: faker.location.latitude(),
      koordinat_lng: faker.location.longitude(),
      foto_rumah_sakit: faker.image.urlLoremFlickr({ category: 'hospital' }),
      is_active: faker.datatype.boolean(),
    });
  }
  await knex.batchInsert('rumah_sakit', rumahSakitData, 1000);
  const rumahSakitIds = (await knex.select('rumah_sakit_id').from('rumah_sakit')).map(row => row.rumah_sakit_id);
  console.log(`Seeded ${rumahSakitIds.length} rumah_sakit.`);

  // 16. spesialisasi
  console.log('Seeding spesialisasi...');
  const spesialisasiData = [];
  const medicalSpecialties = [
    'Kardiologi', 'Dermatologi', 'Endokrinologi', 'Gastroenterologi', 'Hematologi',
    'Nefrologi', 'Neurologi', 'Onkologi', 'Oftalmologi', 'Ortopedi',
    'Pediatri', 'Psikiatri', 'Pulmonologi', 'Reumatologi', 'Urologi',
    'Anestesiologi', 'Bedah Umum', 'Obstetri dan Ginekologi', 'THT', 'Radiologi'
  ];
  const uniqueSpesialisasiNames = new Set();
  let spesialisasiCounter = 0;
  for (let i = 0; i < NUM_SPESIALISASI; i++) {
    let namaSpesialisasi;
    do {
      namaSpesialisasi = faker.helpers.arrayElement(medicalSpecialties);
      if (uniqueSpesialisasiNames.has(namaSpesialisasi)) {
        namaSpesialisasi = `temp_${spesialisasiCounter++}_` + namaSpesialisasi;
      }
    } while (uniqueSpesialisasiNames.has(namaSpesialisasi));
    uniqueSpesialisasiNames.add(namaSpesialisasi);

    spesialisasiData.push({
      nama_spesialisasi: namaSpesialisasi,
      deskripsi: faker.lorem.sentence(),
      icon: faker.image.urlLoremFlickr({ category: 'medical_icon' }),
      is_active: faker.datatype.boolean(),
    });
  }
  await knex.batchInsert('spesialisasi', spesialisasiData, 1000);
  const spesialisasiIds = (await knex.select('spesialisasi_id').from('spesialisasi')).map(row => row.spesialisasi_id);
  console.log(`Seeded ${spesialisasiIds.length} spesialisasi.`);

  // 22. system_settings
  console.log('Seeding system_settings...');
  const systemSettingsData = [];
  const settingTypes = ['string', 'number', 'boolean', 'json'];
  const settingKeys = ['app_name', 'admin_email', 'maintenance_mode', 'api_version', 'contact_phone', 'default_currency', 'max_upload_size', 'terms_and_conditions', 'privacy_policy', 'social_media_links'];
  for (let i = 0; i < NUM_SYSTEM_SETTINGS; i++) {
    const settingType = faker.helpers.arrayElement(settingTypes);
    let settingValue;
    switch (settingType) {
      case 'string':
        settingValue = faker.lorem.word();
        break;
      case 'number':
        settingValue = faker.number.int({ min: 1, max: 1000 }).toString();
        break;
      case 'boolean':
        settingValue = faker.datatype.boolean().toString();
        break;
      case 'json':
        settingValue = JSON.stringify({ key: faker.lorem.word(), value: faker.lorem.sentence() });
        break;
    }
    systemSettingsData.push({
      setting_key: settingKeys[i] || faker.lorem.slug(),
      setting_value: settingValue,
      setting_type: settingType,
      description: faker.lorem.sentence(),
      is_public: faker.datatype.boolean(),
      created_at: randomDate(new Date(2023, 0, 1), new Date()),
      updated_at: randomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('system_settings', systemSettingsData, 1000);
  const systemSettingIds = (await knex.select('setting_id').from('system_settings')).map(row => row.setting_id);
  console.log(`Seeded ${systemSettingIds.length} system_settings.`);

  // Export IDs for subsequent seed files
  global.provinsiIds = provinsiIds;
  global.kotaIds = kotaIds;
  global.userIds = userIds;
  global.apotekIds = apotekIds;
  global.kategoriArtikelIds = kategoriArtikelIds;
  global.faqIds = faqIds;
  global.kategoriObatIds = kategoriObatIds;
  global.kurirIds = kurirIds;
  global.promoIds = promoIds;
  global.rumahSakitIds = rumahSakitIds;
  global.spesialisasiIds = spesialisasiIds;
  global.systemSettingIds = systemSettingIds;
};