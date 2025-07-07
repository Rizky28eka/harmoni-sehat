require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
    await mongoose.connect(mongoUri, {});
    console.log(`MongoDB Connected (${process.env.NODE_ENV === 'test' ? 'Test DB' : 'Main DB'})...`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;