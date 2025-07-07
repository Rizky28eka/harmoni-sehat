const { register, verifyAccount, login, forgotPassword, resetPassword, generateToken, generateRefreshToken } = require('../../controllers/authController');
const User = require('../../models/User');
const Pasien = require('../../models/Pasien');
const Dokter = require('../../models/Dokter');
const Apoteker = require('../../models/Apoteker');
const { sendVerificationEmail } = require('../../services/emailService');
const { generateCustomUserId, encrypt, createHash } = require('../../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock all external dependencies
jest.mock('../../models/User');
jest.mock('../../models/Pasien');
jest.mock('../../models/Dokter');
jest.mock('../../models/Apoteker');
jest.mock('../../services/emailService');
jest.mock('../../services/userService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn()
        };
        next = jest.fn();

        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock bcrypt and jwt behavior
        bcrypt.hash.mockResolvedValue('hashedPassword');
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken');
        jwt.verify.mockReturnValue({ id: 'mockUserId', email: 'test@example.com', role: 'Pasien' });

        // Mock userService functions
        encrypt.mockReturnValue('encryptedPhone');
        createHash.mockReturnValue('phoneHash');
        generateCustomUserId.mockReturnValue('08-TESTID');
        sendVerificationEmail.mockResolvedValue(true);

        // Mock User model methods
        User.findOne.mockResolvedValue(null);
        User.create.mockImplementation((data) => {
            return { ...data, _id: 'newUserId', toObject: () => ({ ...data, _id: 'newUserId' }) };
        });
        User.findById.mockResolvedValue(null);
        User.findByIdAndUpdate.mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue(true);
    });

    // --- Register Tests ---
    describe('register', () => {
        it('should register a new Pasien user and send verification email', async () => {
            req.body = {
                email: 'test@example.com',
                nama_lengkap: 'Test User',
                no_hp: '081234567890',
                password: 'Password123!',
                role: 'Pasien'
            };

            await register[register.length - 1](req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 12);
            expect(generateCustomUserId).toHaveBeenCalledWith('Pasien');
            expect(encrypt).toHaveBeenCalledWith('081234567890');
            expect(createHash).toHaveBeenCalledWith('081234567890');
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com',
                nama_lengkap: 'Test User',
                no_hp: 'encryptedPhone',
                no_hp_hash: 'phoneHash',
                customUserId: '08-TESTID',
                password: 'hashedPassword',
                role: 'Pasien',
                is_verified: false,
                verificationCode: expect.any(String),
                verificationCodeExpires: expect.any(Date)
            }));
            expect(Pasien.create).toHaveBeenCalledWith({ user_id: 'newUserId' });
            expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', 'Test User', expect.any(String));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Pendaftaran berhasil! Silakan verifikasi akun Anda dengan kode yang dikirimkan.'
            }));
        });

        it('should return 409 if email already exists', async () => {
            req.body = {
                email: 'existing@example.com',
                nama_lengkap: 'Existing User',
                no_hp: '081234567890',
                password: 'Password123!',
                role: 'Pasien'
            };
            User.create.mockRejectedValueOnce({ code: 11000, keyPattern: { email: 1 } });

            await register[register.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Email existing@example.com sudah terdaftar.'
            }));
        });

        it('should return 409 if phone number already exists', async () => {
            req.body = {
                email: 'test@example.com',
                nama_lengkap: 'Test User',
                no_hp: '081111111111',
                password: 'Password123!',
                role: 'Pasien'
            };
            User.create.mockRejectedValueOnce({ code: 11000, keyPattern: { no_hp_hash: 1 } });

            await register[register.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Nomor telepon 081111111111 sudah terdaftar.'
            }));
        });

        it('should return 400 for invalid role-specific fields', async () => {
            req.body = {
                email: 'dokter@example.com',
                nama_lengkap: 'Dr. Test',
                no_hp: '081234567890',
                password: 'Password123!',
                role: 'Dokter'
                // Missing spesialisasi, noIzinPraktik, alamatKlinik
            };

            await register[register.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Data tidak lengkap',
                errors: expect.arrayContaining([
                    'Spesialisasi harus diisi untuk akun Dokter',
                    'Nomor Izin Praktik harus diisi untuk akun Dokter',
                    'Alamat Klinik harus diisi untuk akun Dokter'
                ])
            }));
        });
    });

    // --- Verify Account Tests ---
    describe('verifyAccount', () => {
        it('should verify account with correct code', async () => {
            const mockUser = {
                email: 'test@example.com',
                is_verified: false,
                verificationCode: '123456',
                verificationCodeExpires: Date.now() + 3600000,
                otpAttempts: 2,
                otpLockUntil: null,
                save: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { email: 'test@example.com', code: '123456' };

            await verifyAccount[verifyAccount.length - 1](req, res);

            expect(mockUser.is_verified).toBe(true);
            expect(mockUser.verificationCode).toBeUndefined();
            expect(mockUser.verificationCodeExpires).toBeUndefined();
            expect(mockUser.otpAttempts).toBe(0);
            expect(mockUser.otpLockUntil).toBeUndefined();
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Akun berhasil diverifikasi! Anda sekarang bisa login.'
            }));
        });

        it('should return 400 for invalid or expired code and increment attempts', async () => {
            const mockUser = {
                email: 'test@example.com',
                is_verified: false,
                verificationCode: '654321',
                verificationCodeExpires: Date.now() + 3600000,
                otpAttempts: 0,
                otpLockUntil: null,
                save: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { email: 'test@example.com', code: '111111' }; // Wrong code

            await verifyAccount[verifyAccount.length - 1](req, res);

            expect(mockUser.otpAttempts).toBe(1);
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Kode verifikasi tidak valid atau sudah kedaluwarsa.'
            }));
        });

        it('should lock account after max OTP attempts', async () => {
            const mockUser = {
                email: 'test@example.com',
                is_verified: false,
                verificationCode: '654321',
                verificationCodeExpires: Date.now() + 3600000,
                otpAttempts: 4, // 1 less than OTP_MAX_ATTEMPTS (5)
                otpLockUntil: null,
                save: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { email: 'test@example.com', code: '111111' }; // Wrong code

            await verifyAccount[verifyAccount.length - 1](req, res);

            expect(mockUser.otpAttempts).toBe(0); // Reset after lock
            expect(mockUser.otpLockUntil).toBeGreaterThan(Date.now());
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: expect.stringContaining('Akun Anda telah dikunci selama 15 menit')
            }));
        });

        it('should return 429 if account is locked', async () => {
            const mockUser = {
                email: 'test@example.com',
                is_verified: false,
                verificationCode: '654321',
                verificationCodeExpires: Date.now() + 3600000,
                otpAttempts: 0,
                otpLockUntil: Date.now() + 900000, // Locked for 15 minutes
                save: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { email: 'test@example.com', code: '111111' };

            await verifyAccount[verifyAccount.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: expect.stringContaining('Akun terkunci karena terlalu banyak percobaan OTP yang gagal.')
            }));
        });
    });

    // --- Login Tests ---
    describe('login', () => {
        it('should log in a user and return access and refresh tokens', async () => {
            const mockUser = {
                _id: 'userId123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'Pasien',
                nama_lengkap: 'Test User',
                is_active: true,
                is_verified: true,
                refreshTokens: [],
                toObject: () => ({ _id: 'userId123', email: 'test@example.com', role: 'Pasien', nama_lengkap: 'Test User', refreshTokens: [] }),
                save: jest.fn().mockResolvedValue(true)
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { username: 'test@example.com', password: 'Password123!', role: 'Pasien' };

            await login[login.length - 1](req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com', role: 'Pasien' });
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledTimes(2); // For access and refresh tokens
            expect(mockUser.refreshTokens).toContain('mockToken');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    accessToken: 'mockToken',
                    refreshToken: 'mockToken'
                })
            }));
        });

        it('should return 401 for invalid password', async () => {
            const mockUser = {
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'Pasien',
                is_active: true,
                is_verified: true,
                toObject: () => ({}),
                save: jest.fn()
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // Invalid password

            req.body = { username: 'test@example.com', password: 'WrongPassword', role: 'Pasien' };

            await login[login.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Email atau password salah'
            }));
        });

        it('should return 401 if user is not verified', async () => {
            const mockUser = {
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'Pasien',
                is_active: true,
                is_verified: false, // Not verified
                toObject: () => ({}),
                save: jest.fn()
            };
            User.findOne.mockResolvedValue(mockUser);

            req.body = { username: 'test@example.com', password: 'Password123!', role: 'Pasien' };

            await login[login.length - 1](req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Akun belum diverifikasi. Silakan verifikasi akun Anda.'
            }));
        });
    });

    // --- Logout Tests ---
    describe('logout', () => {
        it('should successfully log out a user by removing refresh token', async () => {
            const mockUser = {
                _id: 'userId123',
                refreshTokens: ['mockToken1', 'mockToken2'],
                save: jest.fn().mockResolvedValue(true)
            };
            User.findById.mockResolvedValue(mockUser);
            req.headers.authorization = 'Bearer mockToken1';
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 'userId123' });
            });

            await exports.logout(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('mockToken1', process.env.JWT_SECRET, expect.any(Function));
            expect(mockUser.refreshTokens).not.toContain('mockToken1');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Berhasil logout. Sampai jumpa!' });
        });

        it('should return 401 if token is missing', async () => {
            req.headers.authorization = '';

            await exports.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token tidak ditemukan.' });
        });

        it('should return 403 if token is invalid', async () => {
            req.headers.authorization = 'Bearer invalidToken';
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new Error('Invalid token'), null);
            });

            await exports.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token tidak valid.' });
        });
    });

    // --- Refresh Token Tests ---
    describe('refreshToken', () => {
        it('should return a new access token with a valid refresh token', async () => {
            const mockUser = {
                _id: 'userId123',
                email: 'test@example.com',
                role: 'Pasien',
                nama_lengkap: 'Test User',
                refreshTokens: ['validRefreshToken'],
            };
            User.findOne.mockResolvedValue(mockUser);
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 'userId123' });
            });
            jwt.sign.mockReturnValue('newAccessToken');

            req.body = { refreshToken: 'validRefreshToken' };

            await exports.refreshToken(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ refreshTokens: 'validRefreshToken' });
            expect(jwt.verify).toHaveBeenCalledWith('validRefreshToken', process.env.JWT_SECRET, expect.any(Function));
            expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({ id: 'userId123' }), process.env.JWT_SECRET, expect.objectContaining({ expiresIn: '15m' }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                accessToken: 'newAccessToken'
            }));
        });

        it('should return 401 if refresh token is missing', async () => {
            req.body = {};

            await exports.refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Refresh token tidak ditemukan.' });
        });

        it('should return 403 if refresh token is invalid or not found', async () => {
            User.findOne.mockResolvedValue(null); // Refresh token not found in DB
            req.body = { refreshToken: 'invalidRefreshToken' };

            await exports.refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Refresh token tidak valid.' });
        });

        it('should return 403 if refresh token is expired or malformed', async () => {
            const mockUser = {
                _id: 'userId123',
                email: 'test@example.com',
                role: 'Pasien',
                nama_lengkap: 'Test User',
                refreshTokens: ['expiredRefreshToken'],
            };
            User.findOne.mockResolvedValue(mockUser);
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new jwt.TokenExpiredError('jwt expired'), null);
            });

            req.body = { refreshToken: 'expiredRefreshToken' };

            await exports.refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Refresh token tidak valid atau kedaluwarsa.' });
        });
    });
});
