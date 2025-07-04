// controllers/auth.controller.js
const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    // Data sudah divalidasi oleh middleware
    const user = await authService.registerUser(req.body);
    res
      .status(201)
      .json({ message: 'Registrasi berhasil', userId: user.id, role: user.role });
  } catch (error) {
    // Teruskan error ke middleware error handling terpusat
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  // Validasi sederhana untuk login, bisa juga pakai express-validator
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, dan role harus diisi' });
  }
  
  const allowedRoles = ['pasien', 'dokter', 'apoteker'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid untuk login.' });
  }

  try {
    const result = await authService.loginUser({ email, password, expectedRole: role });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
