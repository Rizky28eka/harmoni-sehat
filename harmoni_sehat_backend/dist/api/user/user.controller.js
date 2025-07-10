"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const ApiResponse_1 = require("../../utils/ApiResponse");
const AppError_1 = require("../../utils/AppError");
class UserController {
    async createUser(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await user_service_1.default.createUser(email, password);
            res.status(201).json(new ApiResponse_1.ApiResponse(201, user, 'User berhasil ditambahkan'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await user_service_1.default.getAllUsers();
            res.status(200).json(new ApiResponse_1.ApiResponse(200, users, 'Users berhasil diambil'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await user_service_1.default.getUserById(req.params.id);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User berhasil ditemukan'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await user_service_1.default.updateUser(req.params.id, req.body);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User berhasil diperbarui'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async deleteUser(req, res, next) {
        try {
            await user_service_1.default.deleteUser(req.params.id);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'User berhasil dihapus'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
}
exports.default = new UserController();
