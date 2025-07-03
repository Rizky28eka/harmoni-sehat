// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.header('Authorization');

  // Cek jika header tidak ada atau formatnya salah
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Akses ditolak. Token tidak disediakan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lampirkan payload yang sudah didekode ke object request
    req.user = decoded;
    next(); // Lanjutkan ke middleware/controller berikutnya
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token telah kedaluwarsa.' });
    }
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};

const authorize = (roles = []) => {
  // roles bisa berupa array ['admin', 'dokter'] atau string 'admin'
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Cek jika peran pengguna ada di dalam daftar peran yang diizinkan
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res
        .status(403)
        .json({ message: 'Akses ditolak. Anda tidak memiliki hak akses.' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
