import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
    try {
        const mongoUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
        if (!mongoUri) {
            logger.error('MONGO_URI is not defined in environment variables.');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        logger.info(`MongoDB Connected (${process.env.NODE_ENV === 'test' ? 'Test DB' : 'Main DB'})...`);
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
