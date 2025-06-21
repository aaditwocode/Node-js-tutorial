const mongoose = require('mongoose');

const mongo_url = 'mongodb://localhost:27017/hotels';

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to hotels database');
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = db;