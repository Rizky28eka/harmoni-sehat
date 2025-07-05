const { faker } = require('@faker-js/faker/locale/id_ID');
const bcrypt = require('bcryptjs');

const NUM_PROVINSI = 34; // Jumlah provinsi di Indonesia
const NUM_KOTA_PER_PROVINSI = 5; // Bisa disesuaikan nanti jika butuh lebih detail

const NUM_USERS = 500; // Pasien umum yang pakai aplikasi
const NUM_ADMINS = 10; // Admin sistem
const NUM_APOTEK = 50; // Apotek tersebar secara nasional
const NUM_APOTEKERS = 100; // Biasanya ada 1–2 apoteker per apotek
const NUM_KATEGORI_ARTIKEL = 10;
const NUM_ARTIKEL_KESEHATAN = 200; // Banyak artikel kesehatan untuk edukasi
const NUM_FAQ = 30;
const NUM_KATEGORI_OBAT = 20;
const NUM_KURIR = 100; // Lebih banyak untuk pengiriman obat
const NUM_OBAT = 500; // Obat cukup bervariasi
const NUM_PASIEN = 450; // Hampir semua user adalah pasien
const NUM_PROMO = 20; // Promo musiman atau spesifik
const NUM_RUMAH_SAKIT = 1000; // Rumah sakit besar/mitra
const NUM_KLINIK = 200; // Klinik untuk keluarga menengah ke bawah
const NUM_SPESIALISASI = 100; // Umum: jantung, anak, bedah, dll
const NUM_DOCTORS = 150; // Masing-masing RS punya beberapa dokter
const NUM_JADWAL_DOCTOR = 300; // Setiap dokter punya jadwal berbeda

const NUM_KONSULTASI = 200; // Tidak semua pasien konsultasi
const NUM_RESEP = 150; // Resep hasil dari konsultasi
const NUM_DETAIL_RESEP_PER_RESEP = 3; // Rata-rata isi resep
const NUM_PEMBAYARAN = 100; // Menyesuaikan jumlah resep atau konsultasi
const NUM_USER_PROMO = 100;
const NUM_STOK_OBAT = 200; // Stok tiap apotek/obat
const NUM_PENGIRIMAN = 150; // Untuk yang menebus resep

const NUM_MEDICAL_RECORD = 200; // Banyak pasien punya lebih dari 1 record
const NUM_VITAL_SIGNS = 500; // Termasuk data tensi, suhu, dsb
const NUM_NOTIFIKASI = 400; // Reminder jadwal, promo, dll
const NUM_REVIEW_RATING = 200; // Tidak semua user memberi ulasan
const NUM_FEEDBACK = 100; // Masukan user
const NUM_CHAT_MESSAGES = 1000; // Termasuk dari fitur konsultasi/chat dokter
const NUM_APPOINTMENT = 250; // Janji temu yang dibuat
const NUM_LOGS = 500; // Log aktivitas sistem
const NUM_SYSTEM_SETTINGS = 10; // Global settings

// Helper function to generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random time string (HH:MM:SS)
const randomTime = () => {
  const hour = faker.number.int({ min: 0, max: 23 }).toString().padStart(2, '0');
  const minute = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  const second = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  return `${hour}:${minute}:${second}`;
};

module.exports = {
  faker,
  bcrypt,
  NUM_PROVINSI,
  NUM_KOTA_PER_PROVINSI,
  NUM_USERS,
  NUM_ADMINS,
  NUM_APOTEK,
  NUM_APOTEKERS,
  NUM_KATEGORI_ARTIKEL,
  NUM_ARTIKEL_KESEHATAN,
  NUM_FAQ,
  NUM_KATEGORI_OBAT,
  NUM_KURIR,
  NUM_OBAT,
  NUM_PASIEN,
  NUM_PROMO,
  NUM_RUMAH_SAKIT,
  NUM_KLINIK, // Added this line
  NUM_SPESIALISASI,
  NUM_DOCTORS,
  NUM_KONSULTASI,
  NUM_RESEP,
  NUM_PEMBAYARAN,
  NUM_USER_PROMO,
  NUM_STOK_OBAT,
  NUM_PENGIRIMAN,
  NUM_DETAIL_RESEP_PER_RESEP,
  NUM_MEDICAL_RECORD,
  NUM_VITAL_SIGNS,
  NUM_NOTIFIKASI,
  NUM_REVIEW_RATING,
  NUM_FEEDBACK,
  NUM_CHAT_MESSAGES,
  NUM_JADWAL_DOCTOR,
  NUM_APPOINTMENT,
  NUM_LOGS,
  NUM_SYSTEM_SETTINGS,
  randomDate,
  randomTime,
};