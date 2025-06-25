const express = require('express');
const app = express();
require('dotenv').config();

const connectToDB = require('./db');
const Person = require('./models/person');
const Menu = require('./models/menu');
const { generateToken } = require('./jwt'); 

const bodyparser = require('body-parser');
app.use(bodyparser.json());

// ✅ Import passport and middleauth from auth.js
const { passport, middleauth } = require('./auth');

// ✅ Initialize passport
app.use(passport.initialize());

// ✅ Log middleware
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()}: Request Made to: ${req.originalUrl}`);
    next();
};
app.use(logRequest);

// ✅ Auth-protected base route
app.get('/', middleauth, (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to our Hotel!`);
});

// ✅ Create new person (unprotected)
app.post('/persons/signup', async (req, res) => {
    try {
        const newPerson = new Person(req.body);
        const savedPerson = await newPerson.save();
        console.log('Data saved successfully');

        const token = generateToken(savedPerson.username); // ✅ Correct usage
        console.log("Token is: ", token);

        res.status(200).json({ user: savedPerson, token: token }); // ✅ Send one clean response
    } catch (error) {
        console.log('Error saving person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/persons/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find user by username
        const user = await Person.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 2. Compare password using bcrypt
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 3. Generate token with payload (username + id)
        const payload = { username: user.username, id: user._id };
        const token = generateToken(payload); // ✅ Your jwt.js should accept object payload

        // 4. Send response with token
        res.json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ✅ Get ONLY the authenticated person
app.get('/persons', middleauth, async (req, res) => {
    try {
        const person = await Person.findById(req.user._id).select('-password -username');
        if (!person) return res.status(404).json({ error: 'User not found' });

        console.log('User data fetched successfully');
        res.status(200).json([person]); // return as array if needed
    } catch (error) {
        console.log('Error fetching person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ Create menu (protected)
app.post('/menu', async (req, res) => {
    try {
        const menu = new Menu(req.body);
        await menu.save();
        res.status(201).send(menu);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// // ✅ Get persons by work type (protected)
// app.get('/persons/:workType', middleauth, async (req, res) => {
//     const workType = req.params.workType.toLowerCase();

//     try {
//         const exists = await Person.exists({ work: workType });
//         if (!exists) {
//             return res.status(400).json({ error: 'Invalid work type' });
//         }

//         const persons = await Person.find({ work: workType }).select('-password -username');
//         console.log('Response fetched successfully');
//         res.status(200).json(persons);
//     } catch (error) {
//         console.log('Error fetching persons by workType:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// ✅ External routes with auth
const personRoutes = require('./routes/personRoutes');
app.use('/persons', personRoutes);

const menuRoutes = require('./routes/menuRouter');
app.use('/menus', middleauth, menuRoutes);

// ✅ Start server after DB connection
const PORT = process.env.PORT || 3000;
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
