const express = require('express');
const app = express();
const db = require('./db');
const Person = require('./models/person');
const Menu = require('./models/menu');

const bodyparser = require('body-parser');
app.use(bodyparser.json()); //req.body saved

app.get('/', (req, res) => {
  res.send('Hello World welcome to your hotel');
});

// POST route to add a person
app.post('/persons', async (req, res) => {
    try {
        // Assuming the request body contains the person data
        const data = req.body;

        // Create a new Person document using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person to the database using await
        const savedPerson = await newPerson.save();
        
        console.log('Data saved successfully');
        res.status(200).json(savedPerson);
        
    } catch (error) {
        console.log('Error saving person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to fetch all persons
app.get('/persons', async (req, res) => {
    try {
        // Find all persons in the database
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
    // Check if any person with the given workType exists
    const exists = await Person.exists({ work: workType });

    if (!exists) {
      return res.status(400).json({ error: 'Invalid work type' });
    }

    // Fetch all persons with that work type
    const persons = await Person.find({ work: workType });

    console.log('Response fetched successfully');
    res.status(200).json(persons);
  } catch (error) {
    console.log('Error fetching persons by workType:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const personRoutes = require('./routes/personRoutes');
app.use('/persons' , personRoutes);

const menuRoutes = require('./routes/menuRouter');
app.use('/menus', menuRoutes);


app.listen(3000, () => {
  console.log('This port is about to start');
});
