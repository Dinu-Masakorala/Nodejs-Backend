const axios = require('axios');

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getWeatherData(latitude, longitude) {
        try {
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                description: response.data.weather[0].description
            };
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }
}

module.exports = new WeatherService(); 