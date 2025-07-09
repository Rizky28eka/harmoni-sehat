"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
class UserService {
    async getAllUsers() {
        return User_1.default.find();
    }
    async getUserById(id) {
        const user = await User_1.default.findById(id);
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        return user;
    }
    async updateUser(id, userData) {
        const user = await User_1.default.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        return user;
    }
    async deleteUser(id) {
        const user = await User_1.default.findByIdAndDelete(id);
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
    }
}
exports.default = new UserService();
