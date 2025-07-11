"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = require("../../utils/AppError");
class UserService {
    async createUser(email, password) {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            throw new AppError_1.AppError('User dengan email tersebut sudah ada', 409);
        }
        const user = await User_1.default.create({ email, password });
        return user;
    }
    async updateUser(id, data) {
        const user = await User_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!user) {
            throw new AppError_1.AppError('User tidak ditemukan', 404);
        }
        return user;
    }
    async deleteUser(id) {
        const user = await User_1.default.findByIdAndDelete(id);
        if (!user) {
            throw new AppError_1.AppError('User tidak ditemukan', 404);
        }
    }
}
exports.default = new UserService();
