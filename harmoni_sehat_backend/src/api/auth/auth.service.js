const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../../../knexfile').development);
const ApiError = require('../../utils/ApiError');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const registerUser = async (userData) => {
  const { nama_lengkap, email, password, no_hp, role, nomor_sip, spesialisasi, nomor_stra, alamat_tempat_kerja } = userData;

  // Cek duplikasi secara eksplisit untuk pesan error yang lebih baik
  const existingUser = await knex('users').where({ email }).orWhere({ no_hp }).first();
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, `Email ${email} sudah terdaftar.`);
    }
    if (existingUser.no_hp === no_hp) {
      throw new ApiError(409, `Nomor HP ${no_hp} sudah terdaftar.`);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [newUser] = await knex.transaction(async (trx) => {
    const [userId] = await trx('users')
      .insert({
        email,
        password: hashedPassword,
        no_hp,
        role,
      });

    const user = await trx('users').where({ id: userId }).first();

    if (role === 'pasien') {
      await trx('pasiens').insert({ user_id: user.id, nama_lengkap });
    } else if (role === 'dokter') {
      await trx('dokters').insert({ user_id: user.id, nama_lengkap, nomor_sip, spesialisasi });
    } else if (role === 'apoteker') {
      await trx('apotekers').insert({ user_id: user.id, nama_lengkap, nomor_stra, alamat_tempat_kerja });
    }

    return [user];
  });

  delete newUser.password;
  return newUser;
};

const loginUser = async (credentials) => {
  const { email, password, expectedRole } = credentials;

  const user = await knex('users').where({ email }).first();
  if (!user) {
    throw new ApiError(401, 'Email tidak terdaftar.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Password salah.');
  }

  if (expectedRole && user.role !== expectedRole) {
    throw new ApiError(403, `Anda mencoba login sebagai ${expectedRole}, tapi role Anda adalah ${user.role}.`);
  }

  let nama_lengkap;
  if (user.role === 'pasien') {
    const pasien = await knex('pasiens').where({ user_id: user.id }).first();
    nama_lengkap = pasien ? pasien.nama_lengkap : 'Pasien';
  } else if (user.role === 'dokter') {
    const dokter = await knex('dokters').where({ user_id: user.id }).first();
    nama_lengkap = dokter ? dokter.nama_lengkap : 'Dokter';
  } else if (user.role === 'apoteker') {
    const apoteker = await knex('apotekers').where({ user_id: user.id }).first();
    nama_lengkap = apoteker ? apoteker.nama_lengkap : 'Apoteker';
  } else {
    nama_lengkap = 'Pengguna'; // Default if role is unknown
  }

  const token = generateToken(user);
  return { token, userId: user.id, role: user.role, name: nama_lengkap };
};

// findOrCreateUser tetap sama, bisa direfaktor juga jika perlu
const findOrCreateUser = async (profile) => {
    // ... implementasi yang sudah ada
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
  generateToken,
};
