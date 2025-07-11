"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 5, // Example: minimum length for email
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v); // Basic email regex validation
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
        index: true, // Add index for efficient lookups
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false, // Don't return password by default
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v); // At least one uppercase, one lowercase, one number, one special character, min 8 chars
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.',
        },
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        index: true, // Add index for efficient lookups
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
