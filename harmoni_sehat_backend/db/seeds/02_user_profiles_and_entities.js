const seedUtils = require('../seed_utils');
const { bcrypt, randomDate } = seedUtils;

exports.seed = async function(knex) {
  // Retrieve IDs from previous seed file
  const { userIds, apotekIds, provinsiIds, kotaIds, kategoriObatIds, spesialisasiIds, rumahSakitIds, kategoriArtikelIds, allUsersData } = global;

  if (!userIds || userIds.length === 0 || !allUsersData || allUsersData.length === 0) {
    console.warn('Skipping 02_user_profiles_and_entities.js: Missing required IDs or user data. Ensure 01_core_data.js ran successfully.');
    return;
  }

  // Helper to get user data by ID
  const getUserDataById = (id) => allUsersData.find(user => user.user_id === id);

  // 4. admin
  console.log('Seeding admin...');
  const adminUsers = userIds.filter(id => getUserDataById(id)?.role === 'admin');
  const adminData = [];
  for (let i = 0; i < Math.min(seedUtils.NUM_ADMINS, adminUsers.length); i++) {
    adminData.push({
      user_id: adminUsers[i],
      nama_lengkap: seedUtils.faker.person.fullName(),
      level_akses: seedUtils.faker.helpers.arrayElement(['super_admin', 'admin', 'moderator']),
      foto_profil: seedUtils.faker.image.avatar(),
      departemen: seedUtils.faker.commerce.department(),
    });
  }
  await knex.batchInsert('admin', adminData, 1000);
  const adminIds = (await knex.select('admin_id').from('admin')).map(row => row.admin_id);
  console.log(`Seeded ${adminIds.length} admin.`);

  // 6. apoteker
  console.log('Seeding apoteker...');
  const apotekerUsers = userIds.filter(id => getUserDataById(id)?.role === 'apoteker');
  const apotekerData = [];
  for (let i = 0; i < Math.min(seedUtils.NUM_APOTEKERS, apotekerUsers.length); i++) {
    apotekerData.push({
      user_id: apotekerUsers[i],
      nama_lengkap: seedUtils.faker.person.fullName(),
      no_sipa: seedUtils.faker.string.alphanumeric(15).toUpperCase(),
      apotek_id: seedUtils.faker.helpers.arrayElement(apotekIds),
      is_verified: seedUtils.faker.datatype.boolean(),
      foto_profil: seedUtils.faker.image.avatar(),
    });
  }
  await knex.batchInsert('apoteker', apotekerData, 1000);
  const apotekerIds = (await knex.select('apoteker_id').from('apoteker')).map(row => row.apoteker_id);
  console.log(`Seeded ${apotekerIds.length} apoteker.`);

  // 12. obat
  console.log('Seeding obat...');
  const obatData = [];
  const bentukObatOptions = ['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes'];
  for (let i = 0; i < seedUtils.NUM_OBAT; i++) {
    obatData.push({
      nama_obat: seedUtils.faker.commerce.productName() + ' ' + seedUtils.faker.helpers.arrayElement(['Forte', 'Plus', 'Kids', 'Extra']),
      nama_generik: seedUtils.faker.commerce.productMaterial(),
      kategori_obat_id: seedUtils.faker.helpers.arrayElement(kategoriObatIds),
      bentuk_obat: seedUtils.faker.helpers.arrayElement(bentukObatOptions),
      kandungan: seedUtils.faker.lorem.sentence(),
      deskripsi: seedUtils.faker.lorem.paragraph(),
      indikasi: seedUtils.faker.lorem.sentence(),
      kontraindikasi: seedUtils.faker.lorem.sentence(),
      efek_samping: seedUtils.faker.lorem.sentence(),
      dosis_dewasa: seedUtils.faker.lorem.sentence(),
      dosis_anak: seedUtils.faker.lorem.sentence(),
      cara_penyimpanan: seedUtils.faker.lorem.sentence(),
      nomor_bpom: seedUtils.faker.string.alphanumeric(12).toUpperCase(),
      produsen: seedUtils.faker.company.name(),
      harga: seedUtils.faker.number.float({ min: 10000, max: 500000, precision: 0.01 }),
      foto_obat: seedUtils.faker.image.urlLoremFlickr({ category: 'pills' }),
      is_resep_dokter: seedUtils.faker.datatype.boolean(),
      is_active: seedUtils.faker.datatype.boolean(),
    });
  }
  await knex.batchInsert('obat', obatData, 1000);
  const obatIds = (await knex.select('obat_id').from('obat')).map(row => row.obat_id);
  console.log(`Seeded ${obatIds.length} obat.`);

  // 13. pasien
  console.log('Seeding pasien...');
  const pasienUsers = userIds.filter(id => getUserDataById(id)?.role === 'pasien');
  const jenisKelaminOptions = ['L', 'P'];
  const golonganDarahOptions = ['A', 'B', 'AB', 'O'];
  const pasienData = [];
  for (let i = 0; i < Math.min(seedUtils.NUM_PASIEN, pasienUsers.length); i++) {
    pasienData.push({
      user_id: pasienUsers[i],
      nama_lengkap: seedUtils.faker.person.fullName(),
      tanggal_lahir: seedUtils.faker.date.past({ years: 50, refDate: new Date() }),
      jenis_kelamin: seedUtils.faker.helpers.arrayElement(jenisKelaminOptions),
      alamat: seedUtils.faker.location.streetAddress(true),
      no_ktp: seedUtils.faker.string.numeric(16),
      golongan_darah: seedUtils.faker.helpers.arrayElement(golonganDarahOptions),
      riwayat_alergi: seedUtils.faker.datatype.boolean() ? seedUtils.faker.lorem.words(5) : null,
      kontak_darurat: seedUtils.faker.phone.number('+628##########'),
      foto_profil: seedUtils.faker.image.avatar(),
      berat_badan: seedUtils.faker.number.float({ min: 40, max: 100, precision: 0.01 }),
      tinggi_badan: seedUtils.faker.number.float({ min: 150, max: 190, precision: 0.01 }),
      provinsi_id: seedUtils.faker.helpers.arrayElement(provinsiIds),
      kota_id: seedUtils.faker.helpers.arrayElement(kotaIds),
    });
  }
  await knex.batchInsert('pasien', pasienData, 1000);
  const pasienIds = (await knex.select('pasien_id').from('pasien')).map(row => row.pasien_id);
  console.log(`Seeded ${pasienIds.length} pasien.`);

  // 17. doctor
  console.log('Seeding doctor...');
  const doctorUsers = userIds.filter(id => getUserDataById(id)?.role === 'doctor');
  const doctorData = [];
  for (let i = 0; i < Math.min(seedUtils.NUM_DOCTORS, doctorUsers.length); i++) {
    doctorData.push({
      user_id: doctorUsers[i],
      nama_lengkap: seedUtils.faker.person.fullName(),
      no_sip: seedUtils.faker.string.alphanumeric(15).toUpperCase(),
      spesialisasi_id: seedUtils.faker.helpers.arrayElement(spesialisasiIds),
      pengalaman_tahun: seedUtils.faker.number.int({ min: 1, max: 30 }),
      tarif_konsultasi: seedUtils.faker.number.float({ min: 50000, max: 500000, precision: 0.01 }),
      rumah_sakit_id: seedUtils.faker.helpers.arrayElement(rumahSakitIds),
      rating: seedUtils.faker.number.float({ min: 1, max: 5, precision: 0.01 }),
      total_konsultasi: seedUtils.faker.number.int({ min: 0, max: 1000 }),
      is_verified: seedUtils.faker.datatype.boolean(),
      foto_profil: seedUtils.faker.image.avatar(),
      alumnus: seedUtils.faker.company.name(),
      bio: seedUtils.faker.lorem.paragraph(),
    });
  }
  await knex.batchInsert('doctor', doctorData, 1000);
  const doctorIds = (await knex.select('doctor_id').from('doctor')).map(row => row.doctor_id);
  console.log(`Seeded ${doctorIds.length} doctor.`);

  // 8. artikel_kesehatan
  console.log('Seeding artikel_kesehatan...');
  const artikelKesehatanData = [];
  for (let i = 0; i < seedUtils.NUM_ARTIKEL_KESEHATAN; i++) {
    const judul = seedUtils.faker.lorem.sentence();
    artikelKesehatanData.push({
      judul: judul,
      slug: seedUtils.faker.helpers.slugify(judul).toLowerCase(),
      konten: seedUtils.faker.lorem.paragraphs(5),
      kategori_artikel_id: seedUtils.faker.helpers.arrayElement(kategoriArtikelIds),
      penulis: seedUtils.faker.person.fullName(),
      gambar_utama: seedUtils.faker.image.urlLoremFlickr({ category: 'health' }),
      tags: JSON.stringify(seedUtils.faker.helpers.arrayElements([seedUtils.faker.lorem.word(), seedUtils.faker.lorem.word(), seedUtils.faker.lorem.word()], { min: 1, max: 3 })),
      meta_description: seedUtils.faker.lorem.sentence(),
      views: seedUtils.faker.number.int({ min: 0, max: 10000 }),
      likes: seedUtils.faker.number.int({ min: 0, max: 1000 }),
      is_featured: seedUtils.faker.datatype.boolean(),
      is_published: seedUtils.faker.datatype.boolean(),
      tanggal_publish: randomDate(new Date(2023, 0, 1), new Date()),
      created_at: randomDate(new Date(2023, 0, 1), new Date()),
      updated_at: randomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('artikel_kesehatan', artikelKesehatanData, 1000);
  const artikelKesehatanIds = (await knex.select('artikel_id').from('artikel_kesehatan')).map(row => row.artikel_id);
  console.log(`Seeded ${artikelKesehatanIds.length} artikel_kesehatan.`);

  // Export IDs for subsequent seed files
  global.adminIds = adminIds;
  global.apotekerIds = apotekerIds;
  global.obatIds = obatIds;
  global.pasienIds = pasienIds;
  global.doctorIds = doctorIds;
  global.artikelKesehatanIds = artikelKesehatanIds;
};