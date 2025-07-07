const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

// -----------------------------------------

const User = require('../models/User');
const Pasien = require('../models/Pasien');
const Dokter = require('../models/Dokter');
const Apoteker = require('../models/Apoteker');
const { sendVerificationEmail } = require('../services/emailService');
const { generateCustomUserId, encrypt, decrypt, createHash } = require('../services/userService'); // Import from userService

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

const OTP_MAX_ATTEMPTS = 5; // Max attempts for OTP verification
const OTP_LOCK_TIME = 15 * 60 * 1000; // 15 minutes lockout for OTP

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
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m', // Access token expires in 15 minutes
        issuer: 'your-app-name',
        audience: 'your-app-users'
    });
};

const generateRefreshToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d', // Refresh token expires in 7 days
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

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Generate verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = Date.now() + 3600000; // 1 hour from now

            // Generate custom user ID
            const customUserId = generateCustomUserId(role);

            // Encrypt phone number and create hash
            const encryptedNoHp = encrypt(no_hp);
            const noHpHash = createHash(no_hp);

            // Create user object
            const newUser = new User({
                email,
                nama_lengkap: nama_lengkap.trim(),
                no_hp: encryptedNoHp,
                no_hp_hash: noHpHash,
                customUserId,
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
            // console.log(`Verification code for ${newUser.email}: ${verificationCode}`);
            await sendVerificationEmail(newUser.email, newUser.nama_lengkap, verificationCode);

            res.status(201).json({
                success: true,
                message: 'Pendaftaran berhasil! Silakan verifikasi akun Anda dengan kode yang dikirimkan.',
                data: { email: newUser.email, role: newUser.role }
            });

        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 11000) {
                let message = 'Terjadi kesalahan duplikasi.';
                if (error.keyPattern.email) {
                    message = `Email ${email} sudah terdaftar.`;
                } else if (error.keyPattern.no_hp_hash) {
                    message = `Nomor telepon ${no_hp} sudah terdaftar.`;
                }
                return res.status(409).json({
                    success: false,
                    message: message
                });
            }
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

            // Check if account is locked due to too many OTP attempts
            if (user.otpLockUntil && user.otpLockUntil > Date.now()) {
                const remainingTime = Math.ceil((user.otpLockUntil - Date.now()) / (60 * 1000));
                return res.status(429).json({
                    success: false,
                    message: `Akun terkunci karena terlalu banyak percobaan OTP yang gagal. Silakan coba lagi dalam ${remainingTime} menit.`
                });
            }

            if (user.is_verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Akun sudah terverifikasi.'
                });
            }

            if (user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
                // Increment OTP attempts
                user.otpAttempts = (user.otpAttempts || 0) + 1;
                if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
                    user.otpLockUntil = Date.now() + OTP_LOCK_TIME;
                    user.otpAttempts = 0; // Reset attempts after locking
                    await user.save();
                    return res.status(400).json({
                        success: false,
                        message: `Kode verifikasi tidak valid. Akun Anda telah dikunci selama ${OTP_LOCK_TIME / (60 * 1000)} menit karena terlalu banyak percobaan yang gagal.`
                    });
                }
                await user.save();
                return res.status(400).json({
                    success: false,
                    message: 'Kode verifikasi tidak valid atau sudah kedaluwarsa.'
                });
            }

            // OTP is correct, reset attempts and lock
            user.is_verified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            user.otpAttempts = 0;
            user.otpLockUntil = undefined;
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

            // Generate tokens
            const accessToken = generateToken(user);
            const refreshToken = generateRefreshToken(user);

            // Store refresh token in database
            user.refreshTokens.push(refreshToken);
            await user.save();

            // Remove password from response
            const { password: _, ...userResponse } = user.toObject(); // Use toObject() for Mongoose documents

            res.status(200).json({
                success: true,
                message: 'Login berhasil! Selamat datang kembali.',
                data: {
                    user: userResponse,
                    accessToken,
                    refreshToken
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

            // Check if account is locked due to too many OTP attempts
            if (user.otpLockUntil && user.otpLockUntil > Date.now()) {
                const remainingTime = Math.ceil((user.otpLockUntil - Date.now()) / (60 * 1000));
                return res.status(429).json({
                    success: false,
                    message: `Akun terkunci karena terlalu banyak permintaan reset password. Silakan coba lagi dalam ${remainingTime} menit.`
                });
            }

            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 300000; // 5 minutes from now (300,000 ms)

            // Store the OTP and its expiration in the user object
            user.resetOtp = otp;
            user.resetOtpExpires = otpExpires;
            user.otpAttempts = 0; // Reset attempts on new OTP request
            user.otpLockUntil = undefined; // Clear lock on new OTP request
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

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email tidak ditemukan.'
                });
            }

            // Check if account is locked due to too many OTP attempts
            if (user.otpLockUntil && user.otpLockUntil > Date.now()) {
                const remainingTime = Math.ceil((user.otpLockUntil - Date.now()) / (60 * 1000));
                return res.status(429).json({
                    success: false,
                    message: `Akun terkunci karena terlalu banyak percobaan OTP yang gagal. Silakan coba lagi dalam ${remainingTime} menit.`
                });
            }

            // Check OTP and expiration
            if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
                // Increment OTP attempts
                user.otpAttempts = (user.otpAttempts || 0) + 1;
                if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
                    user.otpLockUntil = Date.now() + OTP_LOCK_TIME;
                    user.otpAttempts = 0; // Reset attempts after locking
                    await user.save();
                    return res.status(400).json({
                        success: false,
                        message: `Kode OTP tidak valid. Akun Anda telah dikunci selama ${OTP_LOCK_TIME / (60 * 1000)} menit karena terlalu banyak percobaan yang gagal.`
                    });
                }
                await user.save();
                return res.status(400).json({
                    success: false,
                    message: 'Kode OTP tidak valid atau sudah kedaluwarsa.'
                });
            }

            // OTP is correct, reset attempts and lock
            user.otpAttempts = 0;
            user.otpLockUntil = undefined;

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
        if (userResponse.no_hp) {
            userResponse.no_hp = decrypt(userResponse.no_hp);
        }

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
            if (no_hp) {
                updatedFields.no_hp = encrypt(no_hp);
                updatedFields.no_hp_hash = createHash(no_hp);
            }

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
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

        // Verify the token to get user ID
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Token tidak valid.' });

            const foundUser = await User.findById(user.id);
            if (!foundUser) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });

            // Remove the refresh token from the user's record
            foundUser.refreshTokens = foundUser.refreshTokens.filter(t => t !== token);
            await foundUser.save();

            res.status(200).json({
                success: true,
                message: 'Berhasil logout. Sampai jumpa!'
            });
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
        });
    }
};

// Refresh Token endpoint
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token tidak ditemukan.' });

    try {
        const foundUser = await User.findOne({ refreshTokens: refreshToken });
        if (!foundUser) return res.status(403).json({ success: false, message: 'Refresh token tidak valid.' });

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Refresh token tidak valid atau kedaluwarsa.' });

            // Generate new access token
            const newAccessToken = generateToken(foundUser);

            res.status(200).json({
                success: true,
                message: 'Access token berhasil diperbarui.',
                accessToken: newAccessToken
            });
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem. Silakan coba lagi.'
        });
    }
};

exports.generateToken = generateToken;