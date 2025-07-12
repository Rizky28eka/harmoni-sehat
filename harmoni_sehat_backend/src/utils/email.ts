import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM } from '../config/env';
import { AppError } from './AppError';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  // 2) Define the email options
  const mailOptions = {
    from: EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new AppError(`Failed to send email: ${error.message || 'Unknown error'}`, 500);
  }
};

export default sendEmail;