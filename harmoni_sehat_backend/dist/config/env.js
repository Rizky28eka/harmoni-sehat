"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.MONGODB_URI = process.env.MONGO_URI || '';
exports.JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
