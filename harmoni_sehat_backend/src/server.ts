import 'dotenv/config';
import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db';
import cors from 'cors';
import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';
import pasienRoutes from './routes/pasienRoutes';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger';

const checkEnvVariables = () => {
    const requiredEnv = [
        'MONGO_URI',
        'JWT_SECRET',
        'SESSION_SECRET',
        'ENCRYPTION_KEY',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS',
        'EMAIL_FROM',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
    ];

    const missing: string[] = [];
    for (const envVar of requiredEnv) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        logger.error(`FATAL ERROR: Missing environment variables: ${missing.join(', ')}. Please check your .env file.`);
        process.exit(1);
    }
};

checkEnvVariables();

const app = express();

// Connect Database
void connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Session middleware for Passport
app.use(session({
    secret: process.env.SESSION_SECRET as string, // Use a strong secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
import './config/passport-setup';

// Define Routes
app.use('/api/pasiens', pasienRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => res.sendFile(__dirname + '/public/index.html'));

// Not Found Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

export default app;