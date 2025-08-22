// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const stationRoutes = require('./routes/stations');
const bookingRoutes = require('./routes/bookings');


console.log("authRoutes loaded:", authRoutes);
console.log("stationRoutes loaded:", stationRoutes);
console.log("bookingRoutes loaded:", bookingRoutes);


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
