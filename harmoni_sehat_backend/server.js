require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Cek koneksi database menggunakan Knex
db.raw('SELECT 1')
  .then(() => {
    console.log('MySQL Terhubung...');
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Gagal terhubung ke MySQL:', err);
    process.exit(1); // Keluar dari aplikasi jika tidak bisa konek DB
  });