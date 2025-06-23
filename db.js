const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.DB_URL_LOCAL; // 📝 Local MongoDB URI (optional, for local testing)
// const mongo_url = process.env.DB_URL; // ✅ MongoDB Atlas URI for production

async function connectToDB() {
  try {
    await mongoose.connect(mongo_url); // modern default connection (no deprecated options)
    console.log('✅ Mongoose connected to hotels database');
  } catch (err) {
    console.error('❌ Mongoose connection error:', err.message);
    process.exit(1); // Exit if DB fails to connect
  }

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
}

module.exports = connectToDB;
