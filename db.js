const mongoose = require('mongoose');


//const mongo_url = process.env.DB_URL_LOCAL;
const mongo_url = process.env.DB_URL;

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