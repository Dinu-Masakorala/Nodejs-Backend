const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    description: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    weatherData: [weatherDataSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema); 