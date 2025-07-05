const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, { userId: user.id, role: user.role }, 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.loginUser({ email, password, expectedRole: role });
    res.status(200).json(new ApiResponse(200, result, 'Login berhasil.'));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json(new ApiResponse(200, null, 'Email untuk reset password telah dikirim.'));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json(new ApiResponse(200, null, 'Password berhasil direset.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
