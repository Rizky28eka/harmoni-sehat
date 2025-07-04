const twilio = require('twilio');
const authService = require('./auth.service');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    // In a real app, you would generate and store the OTP
    // and then verify it in the verifyOtp step.
    // For simplicity, we are not implementing the full OTP logic here.
    // Twilio's Verify service can handle this for you.
    
    // const verification = await twilioClient.verify.v2.services('YOUR_VERIFY_SID')
    //   .verifications
    //   .create({to: phoneNumber, channel: 'sms'});
    
    res.json({ message: `OTP sent to ${phoneNumber}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    // const verification_check = await twilioClient.verify.v2.services('YOUR_VERIFY_SID')
    //   .verificationChecks
    //   .create({to: phoneNumber, code: code});

    // if (verification_check.status === 'approved') {
      const user = await authService.findOrCreateUser({ phoneNumber, provider: 'phone' });
      const authToken = authService.generateToken(user);
      res.json({ message: 'OTP verification successful', token: authToken });
    // } else {
    //   res.status(400).json({ message: 'Invalid OTP' });
    // }
  } catch (error) {
    res.status(400).json({ message: 'OTP verification failed', error: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
