const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User'); // Import User model
const { generateCustomUserId } = require('../services/userService'); // Import generateCustomUserId

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3001/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in our database
            let currentUser = await User.findOne({ googleId: profile.id });

            if (currentUser) {
                // User already exists, log them in
                console.log('Existing Google user:', currentUser.email);
                done(null, currentUser);
            } else {
                // If not, create new user in our database
                const defaultRole = 'Pasien';
                const customUserId = generateCustomUserId(defaultRole);
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    nama_lengkap: profile.displayName,
                    role: defaultRole, // Default role for new Google users
                    is_verified: true, // Google users are considered verified
                    password: 'google_oauth_user', // Placeholder password, will not be used for login
                    no_hp: 'encrypted_google_phone', // Placeholder for encrypted phone number
                    no_hp_hash: 'google_phone_hash', // Placeholder for phone number hash
                    customUserId: customUserId
                });
                await newUser.save();
                console.log('New Google user created:', newUser.email);
                done(null, newUser);
            }
        } catch (error) {
            console.error('Error during Google OAuth:', error);
            done(error, null);
        }
    })
);
