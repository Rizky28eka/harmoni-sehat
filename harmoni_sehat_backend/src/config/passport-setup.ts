import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import logger from '../utils/logger';
import User from '../models/User'; // Import User model
import { generateCustomUserId } from '../services/userService'; // Import generateCustomUserId

passport.serializeUser((user: any, done: (err: Error | null, id?: string) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done: (err: Error | null, user?: any) => void) => {
    try {
        const user = await User.findById(id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        done(null, user);
    } catch (error) {
        done(error as Error, null);
    }
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: 'http://localhost:3001/api/auth/google/callback'
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (err: Error | null, user?: any) => void) => {
        try {
            // Check if user already exists in our database
            const currentUser = await User.findOne({ googleId: profile.id });

            if (currentUser) {
                // User already exists, log them in
                logger.info(`Existing Google user: ${currentUser.email}`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                logger.info(`New Google user created: ${newUser.email}`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                done(null, newUser);
            }
        } catch (error: any) {
            logger.error('Error during Google OAuth:', error);
            done(error as Error, null);
        }
    })
);