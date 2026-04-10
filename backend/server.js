const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply global API rate limit
app.use('/api/', apiLimiter);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cars', require('./src/routes/carRoutes'));
app.use('/api/requests', require('./src/routes/requestRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/newsletter', require('./src/routes/newsletterRoutes'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
