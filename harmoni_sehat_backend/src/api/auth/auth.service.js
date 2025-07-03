// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db'); // Menggunakan pool koneksi langsung
const knex = require('knex')(require('../../../knexfile').development); // Menggunakan Knex untuk transaksi

const registerUser = async (userData) => {
  const { nama_lengkap, email, password, no_hp } = userData;

  // 1. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 2. Gunakan transaksi untuk memastikan integritas data
  const [newUser] = await knex.transaction(async (trx) => {
    // Masukkan ke tabel 'users'
    const [userId] = await trx('users')
      .insert({
        email,
        password: hashedPassword,
        no_hp,
        role: 'pasien', // Default role untuk registrasi
      });

    const user = await trx('users').where({ id: userId }).first();

    // Masukkan ke tabel 'pasiens'
    await trx('pasiens').insert({
      user_id: user.id,
      nama_lengkap,
    });

    return [user];
  });

  // Hapus password dari objek user sebelum dikembalikan
  delete newUser.password;
  return newUser;
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // 1. Cari user berdasarkan email
  const [user] = await knex('users').where({ email });
  if (!user) {
    throw new Error('Kredensial tidak valid');
  }

  // 2. Bandingkan password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Kredensial tidak valid');
  }

  // 3. Buat JWT
  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token berlaku selama 1 hari
  });

  return { token };
};

module.exports = {
  registerUser,
  loginUser,
};
