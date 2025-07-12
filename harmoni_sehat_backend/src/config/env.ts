import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGO_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@harmoni-sehat.com';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
