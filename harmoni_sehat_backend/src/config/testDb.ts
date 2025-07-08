import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectTestDB = async () => {
    try {
        if (!process.env.MONGO_URI_TEST) {
            logger.error('MONGO_URI_TEST is not defined in environment variables.');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI_TEST);
        logger.info('Test MongoDB Connected...');
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
};

const disconnectTestDB = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        logger.info('Test MongoDB Disconnected.');
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
};

export { connectTestDB, disconnectTestDB };