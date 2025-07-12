"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.EMAIL_FROM = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.EMAIL_PORT = exports.EMAIL_HOST = exports.GEMINI_API_KEY = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.MONGODB_URI = process.env.MONGO_URI || '';
exports.JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
exports.GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
exports.EMAIL_HOST = process.env.EMAIL_HOST || '';
exports.EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
exports.EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@harmoni-sehat.com';
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
