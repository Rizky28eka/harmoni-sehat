"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.MONGO_URI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};
exports.default = connectDB;
