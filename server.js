const express = require('express');
const app = express();
require('dotenv').config(); // Load .env variables

const connectToDB = require('./db');
const Person = require('./models/person');
const Menu = require('./models/menu');

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (req, res) => {
  res.send('Hello World, welcome to your hotel');
});

// Inline person routes
app.post('/persons', async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();
    console.log('Data saved successfully');
    res.status(200).json(savedPerson);
  } catch (error) {
    console.log('Error saving person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/persons', async (req, res) => {
  try {
    const persons = await Person.find({});
    console.log('Data fetched successfully');
    res.status(200).json(persons);
  } catch (error) {
    console.log('Error fetching persons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/menu', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).send(menu);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get('/persons/:workType', async (req, res) => {
  const workType = req.params.workType.toLowerCase();

  try {
    const exists = await Person.exists({ work: workType });

    if (!exists) {
      return res.status(400).json({ error: 'Invalid work type' });
    }

    const persons = await Person.find({ work: workType });
    console.log('Response fetched successfully');
    res.status(200).json(persons);
  } catch (error) {
    console.log('Error fetching persons by workType:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// External routes
const personRoutes = require('./routes/personRoutes');
app.use('/persons', personRoutes);

const menuRoutes = require('./routes/menuRouter');
app.use('/menus', menuRoutes);

// Start the server only after DB is connected
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
