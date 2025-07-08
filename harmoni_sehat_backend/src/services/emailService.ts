import nodemailer from 'nodemailer';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    secure: process.env.EMAIL_PORT == '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
});

const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM as string,
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error: any) {
        logger.error('Error sending email:', error);
        throw new Error('Could not send email.');
    }
};

export const sendVerificationEmail = async (to: string, name: string, code: string) => {
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