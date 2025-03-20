require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const weatherService = require('./services/weatherService');
const emailService = require('./services/emailService');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);


// Schedule weather updates every 3 hours
cron.schedule(0 */3 * * *', async () => {
    try {
        console.log('Starting weather update job...');
        const users = await User.find({});
        console.log(`Found ${users.length} users to update`);
        
        for (const user of users) {
            try {
                console.log(`Processing user: ${user.email}`);
                const [longitude, latitude] = user.location.coordinates;
                console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
                
                const weatherData = await weatherService.getWeatherData(latitude, longitude);
                console.log('Weather data fetched:', weatherData);
                
                // Save weather data to user's history
                user.weatherData.push(weatherData);
                const savedUser = await user.save();
                console.log(`Weather data saved for user ${user.email}`);
                
                // Send email with weather report
                await emailService.sendWeatherReport(user.email, weatherData);
                console.log(`Email sent successfully to ${user.email}`);
            } catch (userError) {
                console.error(`Error processing user ${user.email}:`, userError.message);
                // Continue with next user even if one fails
            }
        }
        
        console.log('Weather updates completed successfully');
    } catch (error) {
        console.error('Error in weather update job:', error.message);
        console.error('Full error:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
