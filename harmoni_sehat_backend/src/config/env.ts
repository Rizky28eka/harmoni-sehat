import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const required = (name: string, testFallback?: string): string => {
  const value = process.env[name] || (isTest ? testFallback : undefined);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
export const MONGODB_URI = process.env.MONGO_URI || '';
export const JWT_SECRET = required('JWT_SECRET', 'test-secret-test-secret-test-secret');
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const REFRESH_TOKEN_DAYS = process.env.REFRESH_TOKEN_DAYS
  ? parseInt(process.env.REFRESH_TOKEN_DAYS, 10)
  : 30;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@harmoni-sehat.com';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || '*').split(',').map((s) => s.trim());

// Payment gateway (Midtrans). Empty server key => sandbox "mock" mode.
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
export const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Push notifications (Firebase Cloud Messaging, legacy-free HTTP v1 service account JSON path)
export const FCM_SERVICE_ACCOUNT_PATH = process.env.FCM_SERVICE_ACCOUNT_PATH || '';

// Media storage: 'local' (default) or 'cloudinary'
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';
export const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;

// Field-level encryption key for sensitive medical data (32 bytes, hex or any string => sha256)
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
