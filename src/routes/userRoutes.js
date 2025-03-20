const express = require('express');
const router = express.Router();
const User = require('../models/User');
const weatherService = require('../services/weatherService');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { email, latitude, longitude } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            email,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user location
router.put('/:email/location', async (req, res) => {
    try {
        const { email } = req.params;
        const { latitude, longitude } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.location.coordinates = [longitude, latitude];
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's weather data for a specific day
router.get('/:email/weather', async (req, res) => {
    try {
        const { email } = req.params;
        const { date } = req.query;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const weatherData = user.weatherData.filter(data => 
            data.timestamp >= startOfDay && data.timestamp <= endOfDay
        );

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 