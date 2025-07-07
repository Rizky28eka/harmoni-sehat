const mongoose = require('mongoose');

const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Test MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Test MongoDB Disconnected.');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = { connectTestDB, disconnectTestDB };
