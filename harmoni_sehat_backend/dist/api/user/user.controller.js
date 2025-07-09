"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const user_interface_1 = require("./user.interface");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
class UserController {
    async getAllUsers(req, res, next) {
        try {
            const users = await user_service_1.default.getAllUsers();
            res.status(200).json(new ApiResponse_1.default(200, users.map(user_interface_1.toUserResponseDto), 'Users fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await user_service_1.default.getUserById(req.params.id);
            res.status(200).json(new ApiResponse_1.default(200, (0, user_interface_1.toUserResponseDto)(user), 'User fetched successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async createUser(req, res, next) {
        try {
            const userData = req.body;
            const newUser = await user_service_1.default.createUser(userData);
            res.status(201).json(new ApiResponse_1.default(201, (0, user_interface_1.toUserResponseDto)(newUser), 'User created successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const userData = req.body;
            const updatedUser = await user_service_1.default.updateUser(req.params.id, userData);
            res.status(200).json(new ApiResponse_1.default(200, (0, user_interface_1.toUserResponseDto)(updatedUser), 'User updated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            await user_service_1.default.deleteUser(req.params.id);
            res.status(204).json(new ApiResponse_1.default(204, null, 'User deleted successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new UserController();
