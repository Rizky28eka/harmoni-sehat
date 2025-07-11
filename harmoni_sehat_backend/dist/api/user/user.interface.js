"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponseDto = void 0;
const toUserResponseDto = (user) => ({
    id: user._id.toString(),
    email: user.email,
    is_active: user.is_active,
    role: typeof user.role === 'object' ? user.role.nama_peran : user.role,
});
exports.toUserResponseDto = toUserResponseDto;
