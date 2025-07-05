const { OAuth2Client } = require('google-auth-library');
const AppleAuth = require('apple-auth');
const jwt = require('jsonwebtoken');
const authService = require('./auth.service');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Konfigurasi untuk Apple login
const appleAuth = new AppleAuth({
    client_id: process.env.APPLE_CLIENT_ID, // e.g. com.yourapp.web
    team_id: process.env.APPLE_TEAM_ID,     // Apple Team ID
    key_id: process.env.APPLE_KEY_ID,       // Apple Key ID
    redirect_uri: process.env.APPLE_REDIRECT_URI, // URL untuk redirect setelah login
    scope: 'name email'
}, process.env.APPLE_PRIVATE_KEY.replace(/\n/g, '\n'));


const googleLogin = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new ApiError(400, 'Google token tidak ditemukan.'));
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub: provider_id } = ticket.getPayload();
    
    const user = await authService.findOrCreateUser({ email, name, provider: 'google', provider_id });
    const authToken = authService.generateToken(user);

    res.status(200).json(new ApiResponse(200, { token: authToken }, 'Google login berhasil.'));
  } catch (error) {
    next(new ApiError(401, 'Google login gagal: ' + error.message));
  }
};

const appleLogin = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return next(new ApiError(400, 'Apple token tidak ditemukan.'));
    }

    try {
        // Verifikasi token dengan Apple
        const response = await appleAuth.accessToken(token);
        const idToken = jwt.decode(response.id_token);

        const userEmail = idToken.email;
        const provider_id = idToken.sub;

        // Apple tidak selalu memberikan nama, jadi kita perlu menanganinya
        // Nama mungkin hanya diberikan saat otorisasi pertama kali.
        // Anda mungkin perlu memintanya dari frontend jika tidak ada.
        const userName = req.body.fullName || userEmail.split('@')[0];

        const user = await authService.findOrCreateUser({
            email: userEmail,
            name: userName,
            provider: 'apple',
            provider_id,
        });

        const authToken = authService.generateToken(user);
        res.status(200).json(new ApiResponse(200, { token: authToken }, 'Apple login berhasil.'));

    } catch (error) {
        next(new ApiError(401, 'Apple login gagal: ' + error.message));
    }
};

module.exports = {
  googleLogin,
  appleLogin,
};

