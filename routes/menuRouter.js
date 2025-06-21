const express = require('express');
const Menu = require('./../models/menu');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const savedMenu = await newMenu.save();
    console.log('Menu saved successfully');
    res.status(201).json(savedMenu);
  } catch (error) {
    console.log('Error saving menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find({});
    console.log('Menus fetched successfully');
    res.status(200).json(menus);
  } catch (error) {
    console.log('Error fetching menus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
