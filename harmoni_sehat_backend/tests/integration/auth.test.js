const request = require('supertest');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB } = require('../../config/testDb');
const User = require('../../models/User');
const app = require('../../server'); // Assuming your express app is exported from server.js

describe('Auth API Integration Tests', () => {
    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        // Clean up database after each test
        await User.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // --- Register Endpoint Tests ---
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                nama_lengkap: 'Test User',
                no_hp: '081234567890',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                role: 'Pasien'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Pendaftaran berhasil!');

            const userInDb = await User.findOne({ email: 'test@example.com' });
            expect(userInDb).toBeDefined();
            expect(userInDb.is_verified).toBe(false);
            expect(userInDb.customUserId).toMatch(/^08-/);
        });

        it('should return 409 if email already exists', async () => {
            const userData = {
                email: 'existing@example.com',
                nama_lengkap: 'Existing User',
                no_hp: '081234567890',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                role: 'Pasien'
            };
            await request(app).post('/api/auth/register').send(userData); // Register once

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData); // Register again with same email

            expect(res.statusCode).toEqual(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Email existing@example.com sudah terdaftar.');
        });

        it('should return 400 for invalid input', async () => {
            const userData = {
                email: 'invalid-email',
                nama_lengkap: 'T',
                no_hp: '123',
                password: 'short',
                confirmPassword: 'short',
                role: 'Pasien'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Data yang dimasukkan tidak valid');
            expect(res.body.errors).toBeDefined();
        });
    });

    // --- Login Endpoint Tests ---
    describe('POST /api/auth/login', () => {
        let registeredUser;
        beforeEach(async () => {
            // Register a user for login tests
            const userData = {
                email: 'login@example.com',
                nama_lengkap: 'Login User',
                no_hp: '089876543210',
                password: 'LoginPassword123!',
                confirmPassword: 'LoginPassword123!',
                role: 'Pasien'
            };
            await request(app).post('/api/auth/register').send(userData);
            registeredUser = await User.findOne({ email: 'login@example.com' });
            registeredUser.is_verified = true; // Manually verify for login test
            await registeredUser.save();
        });

        it('should log in a verified user and return tokens', async () => {
            const loginData = {
                username: 'login@example.com',
                password: 'LoginPassword123!',
                role: 'Pasien'
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();

            const userInDb = await User.findById(registeredUser._id);
            expect(userInDb.refreshTokens).toContain(res.body.data.refreshToken);
        });

        it('should return 401 for unverified user', async () => {
            registeredUser.is_verified = false; // Set back to unverified
            await registeredUser.save();

            const loginData = {
                username: 'login@example.com',
                password: 'LoginPassword123!',
                role: 'Pasien'
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Akun belum diverifikasi.');
        });

        it('should return 401 for invalid password', async () => {
            const loginData = {
                username: 'login@example.com',
                password: 'WrongPassword',
                role: 'Pasien'
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Email atau password salah');
        });
    });

    // --- Verify Account Endpoint Tests ---
    describe('POST /api/auth/verify-account', () => {
        let unverifiedUser;
        beforeEach(async () => {
            const userData = {
                email: 'unverified@example.com',
                nama_lengkap: 'Unverified User',
                no_hp: '081111111111',
                password: 'UnverifiedPassword123!',
                confirmPassword: 'UnverifiedPassword123!',
                role: 'Pasien'
            };
            await request(app).post('/api/auth/register').send(userData);
            unverifiedUser = await User.findOne({ email: 'unverified@example.com' });
        });

        it('should verify account with correct code', async () => {
            const res = await request(app)
                .post('/api/auth/verify-account')
                .send({ email: unverifiedUser.email, code: unverifiedUser.verificationCode });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Akun berhasil diverifikasi!');

            const userInDb = await User.findById(unverifiedUser._id);
            expect(userInDb.is_verified).toBe(true);
            expect(userInDb.verificationCode).toBeUndefined();
        });

        it('should return 400 for invalid code and increment attempts', async () => {
            const res = await request(app)
                .post('/api/auth/verify-account')
                .send({ email: unverifiedUser.email, code: 'wrongcode' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Kode verifikasi tidak valid atau sudah kedaluwarsa.');

            const userInDb = await User.findById(unverifiedUser._id);
            expect(userInDb.otpAttempts).toBe(1);
        });

        it('should lock account after max attempts', async () => {
            // Make 4 wrong attempts (total 5 including this one will lock)
            for (let i = 0; i < 4; i++) {
                await request(app)
                    .post('/api/auth/verify-account')
                    .send({ email: unverifiedUser.email, code: 'wrongcode' });
            }

            const res = await request(app)
                .post('/api/auth/verify-account')
                .send({ email: unverifiedUser.email, code: 'wrongcode' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Akun Anda telah dikunci selama 15 menit');

            const userInDb = await User.findById(unverifiedUser._id);
            expect(userInDb.otpLockUntil).toBeDefined();
            expect(userInDb.otpLockUntil).toBeGreaterThan(Date.now());
        });

        it('should return 429 if account is locked', async () => {
            // Manually lock the account
            unverifiedUser.otpAttempts = 5;
            unverifiedUser.otpLockUntil = Date.now() + (15 * 60 * 1000); // Lock for 15 mins
            await unverifiedUser.save();

            const res = await request(app)
                .post('/api/auth/verify-account')
                .send({ email: unverifiedUser.email, code: unverifiedUser.verificationCode });

            expect(res.statusCode).toEqual(429);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Akun terkunci karena terlalu banyak percobaan OTP yang gagal.');
        });
    });

    // --- Refresh Token Endpoint Tests ---
    describe('POST /api/auth/refresh-token', () => {
        let loggedInUser, refreshToken;
        beforeEach(async () => {
            // Register and login a user to get a refresh token
            const userData = {
                email: 'refresh@example.com',
                nama_lengkap: 'Refresh User',
                no_hp: '087654321098',
                password: 'RefreshPassword123!',
                confirmPassword: 'RefreshPassword123!',
                role: 'Pasien'
            };
            await request(app).post('/api/auth/register').send(userData);
            loggedInUser = await User.findOne({ email: 'refresh@example.com' });
            loggedInUser.is_verified = true;
            await loggedInUser.save();

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ username: 'refresh@example.com', password: 'RefreshPassword123!', role: 'Pasien' });
            refreshToken = loginRes.body.data.refreshToken;
        });

        it('should return a new access token with a valid refresh token', async () => {
            const res = await request(app)
                .post('/api/auth/refresh-token')
                .send({ refreshToken });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.accessToken).toBeDefined();
        });

        it('should return 401 if refresh token is missing', async () => {
            const res = await request(app)
                .post('/api/auth/refresh-token')
                .send({});

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Refresh token tidak ditemukan.');
        });

        it('should return 403 if refresh token is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/refresh-token')
                .send({ refreshToken: 'invalidtoken' });

            expect(res.statusCode).toEqual(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Refresh token tidak valid.');
        });
    });

    // --- Logout Endpoint Tests ---
    describe('POST /api/auth/logout', () => {
        let loggedInUser, refreshToken;
        beforeEach(async () => {
            // Register and login a user to get a refresh token
            const userData = {
                email: 'logout@example.com',
                nama_lengkap: 'Logout User',
                no_hp: '081234567890',
                password: 'LogoutPassword123!',
                confirmPassword: 'LogoutPassword123!',
                role: 'Pasien'
            };
            await request(app).post('/api/auth/register').send(userData);
            loggedInUser = await User.findOne({ email: 'logout@example.com' });
            loggedInUser.is_verified = true;
            await loggedInUser.save();

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ username: 'logout@example.com', password: 'LogoutPassword123!', role: 'Pasien' });
            refreshToken = loginRes.body.data.refreshToken;
        });

        it('should successfully log out a user and remove refresh token', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${refreshToken}`)
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Berhasil logout.');

            const userInDb = await User.findById(loggedInUser._id);
            expect(userInDb.refreshTokens).not.toContain(refreshToken);
        });

        it('should return 401 if authorization header is missing', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .send();

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Authorization token missing');
        });

        it('should return 403 if refresh token is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer invalidtoken')
                .send();

            expect(res.statusCode).toEqual(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Token tidak valid.');
        });
    });
});
