// controllers/auth.controller.js
const authService = require('./auth.service');

const register = async (req, res) => {
  const { nama_lengkap, email, password, no_hp } = req.body;

  // Validasi input sederhana
  if (!nama_lengkap || !email || !password || !no_hp) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    const user = await authService.registerUser({
      nama_lengkap,
      email,
      password,
      no_hp,
    });
    res
      .status(201)
      .json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (error) {
    // Tangani error jika email/no_hp sudah ada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email atau nomor HP sudah terdaftar' });
    }
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi' });
  }

  try {
    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
