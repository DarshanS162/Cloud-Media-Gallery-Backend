require("dotenv").config();
const express = require('express');
const sequelize = require("./src/config/db");
const userRoutes = require('./src/routes/userRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Middleware
app.use(express.json({ limit: '50mb' }));

// Enable CORS for all origins
app.use(cors({
    origin: '*', // allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date()
    });
});


// Routes
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);

// Database connection
sequelize.sync() // creates tables if they do not exist
    .then(() => {
        console.log("All models synced successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Unable to sync database:", err);
    });