"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const User_1 = __importDefault(require("../../models/User"));
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
            const features = new apiFeatures_1.default(User_1.default.find().populate({ path: 'role', select: 'nama_peran' }), req.query)
                .filter()
                .search(['email', 'nama']) // Assuming 'nama' field exists in User or related populated models
                .sort()
                .limitFields()
                .paginate();
            const users = await features.query.lean();
            // Count total documents for pagination metadata
            const totalUsers = await User_1.default.countDocuments(features.getConditions());
            res.status(200).json(new ApiResponse_1.ApiResponse(200, {
                data: users,
                total: totalUsers,
                page: features.queryString.page ? parseInt(features.queryString.page, 10) : 1,
                limit: features.queryString.limit ? parseInt(features.queryString.limit, 10) : 10,
            }, 'Users berhasil diambil'));
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.statusCode || 500));
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await User_1.default.findById(req.params.id)
                .select('email is_active role createdAt updatedAt')
                .populate({ path: 'role', select: 'nama_peran' })
                .lean();
            if (!user) {
                throw new AppError_1.AppError('User tidak ditemukan', 404);
            }
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
