const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const knex = require('knex')(require('../../../knexfile').development);
const ApiError = require('../../utils/ApiError');
// const sendEmail = require('../../utils/sendEmail'); // Asumsi ada utilitas untuk kirim email

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

  // Validasi duplikasi sudah ditangani di validation.js

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return knex.transaction(async (trx) => {
    const [user] = await trx('users')
      .insert({
        email,
        password: hashedPassword,
        no_hp,
        role,
        is_verified: false, // User belum terverifikasi
      })
      .returning(['id', 'role']);

    if (role === 'pasien') {
      await trx('pasiens').insert({ user_id: user.id, nama_lengkap });
    } else if (role === 'dokter') {
      await trx('dokters').insert({ user_id: user.id, nama_lengkap, nomor_sip, spesialisasi });
    } else if (role === 'apoteker') {
      await trx('apotekers').insert({ user_id: user.id, nama_lengkap, nomor_stra, alamat_tempat_kerja });
    }
    
    // Kirim email verifikasi (implementasi sendEmail diperlukan)
    // const verificationToken = '...'; // Buat token verifikasi
    // await sendEmail(email, 'Verifikasi Email', `Klik link ini: .../${verificationToken}`);

    return user;
  });
};

const loginUser = async (credentials) => {
  const { email, password, expectedRole } = credentials;

  const user = await knex('users').where({ email }).first();
  if (!user) {
    throw new ApiError(401, 'Email atau password salah.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Email atau password salah.');
  }
  
  if (!user.is_verified) {
    // throw new ApiError(403, 'Akun Anda belum diverifikasi. Silakan cek email Anda.');
  }

  if (expectedRole && user.role !== expectedRole) {
    throw new ApiError(403, `Anda mencoba login sebagai ${expectedRole}, tapi role Anda adalah ${user.role}.`);
  }

  // Query nama lengkap dengan join
  let userProfile;
  if (user.role === 'pasien') {
    userProfile = await knex('pasiens').select('nama_lengkap').where({ user_id: user.id }).first();
  } else if (user.role === 'dokter') {
    userProfile = await knex('dokters').select('nama_lengkap').where({ user_id: user.id }).first();
  } else if (user.role === 'apoteker') {
    userProfile = await knex('apotekers').select('nama_lengkap').where({ user_id: user.id }).first();
  }

  const token = generateToken(user);
  return { 
    token, 
    user: {
      id: user.id,
      role: user.role,
      name: userProfile ? userProfile.nama_lengkap : 'Pengguna',
      email: user.email,
    }
  };
};

const findOrCreateUser = async (profile) => {
  const { email, name, provider, provider_id } = profile;

  let user = await knex('users').where({ email }).first();

  if (user) {
    // Jika user ada tapi login dengan provider lain, beri tahu mereka.
    if (user.provider !== provider && user.provider !== null) {
      throw new ApiError(409, `Akun dengan email ini sudah terdaftar melalui ${user.provider}. Silakan login dengan ${user.provider}.`);
    }
    // Update provider jika sebelumnya null
    if (user.provider === null) {
        await knex('users').where({ id: user.id }).update({ provider, provider_id });
    }
  } else {
    // Buat user baru jika tidak ada
    const [newUser] = await knex.transaction(async (trx) => {
        const [createdUser] = await trx('users')
            .insert({
                email,
                role: 'pasien', // Default role untuk social login
                provider,
                provider_id,
                is_verified: true, // Anggap terverifikasi dari provider
            })
            .returning('*');
        
        await trx('pasiens').insert({
            user_id: createdUser.id,
            nama_lengkap: name,
        });

        return [createdUser];
    });
    user = newUser;
  }

  return user;
};

const forgotPassword = async (email) => {
    const user = await knex('users').where({ email }).first();
    if (!user) {
        // Jangan beri tahu jika user tidak ada untuk keamanan
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    const password_reset_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await knex('users').where({ id: user.id }).update({
        password_reset_token,
        password_reset_expires,
    });

    // Kirim email dengan token (implementasi sendEmail diperlukan)
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    // await sendEmail(user.email, 'Reset Password', `Klik link ini untuk reset password: ${resetUrl}`);
    console.log(`Reset URL (for testing): ${resetUrl}`);
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await knex('users')
        .where({ password_reset_token: hashedToken })
        .andWhere('password_reset_expires', '>', new Date())
        .first();

    if (!user) {
        throw new ApiError(400, 'Token tidak valid atau sudah kedaluwarsa.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await knex('users').where({ id: user.id }).update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
    });
};


module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
  generateToken,
  forgotPassword,
  resetPassword,
};
