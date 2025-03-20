const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.error('Email configuration missing! Please check your .env file');
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // Verify transporter configuration
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('Email configuration error:', error);
            } else {
                console.log('Email server is ready to send messages');
            }
        });
    }

    async sendWeatherReport(email, weatherData) {
        if (!this.transporter) {
            throw new Error('Email service not properly configured');
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Your Weather Report',
            html: `
                <h2>Weather Report</h2>
                <p>Temperature: ${weatherData.temperature}°C</p>
                <p>Humidity: ${weatherData.humidity}%</p>
                <p>Conditions: ${weatherData.description}</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        };

        try {
            console.log(`Attempting to send email to ${email}`);
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error.message);
            console.error('Full error:', error);
            throw error;
        }
    }
}

module.exports = new EmailService(); 