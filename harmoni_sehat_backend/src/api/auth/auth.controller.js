// controllers/auth.controller.js
const authService = require('./auth.service');

const register = async (req, res) => {
  const { nama_lengkap, email, password, no_hp, role, nomor_sip, spesialisasi, nomor_stra, alamat_tempat_kerja } = req.body;

  // Validasi input dasar
  if (!nama_lengkap || !email || !password || !no_hp || !role) {
    return res.status(400).json({ message: 'Semua field dasar (nama_lengkap, email, password, no_hp, role) harus diisi' });
  }

  // Validasi role yang diizinkan
  const allowedRoles = ['pasien', 'dokter', 'apoteker'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid. Role yang diizinkan: pasien, dokter, apoteker.' });
  }

  // Validasi field spesifik berdasarkan role
  if (role === 'dokter') {
    if (!nomor_sip || !spesialisasi) {
      return res.status(400).json({ message: 'Untuk role dokter, nomor_sip dan spesialisasi harus diisi.' });
    }
  } else if (role === 'apoteker') {
    if (!nomor_stra || !alamat_tempat_kerja) {
      return res.status(400).json({ message: 'Untuk role apoteker, nomor_stra dan alamat_tempat_kerja harus diisi.' });
    }
  }

  try {
    const userDataToRegister = {
      nama_lengkap,
      email,
      password,
      no_hp,
      role,
    };

    if (role === 'dokter') {
      userDataToRegister.nomor_sip = nomor_sip;
      userDataToRegister.spesialisasi = spesialisasi;
    } else if (role === 'apoteker') {
      userDataToRegister.nomor_stra = nomor_stra;
      userDataToRegister.alamat_tempat_kerja = alamat_tempat_kerja;
    }

    const user = await authService.registerUser(userDataToRegister);
    res
      .status(201)
      .json({ message: 'Registrasi berhasil', userId: user.id, role: user.role });
  } catch (error) {
    // Tangani error jika email/no_hp sudah ada atau error duplikat lainnya
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email atau nomor HP sudah terdaftar' });
    }
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, dan role harus diisi' });
  }

  // Validasi role yang diizinkan untuk login
  const allowedRoles = ['pasien', 'dokter', 'apoteker'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid untuk login. Role yang diizinkan: pasien, dokter, apoteker.' });
  }

  try {
    const result = await authService.loginUser({ email, password, expectedRole: role });
    res.json(result);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
