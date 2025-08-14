const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const bookingsRouter = require('./routes/bookings');
const availabilityRouter = require('./routes/availability');
const servicesRouter = require('./routes/services');
const statsRouter = require('./routes/stats');
const webhookRouter = require('./routes/webhook');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all origins (configure for production)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined')); // Logging
app.use('/api/', limiter); // Apply rate limiting to API routes

// API Key validation middleware (simple for demo)
const apiKeyValidation = require('./middleware/apiKeyValidation');
app.use('/api/', apiKeyValidation);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MedSpa Booking Backend',
    version: '1.0.0'
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MedSpa AI Receptionist Booking API',
    documentation: '/api/v1/docs',
    endpoints: {
      bookings: '/api/v1/bookings',
      availability: '/api/v1/availability',
      services: '/api/v1/services',
      stats: '/api/v1/stats',
      webhook: '/api/v1/webhook'
    },
    timestamp: new Date().toISOString()
  });
});

// API Documentation endpoint
app.get('/api/v1/docs', (req, res) => {
  const documentation = require('./utils/documentation');
  res.json(documentation);
});

// Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(`${apiPrefix}/bookings`, bookingsRouter);
app.use(`${apiPrefix}/availability`, availabilityRouter);
app.use(`${apiPrefix}/services`, servicesRouter);
app.use(`${apiPrefix}/stats`, statsRouter);
app.use(`${apiPrefix}/webhook`, webhookRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 MedSpa Booking Backend is running!
  
  📍 Local:    http://localhost:${PORT}
  📍 Network:  http://localhost:${PORT}
  
  📚 API Docs: http://localhost:${PORT}/api/v1/docs
  ❤️  Health:  http://localhost:${PORT}/health
  
  🔑 API Key:  ${process.env.API_KEY}
  
  Ready for n8n integration! 🎉
  `);
});

module.exports = app;
