const { faker, NUM_KONSULTASI, NUM_RESEP, NUM_PEMBAYARAN, NUM_USER_PROMO, NUM_STOK_OBAT, NUM_PENGIRIMAN, NUM_DETAIL_RESEP_PER_RESEP, NUM_MEDICAL_RECORD, NUM_VITAL_SIGNS, NUM_NOTIFIKASI, NUM_REVIEW_RATING, NUM_FEEDBACK, NUM_JADWAL_DOCTOR, NUM_APPOINTMENT, NUM_LOGS, randomDate, randomTime } = require('../seed_utils');

exports.seed = async function(knex) {
  // Retrieve IDs from previous seed files
  const { userIds, pasienIds, doctorIds, apotekIds, obatIds, promoIds, kurirIds, konsultasiIds: prevKonsultasiIds, resepIds: prevResepIds, pembayaranIds: prevPembayaranIds } = global;

  if (!userIds || userIds.length === 0 || !pasienIds || pasienIds.length === 0 || !doctorIds || doctorIds.length === 0) {
    console.warn('Skipping 03_transactional_data_part1.js: Missing required IDs. Ensure previous seed files ran successfully.');
    rteturn;
  }

  // 18. konsultasi
  console.log('Seeding konsultasi...');
  const konsultasiData = [];
  const statusKonsultasiOptions = ['pending', 'ongoing', 'completed', 'cancelled'];
  const jenisKonsultasiOptions = ['chat', 'video_call', 'voice_call'];
  for (let i = 0; i < NUM_KONSULTASI; i++) {
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const doctorId = faker.helpers.arrayElement(doctorIds);
    const tanggalKonsultasi = randomDate(new Date(2024, 0, 1), new Date());
    const status = faker.helpers.arrayElement(statusKonsultasiOptions);
    konsultasiData.push({
      pasien_id: pasienId,
      doctor_id: doctorId,
      keluhan_utama: faker.lorem.sentence(),
      riwayat_penyakit: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      gejala: faker.lorem.words(5),
      tanggal_konsultasi: tanggalKonsultasi,
      diagnosa: status === 'completed' ? faker.lorem.sentence() : null,
      tindakan: status === 'completed' ? faker.lorem.sentence() : null,
      catatan_dokter: status === 'completed' ? faker.lorem.paragraph() : null,
      status: status,
      jenis_konsultasi: faker.helpers.arrayElement(jenisKonsultasiOptions),
      durasi_konsultasi: status === 'completed' ? faker.number.int({ min: 5, max: 60 }) : null,
      biaya: faker.number.float({ min: 50000, max: 500000, precision: 0.01 }),
      rating_pasien: status === 'completed' ? faker.number.int({ min: 1, max: 5 }) : null,
      review_pasien: status === 'completed' && faker.datatype.boolean() ? faker.lorem.sentence() : null,
      rating_dokter: status === 'completed' ? faker.number.int({ min: 1, max: 5 }) : null,
    });
  }
  await knex.batchInsert('konsultasi', konsultasiData, 1000);
  const konsultasiIds = (await knex.select('konsultasi_id').from('konsultasi')).map(row => row.konsultasi_id);
  console.log(`Seeded ${konsultasiIds.length} konsultasi.`);

  // 19. resep
  console.log('Seeding resep...');
  const resepData = [];
  const statusResepOptions = ['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled'];
  for (let i = 0; i < NUM_RESEP; i++) {
    const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
    const doctorId = faker.helpers.arrayElement(doctorIds);
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const apotekId = faker.helpers.arrayElement(apotekIds);
    const tanggalResep = randomDate(new Date(2024, 0, 1), new Date());
    const tanggalKadaluarsa = randomDate(tanggalResep, new Date(tanggalResep.getTime() + (7 * 24 * 60 * 60 * 1000))); // 7 days after resep
    resepData.push({
      konsultasi_id: konsultasiId,
      doctor_id: doctorId,
      pasien_id: pasienId,
      apotek_id: apotekId,
      kode_resep: faker.string.alphanumeric(10).toUpperCase(),
      tanggal_resep: tanggalResep,
      tanggal_kadaluarsa: tanggalKadaluarsa,
      catatan_resep: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      status: faker.helpers.arrayElement(statusResepOptions),
      total_harga: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
      biaya_pengiriman: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
    });
  }
  await knex.batchInsert('resep', resepData, 1000);
  const resepIds = (await knex.select('resep_id').from('resep')).map(row => row.resep_id);
  console.log(`Seeded ${resepIds.length} resep.`);

  // 20. pembayaran
  console.log('Seeding pembayaran...');
  const pembayaranData = [];
  const jenisPembayaranOptions = ['konsultasi', 'obat', 'keduanya'];
  const metodePembayaranOptions = ['transfer', 'ewallet', 'va', 'kartu_kredit', 'cod'];
  const statusPembayaranOptions = ['pending', 'success', 'failed', 'refunded', 'expired'];
  for (let i = 0; i < NUM_PEMBAYARAN; i++) {
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const jenisPembayaran = faker.helpers.arrayElement(jenisPembayaranOptions);
    const konsultasiId = jenisPembayaran === 'konsultasi' || jenisPembayaran === 'keduanya' ? faker.helpers.arrayElement(konsultasiIds) : null;
    const resepId = jenisPembayaran === 'obat' || jenisPembayaran === 'keduanya' ? faker.helpers.arrayElement(resepIds) : null;
    const jumlahBayar = faker.number.float({ min: 50000, max: 1500000, precision: 0.01 });
    const biayaAdmin = faker.number.float({ min: 0, max: 10000, precision: 0.01 });
    const totalBayar = jumlahBayar + biayaAdmin;
    const tanggalPembayaran = randomDate(new Date(2024, 0, 1), new Date());
    const tanggalKadaluarsa = randomDate(tanggalPembayaran, new Date(tanggalPembayaran.getTime() + (1 * 24 * 60 * 60 * 1000))); // 1 day after payment

    pembayaranData.push({
      konsultasi_id: konsultasiId,
      resep_id: resepId,
      pasien_id: pasienId,
      kode_pembayaran: faker.string.alphanumeric(15).toUpperCase(),
      jenis_pembayaran: jenisPembayaran,
      jumlah_bayar: jumlahBayar,
      biaya_admin: biayaAdmin,
      total_bayar: totalBayar,
      metode_pembayaran: faker.helpers.arrayElement(metodePembayaranOptions),
      status_pembayaran: faker.helpers.arrayElement(statusPembayaranOptions),
      tanggal_pembayaran: tanggalPembayaran,
      tanggal_kadaluarsa: tanggalKadaluarsa,
      payment_gateway_id: faker.string.uuid(),
      bukti_pembayaran: faker.datatype.boolean() ? faker.image.urlLoremFlickr({ category: 'receipt' }) : null,
    });
  }
  await knex.batchInsert('pembayaran', pembayaranData, 1000);
  const pembayaranIds = (await knex.select('pembayaran_id').from('pembayaran')).map(row => row.pembayaran_id);
  console.log(`Seeded ${pembayaranIds.length} pembayaran.`);

  // 21. user_promo
  console.log('Seeding user_promo...');
  const userPromoData = [];
  for (let i = 0; i < NUM_USER_PROMO; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const promoId = faker.helpers.arrayElement(promoIds);
    const pembayaranId = faker.helpers.arrayElement(pembayaranIds);
    userPromoData.push({
      user_id: userId,
      promo_id: promoId,
      pembayaran_id: pembayaranId,
      tanggal_digunakan: randomDate(new Date(2024, 0, 1), new Date()),
      nilai_diskon_diterima: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
    });
  }
  await knex.batchInsert('user_promo', userPromoData, 1000);
  const userPromoIds = (await knex.select('user_promo_id').from('user_promo')).map(row => row.user_promo_id);
  console.log(`Seeded ${userPromoIds.length} user_promo.`);

  // 23. stok_obat
  console.log('Seeding stok_obat...');
  const stokObatData = [];
  for (let i = 0; i < NUM_STOK_OBAT; i++) {
    const obatId = faker.helpers.arrayElement(obatIds);
    const apotekId = faker.helpers.arrayElement(apotekIds);
    const tanggalKadaluarsa = randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 5))); // Up to 5 years from now
    stokObatData.push({
      obat_id: obatId,
      apotek_id: apotekId,
      jumlah_stok: faker.number.int({ min: 0, max: 1000 }),
      stok_minimum: faker.number.int({ min: 0, max: 100 }),
      tanggal_kadaluarsa: tanggalKadaluarsa,
      harga_jual: faker.number.float({ min: 10000, max: 500000, precision: 0.01 }),
      is_available: faker.datatype.boolean(),
      updated_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('stok_obat', stokObatData, 1000);
  const stokObatIds = (await knex.select('stok_id').from('stok_obat')).map(row => row.stok_id);
  console.log(`Seeded ${stokObatIds.length} stok_obat.`);

  // 24. pengiriman
  console.log('Seeding pengiriman...');
  const pengirimanData = [];
  const statusPengirimanOptions = ['pending', 'picked_up', 'on_delivery', 'delivered', 'returned'];
  for (let i = 0; i < NUM_PENGIRIMAN; i++) {
    const resepId = faker.helpers.arrayElement(resepIds);
    const kurirId = faker.helpers.arrayElement(kurirIds);
    const tanggalKirim = randomDate(new Date(2024, 0, 1), new Date());
    const estimasiTiba = randomDate(tanggalKirim, new Date(tanggalKirim.getTime() + (2 * 24 * 60 * 60 * 1000))); // 2 days after kirim
    const tanggalTerima = faker.datatype.boolean() ? randomDate(estimasiTiba, new Date()) : null;
    pengirimanData.push({
      resep_id: resepId,
      kurir_id: kurirId,
      alamat_pengiriman: faker.location.streetAddress(true),
      koordinat_lat: faker.location.latitude(),
      koordinat_lng: faker.location.longitude(),
      tanggal_kirim: tanggalKirim,
      estimasi_tiba: estimasiTiba,
      tanggal_terima: tanggalTerima,
      status_pengiriman: faker.helpers.arrayElement(statusPengirimanOptions),
      catatan_pengiriman: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      foto_bukti_terima: faker.datatype.boolean() ? faker.image.urlLoremFlickr({ category: 'delivery' }) : null,
      biaya_pengiriman: faker.number.float({ min: 10000, max: 50000, precision: 0.01 }),
    });
  }
  await knex.batchInsert('pengiriman', pengirimanData, 1000);
  const pengirimanIds = (await knex.select('pengiriman_id').from('pengiriman')).map(row => row.pengiriman_id);
  console.log(`Seeded ${pengirimanIds.length} pengiriman.`);

  // 25. detail_resep
  console.log('Seeding detail_resep...');
  const detailResepData = [];
  for (let i = 0; i < resepIds.length; i++) {
    const resepId = resepIds[i];
    const numItems = faker.number.int({ min: 1, max: NUM_DETAIL_RESEP_PER_RESEP * 2 });
    for (let j = 0; j < numItems; j++) {
      const obatId = faker.helpers.arrayElement(obatIds);
      const jumlah = faker.number.int({ min: 1, max: 10 });
      const hargaSatuan = faker.number.float({ min: 5000, max: 200000, precision: 0.01 });
      const subtotal = jumlah * hargaSatuan;
      detailResepData.push({
        resep_id: resepId,
        obat_id: obatId,
        dosis: faker.lorem.words(2),
        jumlah: jumlah,
        aturan_pakai: faker.lorem.sentence(),
        harga_satuan: hargaSatuan,
        subtotal: subtotal,
      });
    }
  }
  await knex.batchInsert('detail_resep', detailResepData, 1000);
  const detailResepIds = (await knex.select('detail_id').from('detail_resep')).map(row => row.detail_id);
  console.log(`Seeded ${detailResepIds.length} detail_resep.`);

  // 26. medical_record
  console.log('Seeding medical_record...');
  const medicalRecordData = [];
  for (let i = 0; i < NUM_MEDICAL_RECORD; i++) {
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
    const doctorId = faker.helpers.arrayElement(doctorIds);
    medicalRecordData.push({
      pasien_id: pasienId,
      konsultasi_id: konsultasiId,
      doctor_id: doctorId,
      tanggal_rekam: randomDate(new Date(2023, 0, 1), new Date()),
      anamnesis: faker.lorem.paragraph(),
      pemeriksaan_fisik: faker.lorem.paragraph(),
      pemeriksaan_penunjang: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
      diagnosa_utama: faker.lorem.sentence(),
      diagnosa_sekunder: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      terapi: faker.lorem.paragraph(),
      prognosis: faker.lorem.sentence(),
      follow_up: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      file_pendukung: faker.datatype.boolean() ? faker.image.url() : null,
    });
  }
  await knex.batchInsert('medical_record', medicalRecordData, 1000);
  const medicalRecordIds = (await knex.select('record_id').from('medical_record')).map(row => row.record_id);
  console.log(`Seeded ${medicalRecordIds.length} medical_record.`);

  // 27. vital_signs
  console.log('Seeding vital_signs...');
  const vitalSignsData = [];
  for (let i = 0; i < NUM_VITAL_SIGNS; i++) {
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
    const bb = faker.number.float({ min: 40, max: 100, precision: 0.01 });
    const tb = faker.number.float({ min: 150, max: 190, precision: 0.01 });
    const bmi = bb / ((tb / 100) * (tb / 100));
    vitalSignsData.push({
      pasien_id: pasienId,
      konsultasi_id: konsultasiId,
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
      catatan: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    });
  }
  await knex.batchInsert('vital_signs', vitalSignsData, 1000);
  const vitalSignsIds = (await knex.select('vital_id').from('vital_signs')).map(row => row.vital_id);
  console.log(`Seeded ${vitalSignsIds.length} vital_signs.`);

  // 28. notifikasi
  console.log('Seeding notifikasi...');
  const notifikasiData = [];
  const tipeNotifikasiOptions = ['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo'];
  for (let i = 0; i < NUM_NOTIFIKASI; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    notifikasiData.push({
      user_id: userId,
      judul: faker.lorem.sentence(3),
      isi: faker.lorem.paragraph(),
      tipe: faker.helpers.arrayElement(tipeNotifikasiOptions),
      data_payload: JSON.stringify({ id: faker.string.uuid(), type: faker.lorem.word() }),
      is_read: faker.datatype.boolean(),
      is_push: faker.datatype.boolean(),
      created_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('notifikasi', notifikasiData, 1000);
  const notifikasiIds = (await knex.select('notifikasi_id').from('notifikasi')).map(row => row.notifikasi_id);
  console.log(`Seeded ${notifikasiIds.length} notifikasi.`);

  // 29. review_rating
  console.log('Seeding review_rating...');
  const reviewRatingData = [];
  const reviewTypeOptions = ['doctor', 'apotek', 'kurir', 'aplikasi'];
  for (let i = 0; i < NUM_REVIEW_RATING; i++) {
    const konsultasiId = faker.helpers.arrayElement(konsultasiIds);
    const reviewerId = faker.helpers.arrayElement(userIds);
    const reviewedId = faker.helpers.arrayElement(userIds);
    reviewRatingData.push({
      konsultasi_id: konsultasiId,
      reviewer_id: reviewerId,
      reviewed_id: reviewedId,
      rating: faker.number.int({ min: 1, max: 5 }),
      review_text: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      review_type: faker.helpers.arrayElement(reviewTypeOptions),
      is_anonymous: faker.datatype.boolean(),
      created_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('review_rating', reviewRatingData, 1000);
  const reviewRatingIds = (await knex.select('review_id').from('review_rating')).map(row => row.review_id);
  console.log(`Seeded ${reviewRatingIds.length} review_rating.`);

  // 30. feedback
  console.log('Seeding feedback...');
  const feedbackData = [];
  const tipeFeedbackOptions = ['bug', 'suggestion', 'complaint', 'praise'];
  const statusFeedbackOptions = ['open', 'in_progress', 'resolved', 'closed'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];
  for (let i = 0; i < NUM_FEEDBACK; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    feedbackData.push({
      user_id: userId,
      tipe_feedback: faker.helpers.arrayElement(tipeFeedbackOptions),
      judul: faker.lorem.sentence(4),
      deskripsi: faker.lorem.paragraph(),
      screenshot: faker.datatype.boolean() ? faker.image.url() : null,
      status: faker.helpers.arrayElement(statusFeedbackOptions),
      priority: faker.helpers.arrayElement(priorityOptions),
      admin_response: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      created_at: randomDate(new Date(2024, 0, 1), new Date()),
      updated_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('feedback', feedbackData, 1000);
  const feedbackIds = (await knex.select('feedback_id').from('feedback')).map(row => row.feedback_id);
  console.log(`Seeded ${feedbackIds.length} feedback.`);

  // 32. jadwal_doctor
  console.log('Seeding jadwal_doctor...');
  const jadwalDoctorData = [];
  const hariOptions = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  for (let i = 0; i < NUM_JADWAL_DOCTOR; i++) {
    const doctorId = faker.helpers.arrayElement(doctorIds);
    const jamMulai = randomTime();
    const jamSelesai = randomTime();
    jadwalDoctorData.push({
      doctor_id: doctorId,
      hari: faker.helpers.arrayElement(hariOptions),
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      quota_pasien: faker.number.int({ min: 1, max: 20 }),
      is_available: faker.datatype.boolean(),
      catatan: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    });
  }
  await knex.batchInsert('jadwal_doctor', jadwalDoctorData, 1000);
  const jadwalDoctorIds = (await knex.select('jadwal_id').from('jadwal_doctor')).map(row => row.jadwal_id);
  console.log(`Seeded ${jadwalDoctorIds.length} jadwal_doctor.`);

  // 33. appointment
  console.log('Seeding appointment...');
  const appointmentData = [];
  const statusAppointmentOptions = ['scheduled', 'confirmed', 'cancelled', 'completed'];
  for (let i = 0; i < NUM_APPOINTMENT; i++) {
    const pasienId = faker.helpers.arrayElement(pasienIds);
    const doctorId = faker.helpers.arrayElement(doctorIds);
    const tanggalAppointment = randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1));
    const jamAppointment = randomTime();
    appointmentData.push({
      pasien_id: pasienId,
      doctor_id: doctorId,
      tanggal_appointment: tanggalAppointment,
      jam_appointment: jamAppointment,
      keluhan: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(statusAppointmentOptions),
      reminder_sent: faker.datatype.boolean(),
      created_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('appointment', appointmentData, 1000);
  const appointmentIds = (await knex.select('appointment_id').from('appointment')).map(row => row.appointment_id);
  console.log(`Seeded ${appointmentIds.length} appointment.`);

  // 34. logs
  console.log('Seeding logs...');
  const logsData = [];
  const tableNames = ['users', 'pasien', 'doctor', 'obat', 'konsultasi', 'resep', 'pembayaran'];
  for (let i = 0; i < NUM_LOGS; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const tableName = faker.helpers.arrayElement(tableNames);
    logsData.push({
      user_id: userId,
      action: faker.lorem.word() + ' ' + faker.lorem.word(),
      table_name: tableName,
      record_id: faker.number.int({ min: 1, max: 1000 }), // Assuming record IDs are within this range
      old_data: faker.datatype.boolean() ? JSON.stringify({ old_value: faker.lorem.word() }) : null,
      new_data: faker.datatype.boolean() ? JSON.stringify({ new_value: faker.lorem.word() }) : null,
      ip_address: faker.internet.ip(),
      user_agent: faker.internet.userAgent(),
      created_at: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  await knex.batchInsert('logs', logsData, 1000);
  const logIds = (await knex.select('log_id').from('logs')).map(row => row.log_id);
  console.log(`Seeded ${logIds.length} logs.`);

  // Export IDs for subsequent seed files
  global.konsultasiIds = konsultasiIds;
  global.resepIds = resepIds;
  global.pembayaranIds = pembayaranIds;
  global.userPromoIds = userPromoIds;
  global.stokObatIds = stokObatIds;
  global.pengirimanIds = pengirimanIds;
  global.detailResepIds = detailResepIds;
  global.medicalRecordIds = medicalRecordIds;
  global.vitalSignsIds = vitalSignsIds;
  global.notifikasiIds = notifikasiIds;
  global.reviewRatingIds = reviewRatingIds;
  global.feedbackIds = feedbackIds;
  global.jadwalDoctorIds = jadwalDoctorIds;
  global.appointmentIds = appointmentIds;
  global.logIds = logIds;
};
