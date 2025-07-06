const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

const User = require('../models/User');
const Pasien = require('../models/Pasien');
const Dokter = require('../models/Dokter');
const Apoteker = require('../models/Apoteker');

// In-memory user store for testing (use database in production)
// const users = [];

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
    body('nama_lengkap').trim().isLength({ min: 2, max: 100 }).withMessage('Nama harus antara 2-100 karakter'),
    body('no_hp').isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol'),
    body('role').isIn(['Dokter', 'Apoteker', 'Pasien']).withMessage('Role tidak valid'),
    body('spesialisasi').optional().trim().isLength({ min: 2, max: 100 }),
    body('noIzinPraktik').optional().trim().isLength({ min: 5, max: 50 }),
    body('alamatKlinik').optional().trim().isLength({ min: 10, max: 200 }),
    body('noSTRA').optional().trim().isLength({ min: 5, max: 50 }),
    body('alamatApotek').optional().trim().isLength({ min: 10, max: 200 }),
];

const loginValidation = [
    body('username').isEmail().normalizeEmail().withMessage('Email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi'),
    body('role').isIn(['Dokter', 'Apoteker', 'Pasien']).withMessage('Role tidak valid'),
];

const forgotPasswordValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
];

const resetPasswordValidation = [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Kode OTP harus 6 digit'),
    body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password baru minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol'),
];

const verifyAccountValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Kode verifikasi harus 6 digit'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Data yang dimasukkan tidak valid',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Helper function to generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        nama: user.nama_lengkap
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'your-app-name',
        audience: 'your-app-users'
    });
};

// Helper function to validate role-specific fields
const validateRoleSpecificFields = (role, data) => {
    const errors = [];
    
    if (role === 'Dokter') {
        if (!data.spesialisasi?.trim()) errors.push('Spesialisasi harus diisi untuk akun Dokter');
        if (!data.noIzinPraktik?.trim()) errors.push('Nomor Izin Praktik harus diisi untuk akun Dokter');
        if (!data.alamatKlinik?.trim()) errors.push('Alamat Klinik harus diisi untuk akun Dokter');
    } else if (role === 'Apoteker') {
        if (!data.noSTRA?.trim()) errors.push('Nomor STRA harus diisi untuk akun Apoteker');
        if (!data.alamatApotek?.trim()) errors.push('Alamat Apotek harus diisi untuk akun Apoteker');
    }
    
    return errors;
};

