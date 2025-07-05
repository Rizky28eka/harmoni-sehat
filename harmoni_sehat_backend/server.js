require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db'); // Import the connectDB function

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});