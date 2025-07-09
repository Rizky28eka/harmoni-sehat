"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponseDto = void 0;
const toUserResponseDto = (user) => {
    return {
        id: user._id.toString(),
        email: user.email,
        is_active: user.is_active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.toUserResponseDto = toUserResponseDto;
