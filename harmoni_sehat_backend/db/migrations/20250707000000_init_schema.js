/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create provinsi table with enhanced validation
  await knex.schema.createTable('provinsi', function(table) {
    table.increments('provinsi_id').primary();
    table.string('nama_provinsi', 255).notNullable().unique();
    table.string('kode_provinsi', 10).unique();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Add indexes for performance
    table.index('nama_provinsi');
    table.index('kode_provinsi');
    table.index('is_active');
  });

  // Create kota table with enhanced validation
  await knex.schema.createTable('kota', function(table) {
    table.increments('kota_id').primary();
    table.integer('provinsi_id').unsigned().notNullable();
    table.string('nama_kota', 255).notNullable();
    table.string('kode_kota', 10).unique();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Foreign key with proper constraints
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes for performance
    table.index('provinsi_id');
    table.index('nama_kota');
    table.index('kode_kota');
    table.index('is_active');
    
    // Composite unique constraint
    table.unique(['provinsi_id', 'nama_kota']);
  });

  // Create users table with enhanced security and validation
  await knex.schema.createTable('users', function(table) {
    table.increments('user_id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('phone', 20);
    table.enum('role', ['pasien', 'doctor', 'apoteker', 'admin']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('last_login').nullable();
    table.string('password_reset_token');
    table.timestamp('password_reset_expires');
    table.string('provider').nullable();
    table.string('provider_id').nullable();
    table.integer('login_attempts').defaultTo(0);
    table.timestamp('locked_until').nullable();
    table.string('verification_token');
    table.timestamp('verification_expires');
    table.timestamps(true, true);
    
    // Indexes for performance and security
    table.index('email');
    table.index('phone');
    table.index('role');
    table.index('is_active');
    table.index('is_verified');
    table.index('password_reset_token');
    table.index('verification_token');
    table.index(['provider', 'provider_id']);
  });

  // Create admin table with enhanced role management
  await knex.schema.createTable('admin', function(table) {
    table.increments('admin_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.enum('level_akses', ['super_admin', 'admin', 'moderator']).notNullable();
    table.string('foto_profil', 255);
    table.string('departemen', 100);
    table.json('permissions').defaultTo('[]');
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('level_akses');
    table.index('departemen');
  });

  // Create apotek table with enhanced location and operational data
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
    table.integer('total_reviews').defaultTo(0);
    table.string('no_sipa', 50);
    table.string('pemilik', 255);
    table.integer('provinsi_id').unsigned();
    table.integer('kota_id').unsigned();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('kota_id').references('kota.kota_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('nama_apotek');
    table.index('email');
    table.index('is_active');
    table.index('is_24_jam');
    table.index('rating');
    table.index(['koordinat_lat', 'koordinat_lng']);
    table.index(['provinsi_id', 'kota_id']);
  });

  // Create apoteker table with enhanced professional data
  await knex.schema.createTable('apoteker', function(table) {
    table.increments('apoteker_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.string('no_sipa', 50).unique();
    table.integer('apotek_id').unsigned();
    table.boolean('is_verified').defaultTo(false);
    table.string('foto_profil', 255);
    table.string('alamat', 500);
    table.date('tanggal_lahir');
    table.enum('jenis_kelamin', ['L', 'P']);
    table.string('pendidikan', 255);
    table.integer('pengalaman_tahun').defaultTo(0);
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('no_sipa');
    table.index('apotek_id');
    table.index('is_verified');
  });

  // Create kategori_artikel table
  await knex.schema.createTable('kategori_artikel', function(table) {
    table.increments('kategori_id').primary();
    table.string('nama_kategori', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.string('color', 7).defaultTo('#3B82F6');
    table.integer('urutan').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('nama_kategori');
    table.index('is_active');
    table.index('urutan');
  });

  // Create artikel_kesehatan table with enhanced content management
  await knex.schema.createTable('artikel_kesehatan', function(table) {
    table.increments('artikel_id').primary();
    table.string('judul', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('ringkasan');
    table.text('konten');
    table.integer('kategori_artikel_id').unsigned();
    table.integer('penulis_id').unsigned();
    table.string('penulis', 255);
    table.string('gambar_utama', 255);
    table.json('galeri_gambar').defaultTo('[]');
    table.json('tags').defaultTo('[]');
    table.text('meta_description');
    table.string('meta_keywords', 500);
    table.integer('views').defaultTo(0);
    table.integer('likes').defaultTo(0);
    table.integer('shares').defaultTo(0);
    table.integer('waktu_baca').defaultTo(5); // in minutes
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_published').defaultTo(false);
    table.enum('status', ['draft', 'review', 'published', 'archived']).defaultTo('draft');
    table.dateTime('tanggal_publish');
    table.timestamps(true, true);
    
    table.foreign('kategori_artikel_id').references('kategori_artikel.kategori_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('penulis_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('slug');
    table.index('kategori_artikel_id');
    table.index('penulis_id');
    table.index('is_published');
    table.index('is_featured');
    table.index('status');
    table.index('tanggal_publish');
    table.index('views');
    table.index('likes');
  });

  // Create faq table with enhanced organization
  await knex.schema.createTable('faq', function(table) {
    table.increments('faq_id').primary();
    table.text('pertanyaan').notNullable();
    table.text('jawaban').notNullable();
    table.string('kategori', 100);
    table.integer('urutan').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.integer('views').defaultTo(0);
    table.integer('helpful_count').defaultTo(0);
    table.integer('not_helpful_count').defaultTo(0);
    table.json('tags').defaultTo('[]');
    table.timestamps(true, true);
    
    // Indexes
    table.index('kategori');
    table.index('is_active');
    table.index('urutan');
    table.index('views');
  });

  // Create kategori_obat table
  await knex.schema.createTable('kategori_obat', function(table) {
    table.increments('kategori_id').primary();
    table.string('nama_kategori', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.string('color', 7).defaultTo('#10B981');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('nama_kategori');
    table.index('is_active');
  });

  // Create kurir table with enhanced delivery capabilities
  await knex.schema.createTable('kurir', function(table) {
    table.increments('kurir_id').primary();
    table.string('nama_kurir', 255).notNullable();
    table.string('no_telepon', 20).unique();
    table.string('email', 255).unique();
    table.enum('kendaraan', ['motor', 'mobil', 'sepeda']).notNullable();
    table.string('nomor_plat', 20);
    table.string('foto_profil', 255);
    table.string('foto_kendaraan', 255);
    table.string('foto_stnk', 255);
    table.string('foto_sim', 255);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_reviews').defaultTo(0);
    table.integer('total_pengiriman').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_online').defaultTo(false);
    table.json('area_layanan').defaultTo('[]');
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.timestamps(true, true);
    
    // Indexes
    table.index('nama_kurir');
    table.index('no_telepon');
    table.index('email');
    table.index('is_active');
    table.index('is_verified');
    table.index('is_online');
    table.index('rating');
    table.index(['koordinat_lat', 'koordinat_lng']);
  });

  // Create logs table with enhanced tracking
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
    table.enum('level', ['info', 'warning', 'error', 'debug']).defaultTo('info');
    table.string('module', 100);
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('action');
    table.index('table_name');
    table.index('level');
    table.index('module');
    table.index('created_at');
  });

  // Create obat table with comprehensive medication data
  await knex.schema.createTable('obat', function(table) {
    table.increments('obat_id').primary();
    table.string('nama_obat', 255).notNullable();
    table.string('nama_generik', 255);
    table.integer('kategori_obat_id').unsigned();
    table.enum('bentuk_obat', ['tablet', 'kapsul', 'sirup', 'salep', 'injeksi', 'tetes', 'gel', 'spray', 'inhaler']).notNullable();
    table.string('kemasan', 100);
    table.text('kandungan');
    table.text('deskripsi');
    table.text('indikasi');
    table.text('kontraindikasi');
    table.text('efek_samping');
    table.text('dosis_dewasa');
    table.text('dosis_anak');
    table.text('cara_pakai');
    table.text('cara_penyimpanan');
    table.text('peringatan');
    table.string('nomor_bpom', 50);
    table.string('produsen', 255);
    table.decimal('harga', 10, 2);
    table.string('foto_obat', 255);
    table.json('galeri_foto').defaultTo('[]');
    table.boolean('is_resep_dokter').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.date('tanggal_kadaluarsa');
    table.string('barcode', 50);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_reviews').defaultTo(0);
    table.timestamps(true, true);
    
    table.foreign('kategori_obat_id').references('kategori_obat.kategori_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('nama_obat');
    table.index('nama_generik');
    table.index('kategori_obat_id');
    table.index('bentuk_obat');
    table.index('produsen');
    table.index('nomor_bpom');
    table.index('is_resep_dokter');
    table.index('is_active');
    table.index('barcode');
    table.index('rating');
  });

  // Create pasien table with comprehensive patient data
  await knex.schema.createTable('pasien', function(table) {
    table.increments('pasien_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.date('tanggal_lahir');
    table.enum('jenis_kelamin', ['L', 'P']);
    table.text('alamat');
    table.string('no_ktp', 20).unique();
    table.string('no_bpjs', 20).unique();
    table.enum('golongan_darah', ['A', 'B', 'AB', 'O']).nullable();
    table.enum('rhesus', ['+', '-']).nullable();
    table.text('riwayat_alergi');
    table.text('riwayat_penyakit');
    table.string('kontak_darurat', 20);
    table.string('nama_kontak_darurat', 255);
    table.string('hubungan_kontak_darurat', 100);
    table.string('foto_profil', 255);
    table.decimal('berat_badan', 5, 2);
    table.decimal('tinggi_badan', 5, 2);
    table.integer('provinsi_id').unsigned();
    table.integer('kota_id').unsigned();
    table.string('pekerjaan', 100);
    table.enum('status_pernikahan', ['single', 'married', 'divorced', 'widowed']);
    table.string('agama', 50);
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('kota_id').references('kota.kota_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('no_ktp');
    table.index('no_bpjs');
    table.index('provinsi_id');
    table.index('kota_id');
    table.index('jenis_kelamin');
    table.index('golongan_darah');
  });

  // Create promo table with advanced promotional features
  await knex.schema.createTable('promo', function(table) {
    table.increments('promo_id').primary();
    table.string('kode_promo', 50).notNullable().unique();
    table.string('nama_promo', 255).notNullable();
    table.text('deskripsi');
    table.enum('tipe_diskon', ['percentage', 'fixed_amount', 'free_shipping', 'buy_one_get_one']).notNullable();
    table.decimal('nilai_diskon', 10, 2).notNullable();
    table.decimal('minimum_pembelian', 10, 2).defaultTo(0.00);
    table.decimal('maksimum_diskon', 10, 2);
    table.dateTime('tanggal_mulai').notNullable();
    table.dateTime('tanggal_berakhir').notNullable();
    table.integer('quota_penggunaan');
    table.integer('sudah_digunakan').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.string('banner_promo', 255);
    table.json('syarat_ketentuan').defaultTo('[]');
    table.json('target_user').defaultTo('[]');
    table.json('kategori_produk').defaultTo('[]');
    table.boolean('is_first_time_only').defaultTo(false);
    table.timestamps(true, true);
    
    // Indexes
    table.index('kode_promo');
    table.index('tipe_diskon');
    table.index('tanggal_mulai');
    table.index('tanggal_berakhir');
    table.index('is_active');
    table.index('is_first_time_only');
  });

  // Create rumah_sakit table
  await knex.schema.createTable('rumah_sakit', function(table) {
    table.increments('rumah_sakit_id').primary();
    table.string('nama_rumah_sakit', 255).notNullable();
    table.text('alamat');
    table.string('no_telepon', 20);
    table.string('email', 255).unique();
    table.string('website', 255);
    table.enum('tipe_rumah_sakit', ['pemerintah', 'swasta', 'militer']).notNullable();
    table.enum('kelas_rumah_sakit', ['A', 'B', 'C', 'D']).notNullable();
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('foto_rumah_sakit', 255);
    table.json('galeri_foto').defaultTo('[]');
    table.json('fasilitas').defaultTo('[]');
    table.json('layanan').defaultTo('[]');
    table.boolean('is_active').defaultTo(true);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_reviews').defaultTo(0);
    table.integer('provinsi_id').unsigned();
    table.integer('kota_id').unsigned();
    table.timestamps(true, true);
    
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('kota_id').references('kota.kota_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('nama_rumah_sakit');
    table.index('tipe_rumah_sakit');
    table.index('kelas_rumah_sakit');
    table.index('is_active');
    table.index('rating');
    table.index(['koordinat_lat', 'koordinat_lng']);
    table.index(['provinsi_id', 'kota_id']);
  });

  // Create klinik table
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
    table.json('galeri_foto').defaultTo('[]');
    table.json('fasilitas').defaultTo('[]');
    table.json('layanan').defaultTo('[]');
    table.boolean('is_24_jam').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_reviews').defaultTo(0);
    table.enum('tipe_klinik', ['pratama', 'utama']).notNullable();
    table.integer('provinsi_id').unsigned();
    table.integer('kota_id').unsigned();
    table.timestamps(true, true);
    
    table.foreign('provinsi_id').references('provinsi.provinsi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('kota_id').references('kota.kota_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('nama_klinik');
    table.index('tipe_klinik');
    table.index('is_active');
    table.index('is_24_jam');
    table.index('rating');
    table.index(['koordinat_lat', 'koordinat_lng']);
    table.index(['provinsi_id', 'kota_id']);
  });

  // Create spesialisasi table
  await knex.schema.createTable('spesialisasi', function(table) {
    table.increments('spesialisasi_id').primary();
    table.string('nama_spesialisasi', 255).notNullable().unique();
    table.text('deskripsi');
    table.string('icon', 255);
    table.string('color', 7).defaultTo('#6366F1');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('nama_spesialisasi');
    table.index('is_active');
  });

  // Create doctor table with comprehensive professional data
  await knex.schema.createTable('doctor', function(table) {
    table.increments('doctor_id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('nama_lengkap', 255).notNullable();
    table.string('no_sip', 50).unique();
    table.integer('spesialisasi_id').unsigned();
    table.integer('pengalaman_tahun').defaultTo(0);
    table.decimal('tarif_konsultasi', 10, 2);
    table.integer('rumah_sakit_id').unsigned();
    table.integer('klinik_id').unsigned();
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('total_reviews').defaultTo(0);
    table.integer('total_konsultasi').defaultTo(0);
    table.integer('total_pasien').defaultTo(0);
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_available').defaultTo(true);
    table.string('foto_profil', 255);
    table.string('alumnus', 255);
    table.text('bio');
    table.json('sertifikasi').defaultTo('[]');
    table.json('jadwal_praktek').defaultTo('[]');
    table.json('metode_konsultasi').defaultTo('["chat", "video_call", "voice_call"]');
    table.date('tanggal_lahir');
    table.enum('jenis_kelamin', ['L', 'P']);
    table.string('alamat', 500);
    table.string('no_str', 50);
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('spesialisasi_id').references('spesialisasi.spesialisasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('rumah_sakit_id').references('rumah_sakit.rumah_sakit_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('klinik_id').references('klinik.klinik_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('no_sip');
    table.index('no_str');
    table.index('spesialisasi_id');
    table.index('rumah_sakit_id');
    table.index('klinik_id');
    table.index('is_verified');
    table.index('is_available');
    table.index('rating');
    table.index('tarif_konsultasi');
  });

  // Create konsultasi table with enhanced consultation features
  await knex.schema.createTable('konsultasi', function(table) {
    table.increments('konsultasi_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.string('kode_konsultasi', 50).notNullable().unique();
    table.text('keluhan_utama');
    table.text('riwayat_penyakit');
    table.text('gejala');
    table.dateTime('tanggal_konsultasi').notNullable();
    table.dateTime('tanggal_selesai');
    table.text('anamnesis');
    table.text('diagnosa');
    table.text('tindakan');
    table.text('catatan_dokter');
    table.text('saran_dokter');
    table.enum('status', ['pending', 'ongoing', 'waiting_payment', 'completed', 'cancelled']).notNullable();
    table.enum('jenis_konsultasi', ['chat', 'video_call', 'voice_call']).notNullable();
    table.integer('durasi_konsultasi').defaultTo(0);
    table.decimal('biaya', 10, 2);
    table.decimal('biaya_admin', 10, 2).defaultTo(0);
    table.decimal('total_biaya', 10, 2);
    table.integer('rating_pasien');
    table.text('review_pasien');
    table.integer('rating_dokter');
    table.text('review_dokter');
    table.boolean('is_emergency').defaultTo(false);
    table.json('vital_signs');
    table.json('attachments').defaultTo('[]');
    table.timestamps(true, true);
    
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('pasien_id');
    table.index('doctor_id');
    table.index('kode_konsultasi');
    table.index('status');
    table.index('jenis_konsultasi');
    table.index('tanggal_konsultasi');
    table.index('is_emergency');
    table.index('rating_pasien');
    table.index('rating_dokter');
  });

  // Create resep table with enhanced prescription management
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
    table.text('aturan_umum');
    table.enum('status', ['pending', 'confirmed', 'processed', 'ready', 'delivered', 'cancelled']).notNullable();
    table.enum('jenis_resep', ['tunai', 'bpjs', 'asuransi']).defaultTo('tunai');
    table.decimal('total_harga', 10, 2);
    table.decimal('biaya_pengiriman', 10, 2);
    table.decimal('biaya_admin', 10, 2).defaultTo(0);
    table.decimal('total_bayar', 10, 2);
    table.boolean('is_urgent').defaultTo(false);
    table.text('alamat_pengiriman');
    table.json('koordinat_pengiriman');
    table.timestamps(true, true);
    
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('konsultasi_id');
    table.index('doctor_id');
    table.index('pasien_id');
    table.index('apotek_id');
    table.index('kode_resep');
    table.index('status');
    table.index('jenis_resep');
    table.index('tanggal_resep');
    table.index('is_urgent');
  });

  // Create pembayaran table with comprehensive payment management
  await knex.schema.createTable('pembayaran', function(table) {
    table.increments('pembayaran_id').primary();
    table.integer('konsultasi_id').unsigned();
    table.integer('resep_id').unsigned();
    table.integer('pasien_id').unsigned().notNullable();
    table.string('kode_pembayaran', 50).notNullable().unique();
    table.enum('jenis_pembayaran', ['konsultasi', 'obat', 'keduanya']).notNullable();
    table.decimal('jumlah_bayar', 10, 2).notNullable();
    table.decimal('biaya_admin', 10, 2).defaultTo(0.00);
    table.decimal('diskon', 10, 2).defaultTo(0.00);
    table.decimal('total_bayar', 10, 2).notNullable();
    table.enum('metode_pembayaran', ['transfer', 'ewallet', 'va', 'kartu_kredit', 'qris', 'cod']).notNullable();
    table.string('provider_pembayaran', 100);
    table.enum('status_pembayaran', ['pending', 'processing', 'success', 'failed', 'refunded', 'expired']).notNullable();
    table.dateTime('tanggal_pembayaran').defaultTo(knex.fn.now());
    table.dateTime('tanggal_kadaluarsa');
    table.dateTime('tanggal_berhasil');
    table.string('payment_gateway_id', 255);
    table.string('payment_gateway_response', 1000);
    table.string('virtual_account');
    table.string('qr_code');
    table.string('bukti_pembayaran', 255);
    table.text('catatan_pembayaran');
    table.decimal('fee_payment_gateway', 10, 2).defaultTo(0);
    table.timestamps(true, true);
    
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('resep_id').references('resep.resep_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('konsultasi_id');
    table.index('resep_id');
    table.index('pasien_id');
    table.index('kode_pembayaran');
    table.index('jenis_pembayaran');
    table.index('metode_pembayaran');
    table.index('status_pembayaran');
    table.index('tanggal_pembayaran');
    table.index('payment_gateway_id');
  });

  // Create user_promo table
  await knex.schema.createTable('user_promo', function(table) {
    table.increments('user_promo_id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('promo_id').unsigned().notNullable();
    table.integer('pembayaran_id').unsigned();
    table.dateTime('tanggal_digunakan').defaultTo(knex.fn.now());
    table.decimal('nilai_diskon_diterima', 10, 2);
    table.enum('status', ['used', 'expired', 'cancelled']).defaultTo('used');
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('promo_id').references('promo.promo_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('pembayaran_id').references('pembayaran.pembayaran_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('promo_id');
    table.index('pembayaran_id');
    table.index('status');
    table.index('tanggal_digunakan');
    
    // Unique constraint to prevent duplicate usage
    table.unique(['user_id', 'promo_id', 'pembayaran_id']);
  });

  // Create system_settings table
  await knex.schema.createTable('system_settings', function(table) {
    table.increments('setting_id').primary();
    table.string('setting_key', 255).notNullable().unique();
    table.text('setting_value');
    table.enum('setting_type', ['string', 'number', 'boolean', 'json', 'text']).notNullable();
    table.string('category', 100).defaultTo('general');
    table.text('description');
    table.boolean('is_public').defaultTo(false);
    table.boolean('is_editable').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('setting_key');
    table.index('category');
    table.index('is_public');
    table.index('is_editable');
  });

  // Create stok_obat table
  await knex.schema.createTable('stok_obat', function(table) {
    table.increments('stok_id').primary();
    table.integer('obat_id').unsigned().notNullable();
    table.integer('apotek_id').unsigned().notNullable();
    table.integer('jumlah_stok').notNullable();
    table.integer('stok_minimum').defaultTo(0);
    table.integer('stok_reserved').defaultTo(0);
    table.date('tanggal_kadaluarsa');
    table.decimal('harga_beli', 10, 2);
    table.decimal('harga_jual', 10, 2);
    table.decimal('margin_profit', 5, 2);
    table.string('batch_number', 50);
    table.boolean('is_available').defaultTo(true);
    table.timestamp('last_updated').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamps(true, true);
    
    table.foreign('obat_id').references('obat.obat_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('apotek_id').references('apotek.apotek_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('obat_id');
    table.index('apotek_id');
    table.index('is_available');
    table.index('tanggal_kadaluarsa');
    table.index('batch_number');
    table.index('jumlah_stok');
    
    // Unique constraint for drug-pharmacy combination
    table.unique(['obat_id', 'apotek_id', 'batch_number']);
  });

  // Create pengiriman table
  await knex.schema.createTable('pengiriman', function(table) {
    table.increments('pengiriman_id').primary();
    table.integer('resep_id').unsigned().notNullable().unique();
    table.integer('kurir_id').unsigned();
    table.text('alamat_pengiriman').notNullable();
    table.decimal('koordinat_lat', 10, 8);
    table.decimal('koordinat_lng', 11, 8);
    table.string('nama_penerima', 255).notNullable();
    table.string('no_telepon_penerima', 20).notNullable();
    table.dateTime('tanggal_kirim');
    table.dateTime('estimasi_tiba');
    table.dateTime('tanggal_terima');
    table.enum('status_pengiriman', ['pending', 'assigned', 'picked_up', 'on_delivery', 'delivered', 'returned', 'cancelled']).notNullable();
    table.text('catatan_pengiriman');
    table.text('catatan_kurir');
    table.string('foto_bukti_terima', 255);
    table.decimal('biaya_pengiriman', 10, 2);
    table.decimal('jarak_km', 8, 2);
    table.json('tracking_history').defaultTo('[]');
    table.string('no_resi', 50);
    table.timestamps(true, true);
    
    table.foreign('resep_id').references('resep.resep_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('kurir_id').references('kurir.kurir_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('resep_id');
    table.index('kurir_id');
    table.index('status_pengiriman');
    table.index('tanggal_kirim');
    table.index('no_resi');
    table.index(['koordinat_lat', 'koordinat_lng']);
  });

  // Create detail_resep table
  await knex.schema.createTable('detail_resep', function(table) {
    table.increments('detail_id').primary();
    table.integer('resep_id').unsigned().notNullable();
    table.integer('obat_id').unsigned().notNullable();
    table.string('dosis', 100);
    table.integer('jumlah').notNullable();
    table.text('aturan_pakai');
    table.text('catatan_khusus');
    table.decimal('harga_satuan', 10, 2);
    table.decimal('subtotal', 10, 2);
    table.boolean('is_tersedia').defaultTo(true);
    table.string('alasan_tidak_tersedia', 255);
    table.integer('obat_pengganti_id').unsigned();
    table.timestamps(true, true);
    
    table.foreign('resep_id').references('resep.resep_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('obat_id').references('obat.obat_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('obat_pengganti_id').references('obat.obat_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('resep_id');
    table.index('obat_id');
    table.index('obat_pengganti_id');
    table.index('is_tersedia');
  });

  // Create medical_record table
  await knex.schema.createTable('medical_record', function(table) {
    table.increments('record_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('konsultasi_id').unsigned();
    table.integer('doctor_id').unsigned().notNullable();
    table.date('tanggal_rekam').notNullable();
    table.text('keluhan_utama');
    table.text('anamnesis');
    table.text('pemeriksaan_fisik');
    table.text('pemeriksaan_penunjang');
    table.text('diagnosa_utama');
    table.text('diagnosa_sekunder');
    table.text('terapi');
    table.text('prognosis');
    table.text('follow_up');
    table.text('catatan_tambahan');
    table.json('file_pendukung').defaultTo('[]');
    table.boolean('is_confidential').defaultTo(false);
    table.timestamps(true, true);
    
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('pasien_id');
    table.index('konsultasi_id');
    table.index('doctor_id');
    table.index('tanggal_rekam');
    table.index('is_confidential');
  });

  // Create vital_signs table
  await knex.schema.createTable('vital_signs', function(table) {
    table.increments('vital_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('konsultasi_id').unsigned();
    table.integer('medical_record_id').unsigned();
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
    table.decimal('gula_darah', 5, 2);
    table.decimal('kolesterol', 5, 2);
    table.decimal('asam_urat', 5, 2);
    table.text('catatan');
    table.enum('kondisi_umum', ['baik', 'sedang', 'buruk']).defaultTo('baik');
    table.timestamps(true, true);
    
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('medical_record_id').references('medical_record.record_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('pasien_id');
    table.index('konsultasi_id');
    table.index('medical_record_id');
    table.index('tanggal_periksa');
    table.index('kondisi_umum');
  });

  // Create notifikasi table
  await knex.schema.createTable('notifikasi', function(table) {
    table.increments('notifikasi_id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('judul', 255).notNullable();
    table.text('isi');
    table.enum('tipe', ['konsultasi', 'pembayaran', 'resep', 'pengiriman', 'sistem', 'promo', 'reminder', 'appointment']).notNullable();
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.json('data_payload');
    table.boolean('is_read').defaultTo(false);
    table.boolean('is_push').defaultTo(false);
    table.boolean('is_email').defaultTo(false);
    table.boolean('is_sms').defaultTo(false);
    table.dateTime('scheduled_at');
    table.dateTime('sent_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('tipe');
    table.index('priority');
    table.index('is_read');
    table.index('is_push');
    table.index('scheduled_at');
    table.index('created_at');
  });

  // Create review_rating table
  await knex.schema.createTable('review_rating', function(table) {
    table.increments('review_id').primary();
    table.integer('konsultasi_id').unsigned();
    table.integer('reviewer_id').unsigned().notNullable();
    table.integer('reviewed_id').unsigned().notNullable();
    table.integer('rating').notNullable();
    table.text('review_text');
    table.enum('review_type', ['doctor', 'apotek', 'kurir', 'aplikasi', 'klinik', 'rumah_sakit']).notNullable();
    table.boolean('is_anonymous').defaultTo(false);
    table.boolean('is_approved').defaultTo(true);
    table.json('rating_aspects'); // For detailed ratings like punctuality, friendliness, etc.
    table.string('response_from_reviewed', 1000);
    table.dateTime('response_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('reviewer_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('reviewed_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('konsultasi_id');
    table.index('reviewer_id');
    table.index('reviewed_id');
    table.index('review_type');
    table.index('rating');
    table.index('is_approved');
    table.index('created_at');
  });

  // Create feedback table
  await knex.schema.createTable('feedback', function(table) {
    table.increments('feedback_id').primary();
    table.integer('user_id').unsigned();
    table.enum('tipe_feedback', ['bug', 'suggestion', 'complaint', 'praise', 'feature_request']).notNullable();
    table.string('judul', 255);
    table.text('deskripsi');
    table.json('screenshots').defaultTo('[]');
    table.string('device_info', 500);
    table.string('app_version', 50);
    table.string('os_version', 50);
    table.enum('status', ['open', 'in_progress', 'resolved', 'closed', 'duplicate']).notNullable().defaultTo('open');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).notNullable().defaultTo('medium');
    table.text('admin_response');
    table.integer('assigned_to').unsigned();
    table.dateTime('resolved_at');
    table.timestamps(true, true);
    
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('assigned_to').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('tipe_feedback');
    table.index('status');
    table.index('priority');
    table.index('assigned_to');
    table.index('created_at');
  });

  // Create chat_messages table
  await knex.schema.createTable('chat_messages', function(table) {
    table.increments('message_id').primary();
    table.integer('konsultasi_id').unsigned().notNullable();
    table.integer('sender_id').unsigned().notNullable();
    table.text('message_text');
    table.enum('message_type', ['text', 'image', 'file', 'voice', 'video', 'prescription', 'location']).notNullable();
    table.string('file_path', 255);
    table.string('file_name', 255);
    table.integer('file_size');
    table.string('mime_type', 100);
    table.integer('duration'); // for voice/video messages
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.boolean('is_read').defaultTo(false);
    table.boolean('is_edited').defaultTo(false);
    table.boolean('is_deleted').defaultTo(false);
    table.integer('reply_to_message_id').unsigned();
    table.json('metadata'); // for storing additional data like location coordinates
    table.dateTime('edited_at');
    table.dateTime('deleted_at');
    
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('sender_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('reply_to_message_id').references('chat_messages.message_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('konsultasi_id');
    table.index('sender_id');
    table.index('message_type');
    table.index('timestamp');
    table.index('is_read');
    table.index('is_deleted');
    table.index('reply_to_message_id');
  });

  // Create jadwal_doctor table
  await knex.schema.createTable('jadwal_doctor', function(table) {
    table.increments('jadwal_id').primary();
    table.integer('doctor_id').unsigned().notNullable();
    table.enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']).notNullable();
    table.time('jam_mulai').notNullable();
    table.time('jam_selesai').notNullable();
    table.integer('quota_pasien').defaultTo(10);
    table.integer('durasi_konsultasi').defaultTo(30); // in minutes
    table.boolean('is_available').defaultTo(true);
    table.text('catatan');
    table.enum('tipe_jadwal', ['reguler', 'khusus', 'emergency']).defaultTo('reguler');
    table.date('tanggal_khusus'); // for special schedules
    table.timestamps(true, true);
    
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    
    // Indexes
    table.index('doctor_id');
    table.index('hari');
    table.index('is_available');
    table.index('tipe_jadwal');
    table.index('tanggal_khusus');
    
    // Unique constraint for doctor's schedule
    table.unique(['doctor_id', 'hari', 'jam_mulai', 'tanggal_khusus']);
  });

  // Create appointment table
  await knex.schema.createTable('appointment', function(table) {
    table.increments('appointment_id').primary();
    table.integer('pasien_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.string('kode_appointment', 50).notNullable().unique();
    table.date('tanggal_appointment').notNullable();
    table.time('jam_appointment').notNullable();
    table.dateTime('estimasi_selesai');
    table.text('keluhan');
    table.text('catatan_pasien');
    table.enum('status', ['scheduled', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show']).notNullable();
    table.enum('jenis_appointment', ['konsultasi', 'follow_up', 'emergency']).defaultTo('konsultasi');
    table.boolean('reminder_sent').defaultTo(false);
    table.dateTime('reminder_sent_at');
    table.text('alasan_batal');
    table.integer('rescheduled_from').unsigned();
    table.integer('rescheduled_to').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    
    table.foreign('pasien_id').references('pasien.pasien_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('doctor_id').references('doctor.doctor_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('rescheduled_from').references('appointment.appointment_id').onDelete('SET NULL').onUpdate('CASCADE');
    table.foreign('rescheduled_to').references('appointment.appointment_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('pasien_id');
    table.index('doctor_id');
    table.index('kode_appointment');
    table.index('tanggal_appointment');
    table.index('status');
    table.index('jenis_appointment');
    table.index('created_at');
  });

  // Create additional helpful tables

  // Create chat_sessions table for better chat management
  await knex.schema.createTable('chat_sessions', function(table) {
    table.increments('session_id').primary();
    table.integer('konsultasi_id').unsigned().notNullable().unique();
    table.dateTime('session_start').defaultTo(knex.fn.now());
    table.dateTime('session_end');
    table.boolean('is_active').defaultTo(true);
    table.integer('total_messages').defaultTo(0);
    table.integer('unread_doctor').defaultTo(0);
    table.integer('unread_patient').defaultTo(0);
    table.dateTime('last_message_at');
    table.integer('last_message_by').unsigned();
    table.timestamps(true, true);
    
    table.foreign('konsultasi_id').references('konsultasi.konsultasi_id').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('last_message_by').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('konsultasi_id');
    table.index('is_active');
    table.index('last_message_at');
    table.index('last_message_by');
  });

  // Create audit_trail table for important actions
  await knex.schema.createTable('audit_trail', function(table) {
    table.increments('audit_id').primary();
    table.integer('user_id').unsigned();
    table.string('action', 100).notNullable();
    table.string('entity_type', 100).notNullable();
    table.integer('entity_id').unsigned();
    table.json('old_values');
    table.json('new_values');
    table.string('ip_address', 45);
    table.text('user_agent');
    table.text('description');
    table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('action');
    table.index('entity_type');
    table.index('entity_id');
    table.index('severity');
    table.index('created_at');
  });

  // Create app_analytics table for usage tracking
  await knex.schema.createTable('app_analytics', function(table) {
    table.increments('analytics_id').primary();
    table.integer('user_id').unsigned();
    table.string('event_name', 100).notNullable();
    table.string('event_category', 100);
    table.json('event_data');
    table.string('platform', 50);
    table.string('app_version', 50);
    table.string('device_type', 50);
    table.string('os_version', 50);
    table.string('screen_resolution', 50);
    table.string('session_id', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.user_id').onDelete('SET NULL').onUpdate('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('event_name');
    table.index('event_category');
    table.index('platform');
    table.index('created_at');
  });

  // Insert default system settings
  await knex('system_settings').insert([
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
  ]);

  // Insert default FAQ categories
  await knex('kategori_artikel').insert([
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
  ]);

  // Insert default drug categories
  await knex('kategori_obat').insert([
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
  ]);

  // Insert default specializations
  await knex('spesialisasi').insert([
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
  ]);

  console.log('Database schema created successfully with enhanced features!');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop all tables in reverse order of creation
  const tables = [
    'app_analytics',
    'audit_trail', 
    'chat_sessions',
    'appointment',
    'jadwal_doctor',
    'chat_messages',
    'feedback',
    'review_rating',
    'notifikasi',
    'vital_signs',
    'medical_record',
    'detail_resep',
    'pengiriman',
    'stok_obat',
    'system_settings',
    'user_promo',
    'pembayaran',
    'resep',
    'konsultasi',
    'doctor',
    'spesialisasi',
    'klinik',
    'rumah_sakit',
    'promo',
    'pasien',
    'obat',
    'logs',
    'kurir',
    'kategori_obat',
    'faq',
    'artikel_kesehatan',
    'kategori_artikel',
    'apoteker',
    'apotek',
    'admin',
    'users',
    'kota',
    'provinsi'
  ];

  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }

  console.log('All tables dropped successfully!');
};