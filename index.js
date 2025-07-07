const express = require('express');
const User = require('./models/user.model')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// load environment variables
dotenv.config()

const app = express();

const PORT = process.env.PORT || 8080
const MONGO = process.env.MONGODB;

console.log(`MONGO: ${MONGO}`)

// Middleware to parse JSON request bodies
app.use(express.json())

// connect to MongoDB
mongoose.connect(`${MONGO}/anotherMongooseTest`)
const db = mongoose.connection
db.once("open", () => {
    console.log(`connected: ${MONGO}`)
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
})

// POST - /api/signup - create a new user
app.post("/api/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            email,
            password
        })

        const newUser = await user.save();

        // issue the toke to the user
        const token = jwt.sign({
            id: newUser._id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            user: newUser,
            token: token,
            message: "User registered successfully!"
        })
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});