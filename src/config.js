require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'user-activity-service',
    groupId: process.env.KAFKA_GROUP_ID || 'user-activity-group'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-activity',
    dbName: process.env.MONGODB_DB_NAME || 'user-activity'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    }
  }
}; 