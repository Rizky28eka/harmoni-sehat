"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = __importDefault(require("../utils/AppError"));
dotenv_1.default.config();
function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new AppError_1.default(`Environment variable ${name} not set!`, 500);
    }
    return value;
}
const env = {
    port: getEnvVar('PORT'),
    mongoUri: getEnvVar('MONGO_URI'),
    jwtSecret: getEnvVar('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d', // Can have a default
    // Other variables from your .env can be added here as needed
    sessionSecret: getEnvVar('SESSION_SECRET'),
    encryptionKey: getEnvVar('ENCRYPTION_KEY'),
    twilioAccountSid: getEnvVar('TWILIO_ACCOUNT_SID'),
    twilioAuthToken: getEnvVar('TWILIO_AUTH_TOKEN'),
    twilioPhoneNumber: getEnvVar('TWILIO_PHONE_NUMBER'),
    googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
    googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    emailHost: getEnvVar('EMAIL_HOST'),
    emailPort: getEnvVar('EMAIL_PORT'),
    emailUser: getEnvVar('EMAIL_USER'),
    emailPass: getEnvVar('EMAIL_PASS'),
    emailFrom: getEnvVar('EMAIL_FROM'),
};
exports.default = env;
