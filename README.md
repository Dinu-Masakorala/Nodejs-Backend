# Weather Reports API

A Node.js API that stores users' emails and locations, and automatically sends weather reports every 3 hours.

[Demo Video](https://github.com/user-attachments/assets/d2892f88-3197-47ca-ac3c-f2ff053a44c9)





## Features

- User registration with email and location
- Location updates
- Automatic weather reports every 3 hours
- Historical weather data retrieval
- Email notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenWeatherMap API key
- Gmail account (for sending emails)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/weather-reports
   OPENWEATHER_API_KEY=your_openweather_api_key
   GMAIL_USER=your_gmail_address
   GMAIL_PASS=your_gmail_app_password
   ```

   Note: For Gmail, you'll need to use an App Password. You can generate one in your Google Account settings under Security > 2-Step Verification > App passwords.

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Create User
```
POST /api/users
Content-Type: application/json

{
    "email": "user@example.com",
    "latitude": 40.7128,
    "longitude": -74.0060
}
```

### Update User Location
```
PUT /api/users/:email/location
Content-Type: application/json

{
    "latitude": 40.7128,
    "longitude": -74.0060
}
```

### Get Weather Data
```
GET /api/users/:email/weather?date=2024-01-20
```

## Testing

You can use the following Postman collection to test the API endpoints:

```json
{
    "info": {
        "name": "Weather Reports API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Create User",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "url": "http://localhost:3000/api/users",
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"email\": \"user@example.com\",\n    \"latitude\": 40.7128,\n    \"longitude\": -74.0060\n}"
                }
            }
        },
        {
            "name": "Update Location",
            "request": {
                "method": "PUT",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "url": "http://localhost:3000/api/users/user@example.com/location",
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"latitude\": 40.7128,\n    \"longitude\": -74.0060\n}"
                }
            }
        },
        {
            "name": "Get Weather Data",
            "request": {
                "method": "GET",
                "url": "http://localhost:3000/api/users/user@example.com/weather?date=2024-01-20"
            }
        }
    ]
}
```

## Notes

- The weather updates are scheduled to run every 3 hours
- Weather data is stored in MongoDB for historical tracking
- Email reports are sent using Gmail SMTP
- The application uses the OpenWeatherMap API for weather data 
