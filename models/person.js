const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  work: {
    type: String,
    enum: ['chef', 'waiter', 'manager']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: String,
  salary: Number
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