// Register endpoint
exports.register = [
    authLimiter,
    ...registerValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { 
                email, 
                nama_lengkap, 
                no_hp, 
                password, 
                role, 
                spesialisasi, 
                noIzinPraktik, 
                alamatKlinik, 
                noSTRA, 
                alamatApotek 
            } = req.body;

            // Validate role-specific fields
            const roleErrors = validateRoleSpecificFields(role, req.body);
            if (roleErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Data tidak lengkap',
                    errors: roleErrors
                });
            }

            // Check if email already exists
            let existingUser = await User.findOne({ email, role });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: `Akun dengan email ${email} untuk role ${role} sudah terdaftar`
                });
            }

            // Check if phone number already exists
            let existingPhoneUser = await User.findOne({ no_hp });
            if (existingPhoneUser) {
                return res.status(409).json({
                    success: false,
                    message: `Nomor telepon ${no_hp} sudah terdaftar untuk akun lain.`
                });
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Generate verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = Date.now() + 3600000; // 1 hour from now

            // Create user object
            const newUser = new User({
                email,
                nama_lengkap: nama_lengkap.trim(),
                no_hp,
                password: hashedPassword,
                role,
                is_verified: false,
                verificationCode,
                verificationCodeExpires
            });

            await newUser.save();

            // Create role-specific entry
            if (role === 'Pasien') {
                const newPasien = new Pasien({ user_id: newUser._id });
                await newPasien.save();
            } else if (role === 'Dokter') {
                const newDokter = new Dokter({ 
                    user_id: newUser._id,
                    spesialisasi: spesialisasi.trim(),
                    noIzinPraktik: noIzinPraktik.trim(),
                    alamatKlinik: alamatKlinik.trim()
                });
                await newDokter.save();
            } else if (role === 'Apoteker') {
                const newApoteker = new Apoteker({ 
                    user_id: newUser._id,
                    noSTRA: noSTRA.trim(),
                    alamatApotek: alamatApotek.trim()
                });
                await newApoteker.save();
            }

            // Log verification code to console (simulating email/SMS)
            console.log(`Verification code for ${newUser.email}: ${verificationCode}`);

            res.status(201).json({
                success: true,
                message: 'Pendaftaran berhasil! Silakan verifikasi akun Anda dengan kode yang dikirimkan.',
                data: { email: newUser.email, role: newUser.role }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Verify Account endpoint
exports.verifyAccount = [
    authLimiter,
    ...verifyAccountValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { email, code } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Pengguna tidak ditemukan.'
                });
            }

            if (user.is_verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Akun sudah terverifikasi.'
                });
            }

            if (user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
                return res.status(400).json({
                    success: false,
                    message: 'Kode verifikasi tidak valid atau sudah kedaluwarsa.'
                });
            }

            user.is_verified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            user.updatedAt = new Date().toISOString();
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Akun berhasil diverifikasi! Anda sekarang bisa login.'
            });

        } catch (error) {
            console.error('Verify account error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Login endpoint
exports.login = [
    authLimiter,
    ...loginValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { username, password, role } = req.body;

            // Find user
            const user = await User.findOne({ email: username, role });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            // Check if user is active
            if (!user.is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'Akun Anda tidak aktif. Hubungi admin untuk bantuan.'
                });
            }

            // Check if user is verified
            if (!user.is_verified) {
                return res.status(401).json({
                    success: false,
                    message: 'Akun belum diverifikasi. Silakan verifikasi akun Anda.'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            // Generate token
            const token = generateToken(user);

            // Update last login (if you add a lastLogin field to User model)
            // user.lastLogin = new Date().toISOString();
            // await user.save();

            // Remove password from response
            const { password: _, ...userResponse } = user.toObject(); // Use toObject() for Mongoose documents

            res.status(200).json({
                success: true,
                message: 'Login berhasil! Selamat datang kembali.',
                data: {
                    user: userResponse,
                    token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Forgot Password endpoint
exports.forgotPassword = [
    authLimiter, // Apply rate limiting
    ...forgotPasswordValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                // Send a generic success message to prevent email enumeration
                return res.status(200).json({
                    success: true,
                    message: 'Jika email terdaftar, instruksi reset password telah dikirim.'
                });
            }

            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 300000; // 5 minutes from now (300,000 ms)

            // Store the OTP and its expiration in the user object
            user.resetOtp = otp;
            user.resetOtpExpires = otpExpires;
            await user.save();

            // In a real application, you would send this OTP to the user's email/phone.
            // For this in-memory example, we'll log it to the console.
            console.log(`Password reset OTP for ${user.email}: ${otp}`);

            res.status(200).json({
                success: true,
                message: 'Jika email terdaftar, kode verifikasi telah dikirim.',
                // For testing, you might return the OTP here, but NOT in production
                // testOtp: otp
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Reset Password endpoint
exports.resetPassword = [
    authLimiter, // Apply rate limiting
    ...resetPasswordValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { email, otp, newPassword } = req.body;

            // Find user by email and check OTP and expiration
            const user = await User.findOne({ email, resetOtp: otp, resetOtpExpires: { $gt: Date.now() } });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Kode verifikasi tidak valid atau sudah kedaluwarsa.'
                });
            }

            // Hash new password
            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update user's password
            user.password = hashedNewPassword;
            user.updatedAt = new Date().toISOString();

            // Clear OTP fields
            user.resetOtp = undefined;
            user.resetOtpExpires = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password berhasil direset. Silakan login dengan password baru Anda.'
            });

        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Protected route
exports.protectedRoute = (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: 'Anda harus login terlebih dahulu'
            });
        }

        res.status(200).json({
            success: true,
            message: `Selamat datang, ${req.user.nama_lengkap}!`, 
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    nama: req.user.nama_lengkap,
                    role: req.user.role
                },
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Protected route error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: 'Anda harus login terlebih dahulu'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Data pengguna tidak ditemukan'
            });
        }

        const { password: _, ...userResponse } = user.toObject();

        res.status(200).json({
            success: true,
            message: 'Data profil berhasil diambil',
            data: userResponse
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
        });
    }
};

// Update profile
exports.updateProfile = [
    body('nama_lengkap').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nama harus antara 2-100 karakter'),
    body('no_hp').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
    handleValidationErrors,
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({
                    success: false,
                    message: 'Anda harus login terlebih dahulu'
                });
            }

            const { nama_lengkap, no_hp } = req.body;
            const updatedFields = {};

            if (nama_lengkap) updatedFields.nama_lengkap = nama_lengkap.trim();
            if (no_hp) updatedFields.no_hp = no_hp;

            const user = await User.findByIdAndUpdate(req.user.id, { $set: updatedFields }, { new: true, runValidators: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Data pengguna tidak ditemukan'
                });
            }

            const { password: _, ...userResponse } = user.toObject();

            res.status(200).json({
                success: true,
                message: 'Profil berhasil diperbarui',
                data: userResponse
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Change password
exports.changePassword = [
    body('currentPassword').notEmpty().withMessage('Password lama harus diisi'),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password baru minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol'),
    handleValidationErrors,
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({
                    success: false,
                    message: 'Anda harus login terlebih dahulu'
                });
            }

            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Data pengguna tidak ditemukan'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Password lama yang dimasukkan salah'
                });
            }

            // Hash new password
            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update password
            user.password = hashedNewPassword;
            user.updatedAt = new Date().toISOString();
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password berhasil diubah'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
            });
        }
    }
];

// Logout (if using token blacklisting)
exports.logout = (req, res) => {
    try {
        // In a real app, you might want to blacklist the token
        // For now, just return success message
        res.status(200).json({
            success: true,
            message: 'Berhasil logout. Sampai jumpa!'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
        });
    }
};

exports.generateToken = generateToken;