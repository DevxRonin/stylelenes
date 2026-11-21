const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGO_URI is not configured in .env. Running with in-memory resilient mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB Connection Notice] ${error.message}`);
    console.warn('💡 To connect to MongoDB Atlas, add your connection string to backend/.env');
    isConnected = false;
    return false;
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
