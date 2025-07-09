import mongoose from 'mongoose';
import { MONGO_URI } from './env';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
