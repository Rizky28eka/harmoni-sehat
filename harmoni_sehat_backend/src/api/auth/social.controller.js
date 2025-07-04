const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const authService = require('./auth.service');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    
    const user = await authService.findOrCreateUser({ email, name, provider: 'google' });
    const authToken = authService.generateToken(user);

    res.json({ message: 'Google login successful', token: authToken });
  } catch (error) {
    res.status(400).json({ message: 'Google login failed', error: error.message });
  }
};

const appleLogin = async (req, res) => {
    // Apple login implementation will be added here
    res.status(501).json({ message: 'Apple login not implemented yet.' });
};

module.exports = {
  googleLogin,
  appleLogin,
};
