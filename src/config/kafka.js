const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-activity-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: true,
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

module.exports = kafka; 