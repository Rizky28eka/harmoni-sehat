const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            html: html,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email.');
    }
};
const sendVerificationEmail = async (to, name, code) => {
    const subject = 'Verifikasi Akun Anda di Harmoni Sehat';
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Halo ${name},</h2>
            <p>Terima kasih telah bergabung dengan <strong>Harmoni Sehat</strong>.</p>
            <p>Untuk menyelesaikan proses pendaftaran, silakan gunakan kode verifikasi berikut:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; text-align: center;">
                ${code}
            </p>
            <p><strong>Catatan:</strong> Kode ini berlaku selama 1 jam.</p>
            <p>Jika Anda tidak merasa melakukan pendaftaran, silakan abaikan email ini.</p>
            <br>
            <p>Salam sehat,</p>
            <p><strong>Tim Harmoni Sehat</strong></p>
        </div>
    `;
    return sendEmail(to, subject, html);
};

module.exports = { sendVerificationEmail };


module.exports = { sendVerificationEmail };
