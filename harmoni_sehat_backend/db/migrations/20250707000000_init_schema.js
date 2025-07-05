/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // From 20250705001603_create_all_tables.js
  await knex.schema.createTable('provinsi', function(table) {
    table.increments('provinsi_id').primary();
    table.string('nama_provinsi', 255).notNullable().unique();
    table.string('kode_provinsi', 10).unique();
    table.boolean('is_active').defaultTo(true);
  });

  await knex.schema.createTable('kota', function(table) {
    table.increments('kota_id').primary();
    table.integer('provinsi_id').unsigned().notNullable();
    table.string('nama_kota', 255).notNullable();
    table.string('kode_kota', 10).unique();
    table.boolean('is_active').defaultTo(true);
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('users', function(table) {
    table.increments('user_id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('phone', 20);
    table.enum('role', ['pasien', 'doctor', 'apoteker', 'admin']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('last_login').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('admin', function(table) {
    table.increments('admin_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.enum('level_akses', ['super_admin', 'admin', 'moderator']).notNullable();
    table.string('foto_profil', 255);
    table.string('departemen', 100);
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('apotek', function(table) {
    table.increments('apotek_id').primary();
    table.string('nama_apotek', 255).notNullable();
    table.text('alamat');
    table.string('no_telepon', 20);
    table.string('email', 255).unique();
    table.time('jam_buka');
    table.time('jam_tutup');
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('foto_apotek', 255);
    table.boolean('is_24_jam').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.decimal('rating', 3, 2).defaultTo(0.00);
  });

  await knex.schema.createTable('apoteker', function(table) {
    table.increments('apoteker_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.string('no_sipa', 50).unique();
    table.integer('apotek_id').unsigned();
    table.boolean('is_verified').defaultTo(false);
    table.string('foto_profil', 255);
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('kategori_artikel', function(table) {
    table.increments('kategori_id').primary();
    table.string('nama_kategori', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.boolean('is_active').defaultTo(true);
  });

  await knex.schema.createTable('artikel_kesehatan', function(table) {
    table.increments('artikel_id').primary();
    table.string('judul', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('konten');
    table.integer('kategori_artikel_id').unsigned();
    table.string('penulis', 255);
    table.string('gambar_utama', 255);
    table.json('tags');
    table.text('meta_description');
    table.integer('views').defaultTo(0);
    table.integer('likes').defaultTo(0);
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_published').defaultTo(false);
    table.dateTime('tanggal_publish');
    table.timestamps(true, true);
    table.foreign('kategori_artikel_id').references('kategori_artikel.kategori_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('faq', function(table) {
    table.increments('faq_id').primary();
    table.text('pertanyaan').notNullable();
    table.text('jawaban').notNullable();
    table.string('kategori', 100);
    table.integer('urutan').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.integer('views').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('kategori_obat', function(table) {
    table.increments('kategori_id').primary();
    table.string('nama_kategori', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.boolean('is_active').defaultTo(true);
  });

  await knex.schema.createTable('kurir', function(table) {
    table.increments('kurir_id').primary();
    table.string('nama_kurir', 255).notNullable();
    table.string('no_telepon', 20).unique();
    table.string('email', 255).unique();
    table.enum('kendaraan', ['motor', 'mobil', 'sepeda']);
    table.string('nomor_plat', 20);
    table.string('foto_profil', 255);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.boolean('is_active').defaultTo(true);
    table.json('area_layanan');
  });

  await knex.schema.createTable('logs', function(table) {
    table.increments('log_id').primary();
    table.integer('user_id').unsigned();
    table.string('action', 255).notNullable();
    table.string('table_name', 255);
    table.integer('record_id');
    table.json('old_data');
    table.json('new_data');
    table.string('ip_address', 45);
    table.text('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('obat', function(table) {
    table.increments('obat_id').primary();
    table.string('nama_obat', 255).notNullable();
    table.string('nama_generik', 255);
    table.integer('kategori_obat_id').unsigned();
    table.enum('bentuk_obat', ['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes']);
    table.text('kandungan');
    table.text('deskripsi');
    table.text('indikasi');
    table.text('kontraindikasi');
    table.text('efek_samping');
    table.text('dosis_dewasa');
    table.text('dosis_anak');
    table.text('cara_penyimpanan');
    table.string('nomor_bpom', 50);
    table.string('produsen', 255);
    table.decimal('harga', 10, 2);
    table.string('foto_obat', 255);
    table.boolean('is_resep_dokter').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.foreign('kategori_obat_id').references('kategori_obat.kategori_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('pasien', function(table) {
    table.increments('pasien_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.date('tanggal_lahir');
    table.enum('jenis_kelamin', ['L', 'P']);
    table.text('alamat');
    table.string('no_ktp', 20).unique();
    table.string('golongan_darah', 5);
    table.text('riwayat_alergi');
    table.string('kontak_darurat', 20);
    table.string('foto_profil', 255);
    table.decimal('berat_badan', 5, 2);
    table.decimal('tinggi_badan', 5, 2);
    table.integer('provinsi_id').unsigned();
    table.integer('kota_id').unsigned();
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('kota_id').references('kota.kota_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('promo', function(table) {
    table.increments('promo_id').primary();
    table.string('kode_promo', 50).notNullable().unique();
    table.string('nama_promo', 255).notNullable();
    table.text('deskripsi');
    table.enum('tipe_diskon', ['percentage', 'fixed_amount', 'free_shipping']).notNullable();
    table.decimal('nilai_diskon', 10, 2).notNullable();
    table.decimal('minimum_pembelian', 10, 2).defaultTo(0.00);
    table.decimal('maksimum_diskon', 10, 2);
    table.dateTime('tanggal_mulai').notNullable();
    table.dateTime('tanggal_berakhir').notNullable();
    table.integer('quota_penggunaan');
    table.integer('sudah_digunakan').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.string('banner_promo', 255);
  });

  await knex.schema.createTable('rumah_sakit', function(table) {
    table.increments('rumah_sakit_id').primary();
    table.string('nama_rumah_sakit', 255).notNullable();
    table.text('alamat');
    table.string('no_telepon', 20);
    table.string('email', 255).unique();
    table.string('website', 255);
    table.enum('tipe_rumah_sakit', ['pemerintah', 'swasta', 'militer']);
    table.enum('kelas_rumah_sakit', ['A', 'B', 'C', 'D']);
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('foto_rumah_sakit', 255);
    table.boolean('is_active').defaultTo(true);
  });

  await knex.schema.createTable('spesialisasi', function(table) {
    table.increments('spesialisasi_id').primary();
    table.string('nama_spesialisasi', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.boolean('is_active').defaultTo(true);
  });

  await knex.schema.createTable('doctor', function(table) {
    table.increments('doctor_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.string('no_sip', 50).unique();
    table.integer('spesialisasi_id').unsigned();
    table.integer('pengalaman_tahun');
    table.decimal('tarif_konsultasi', 10, 2);
    table.integer('rumah_sakit_id').unsigned();
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_konsultasi').defaultTo(0);
    table.boolean('is_verified').defaultTo(false);
    table.string('foto_profil', 255);
    table.string('alumnus', 255);
    table.text('bio');
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('spesialisasi_id').references('spesialisasi.spesialisasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('rumah_sakit_id').references('rumah_sakit.rumah_sakit_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('konsultasi', function(table) {
    table.increments('konsultasi_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.text('keluhan_utama');
    table.text('riwayat_penyakit');
    table.text('gejala');
    table.dateTime('tanggal_konsultasi').notNullable();
    table.text('diagnosa');
    table.text('tindakan');
    table.text('catatan_dokter');
    table.enum('status', ['pending', 'ongoing', 'completed', 'cancelled']).notNullable();
    table.enum('jenis_konsultasi', ['chat', 'video_call', 'voice_call']).notNullable();
    table.integer('durasi_konsultasi');
    table.decimal('biaya', 10, 2);
    table.integer('rating_pasien');
    table.text('review_pasien');
    table.integer('rating_dokter');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('resep', function(table) {
    table.increments('resep_id').primary();
    table.integer('konsultasi_id').unsigned().unique();
    table.integer('doctor_id').unsigned().notNullable();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('apotek_id').unsigned();
    table.string('kode_resep', 50).notNullable().unique();
    table.dateTime('tanggal_resep').defaultTo(knex.fn.now());
    table.dateTime('tanggal_kadaluarsa');
    table.text('catatan_resep');
    table.enum('status', ['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled']).notNullable();
    table.decimal('total_harga', 10, 2);
    table.decimal('biaya_pengiriman', 10, 2);
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('pembayaran', function(table) {
    table.increments('pembayaran_id').primary();
    table.integer('konsultasi_id').unsigned().unique();
    table.integer('resep_id').unsigned().unique();
    table.integer('pasien_id').unsigned().notNullable();
    table.string('kode_pembayaran', 50).notNullable().unique();
    table.enum('jenis_pembayaran', ['konsultasi', 'obat', 'keduanya']).notNullable();
    table.decimal('jumlah_bayar', 10, 2).notNullable();
    table.decimal('biaya_admin', 10, 2).defaultTo(0.00);
    table.decimal('total_bayar', 10, 2).notNullable();
    table.enum('metode_pembayaran', ['transfer', 'ewallet', 'va', 'kartu_kredit', 'cod']).notNullable();
    table.enum('status_pembayaran', ['pending', 'success', 'failed', 'refunded', 'expired']).notNullable();
    table.dateTime('tanggal_pembayaran').defaultTo(knex.fn.now());
    table.dateTime('tanggal_kadaluarsa');
    table.string('payment_gateway_id', 255);
    table.string('bukti_pembayaran', 255);
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('resep_id').references('resep.resep_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('user_promo', function(table) {
    table.increments('user_promo_id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('promo_id').unsigned().notNullable();
    table.integer('pembayaran_id').unsigned().unique();
    table.dateTime('tanggal_digunakan').defaultTo(knex.fn.now());
    table.decimal('nilai_diskon_diterima', 10, 2);
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('promo_id').references('promo.promo_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('pembayaran_id').references('pembayaran.pembayaran_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('system_settings', function(table) {
    table.increments('setting_id').primary();
    table.string('setting_key', 255).notNullable().unique();
    table.text('setting_value');
    table.enum('setting_type', ['string', 'number', 'boolean', 'json']).notNullable();
    table.text('description');
    table.boolean('is_public').defaultTo(false);
    table.timestamps(false, true);
  });

  await knex.schema.createTable('stok_obat', function(table) {
    table.increments('stok_id').primary();
    table.integer('obat_id').unsigned().notNullable();
    table.integer('apotek_id').unsigned().notNullable();
    table.integer('jumlah_stok').notNullable();
    table.integer('stok_minimum').defaultTo(0);
    table.date('tanggal_kadaluarsa');
    table.decimal('harga_jual', 10, 2);
    table.boolean('is_available').defaultTo(true);
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.foreign('obat_id').references('obat.obat_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('pengiriman', function(table) {
    table.increments('pengiriman_id').primary();
    table.integer('resep_id').unsigned().notNullable().unique();
    table.integer('kurir_id').unsigned();
    table.text('alamat_pengiriman').notNullable();
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.dateTime('tanggal_kirim');
    table.dateTime('estimasi_tiba');
    table.dateTime('tanggal_terima');
    table.enum('status_pengiriman', ['pending', 'picked_up', 'on_delivery', 'delivered', 'returned']).notNullable();
    table.text('catatan_pengiriman');
    table.string('foto_bukti_terima', 255);
    table.decimal('biaya_pengiriman', 10, 2);
    table.foreign('resep_id').references('resep.resep_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('kurir_id').references('kurir.kurir_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('detail_resep', function(table) {
    table.increments('detail_id').primary();
    table.integer('resep_id').unsigned().notNullable();
    table.integer('obat_id').unsigned().notNullable();
    table.string('dosis', 100);
    table.integer('jumlah').notNullable();
    table.text('aturan_pakai');
    table.decimal('harga_satuan', 10, 2);
    table.decimal('subtotal', 10, 2);
    table.foreign('resep_id').references('resep.resep_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('obat_id').references('obat.obat_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('medical_record', function(table) {
    table.increments('record_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('konsultasi_id').unsigned().unique();
    table.integer('doctor_id').unsigned().notNullable();
    table.date('tanggal_rekam').notNullable();
    table.text('anamnesis');
    table.text('pemeriksaan_fisik');
    table.text('pemeriksaan_penunjang');
    table.text('diagnosa_utama');
    table.text('diagnosa_sekunder');
    table.text('terapi');
    table.text('prognosis');
    table.text('follow_up');
    table.string('file_pendukung', 255);
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('vital_signs', function(table) {
    table.increments('vital_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('konsultasi_id').unsigned();
    table.dateTime('tanggal_periksa').defaultTo(knex.fn.now());
    table.integer('tekanan_darah_sistolik');
    table.integer('tekanan_darah_diastolik');
    table.integer('denyut_nadi');
    table.decimal('suhu_tubuh', 4, 2);
    table.integer('respiratory_rate');
    table.decimal('berat_badan', 5, 2);
    table.decimal('tinggi_badan', 5, 2);
    table.decimal('bmi', 4, 2);
    table.decimal('saturasi_oksigen', 4, 2);
    table.text('catatan');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('notifikasi', function(table) {
    table.increments('notifikasi_id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('judul', 255).notNullable();
    table.text('isi');
    table.enum('tipe', ['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo']).notNullable();
    table.json('data_payload');
    table.boolean('is_read').defaultTo(false);
    table.boolean('is_push').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('review_rating', function(table) {
    table.increments('review_id').primary();
    table.integer('konsultasi_id').unsigned();
    table.integer('reviewer_id').unsigned().notNullable();
    table.integer('reviewed_id').unsigned().notNullable();
    table.integer('rating').notNullable(); // CHECK (rating >= 1 AND rating <= 5) will be handled by application logic or direct SQL
    table.text('review_text');
    table.enum('review_type', ['doctor', 'apotek', 'kurir', 'aplikasi']).notNullable();
    table.boolean('is_anonymous').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('reviewer_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('reviewed_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('feedback', function(table) {
    table.increments('feedback_id').primary();
    table.integer('user_id').unsigned();
    table.enum('tipe_feedback', ['bug', 'suggestion', 'complaint', 'praise']).notNullable();
    table.string('judul', 255);
    table.text('deskripsi');
    table.string('screenshot', 255);
    table.enum('status', ['open', 'in_progress', 'resolved', 'closed']).notNullable().defaultTo('open');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).notNullable().defaultTo('medium');
    table.text('admin_response');
    table.timestamps(true, true);
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('chat_messages', function(table) {
    table.increments('message_id').primary();
    table.integer('konsultasi_id').unsigned().notNullable();
    table.integer('sender_id').unsigned().notNullable();
    table.text('message_text');
    table.enum('message_type', ['text', 'image', 'file', 'voice', 'video']).notNullable();
    table.string('file_path', 255);
    table.integer('file_size');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.boolean('is_read').defaultTo(false);
    table.boolean('is_edited').defaultTo(false);
    table.integer('reply_to_message_id').unsigned();
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('sender_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('reply_to_message_id').references('chat_messages.message_id').onDelete('SET NULL').onUpdate('CASCADE');
  });

  await knex.schema.createTable('jadwal_doctor', function(table) {
    table.increments('jadwal_id').primary();
    table.integer('doctor_id').unsigned().notNullable();
    table.enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']).notNullable();
    table.time('jam_mulai').notNullable();
    table.time('jam_selesai').notNullable();
    table.integer('quota_pasien');
    table.boolean('is_available').defaultTo(true);
    table.text('catatan');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  await knex.schema.createTable('appointment', function(table) {
    table.increments('appointment_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.date('tanggal_appointment').notNullable();
    table.time('jam_appointment').notNullable();
    table.text('keluhan');
    table.enum('status', ['scheduled', 'confirmed', 'cancelled', 'completed']).notNullable();
    table.boolean('reminder_sent').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
  });

  // From 20250705090309_create_klinik_table.js
  await knex.schema.createTable('klinik', function(table) {
    table.increments('klinik_id').primary();
    table.string('nama_klinik', 255).notNullable();
    table.text('alamat');
    table.string('no_telepon', 20);
    table.string('email', 255).unique();
    table.time('jam_buka');
    table.time('jam_tutup');
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('foto_klinik', 255);
    table.boolean('is_24_jam').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.enum('tipe_klinik', ['pratama', 'utama']);
  });

  // From 20250706120000_add_reset_token_to_users.js
  await knex.schema.table('users', function(table) {
    table.string('password_reset_token');
    table.timestamp('password_reset_expires');
    table.string('provider').nullable();
    table.string('provider_id').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop tables in reverse order of creation
  await knex.schema.dropTableIfExists('klinik');
  await knex.schema.dropTableIfExists('appointment');
  await knex.schema.dropTableIfExists('jadwal_doctor');
  await knex.schema.dropTableIfExists('chat_messages');
  await knex.schema.dropTableIfExists('feedback');
  await knex.schema.dropTableIfExists('review_rating');
  await knex.schema.dropTableIfExists('notifikasi');
  await knex.schema.dropTableIfExists('vital_signs');
  await knex.schema.dropTableIfExists('medical_record');
  await knex.schema.dropTableIfExists('detail_resep');
  await knex.schema.dropTableIfExists('pengiriman');
  await knex.schema.dropTableIfExists('stok_obat');
  await knex.schema.dropTableIfExists('system_settings');
  await knex.schema.dropTableIfExists('user_promo');
  await knex.schema.dropTableIfExists('pembayaran');
  await knex.schema.dropTableIfExists('resep');
  await knex.schema.dropTableIfExists('konsultasi');
  await knex.schema.dropTableIfExists('doctor');
  await knex.schema.dropTableIfExists('spesialisasi');
  await knex.schema.dropTableIfExists('rumah_sakit');
  await knex.schema.dropTableIfExists('promo');
  await knex.schema.dropTableIfExists('pasien');
  await knex.schema.dropTableIfExists('obat');
  await knex.schema.dropTableIfExists('logs');
  await knex.schema.dropTableIfExists('kurir');
  await knex.schema.dropTableIfExists('kategori_obat');
  await knex.schema.dropTableIfExists('faq');
  await knex.schema.dropTableIfExists('artikel_kesehatan');
  await knex.schema.dropTableIfExists('kategori_artikel');
  await knex.schema.dropTableIfExists('apoteker');
  await knex.schema.dropTableIfExists('apotek');
  await knex.schema.dropTableIfExists('admin');
  await knex.schema.dropTableIfExists('users'); // The users table is dropped last among the main tables
  await knex.schema.dropTableIfExists('kota');
  await knex.schema.dropTableIfExists('provinsi');
};
