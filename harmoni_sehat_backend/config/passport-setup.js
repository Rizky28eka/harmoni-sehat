const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { users } = require('../controllers/authController'); // Access the in-memory user store
const { generateToken } = require('../controllers/authController'); // Access generateToken helper

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in our in-memory store
        const existingUser = users.find(user => user.googleId === profile.id);

        if (existingUser) {
            // User already exists, log them in
            console.log('Existing Google user:', existingUser.email);
            done(null, existingUser);
        } else {
            // If not, create new user
            const newUser = {
                id: users.length + 1, // Simple ID generation
                googleId: profile.id,
                email: profile.emails[0].value, // Assuming email is always available
                nama: profile.displayName,
                role: 'Pasien', // Default role for new Google users
                isVerified: true, // Google users are considered verified
                createdAt: new Date().toISOString(),
                isActive: true
            };
            users.push(newUser);
            console.log('New Google user created:', newUser.email);
            done(null, newUser);
        }
    })
);
