const express = require('express');
const Person = require('./../models/person');
const router = express.Router();


router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id; // Extract the id from the URL parameter
    const updatedPersonData = req.body; // Updated data for the person

    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: 'Person not found' });
    }

    console.log('Data updated');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id;

    const deletedPerson = await Person.findByIdAndDelete(personId);

    if (!deletedPerson) {
      return res.status(404).json({ error: 'Person not found' });
    }

    console.log('Person deleted successfully');
    res.status(200).json({ message: 'Person deleted successfully', data: deletedPerson });
  } catch (err) {
    console.log('Error deleting person:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports=router;