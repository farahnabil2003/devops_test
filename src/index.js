const express = require('express');
const connectDB = require('./config/database');
const activitiesRouter = require('./routes/activities');
const kafkaConsumer = require('./services/kafkaConsumer');
const { initialize: initializeProducer } = require('./services/kafkaProducer');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/activities', activitiesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Initialize Kafka producer
    await initializeProducer();
    logger.info('Kafka producer initialized');

    // Start Kafka consumer
    await kafkaConsumer();
    logger.info('Kafka consumer started');

    // Start server
    app.listen(port, '0.0.0.0', () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 