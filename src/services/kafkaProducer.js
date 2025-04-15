const kafka = require('../config/kafka');
const logger = require('../utils/logger');

const producer = kafka.producer();

const sendActivity = async (activity) => {
  try {
    await producer.connect();
    logger.info('Producer connected to Kafka');

    const message = {
      key: activity.userId,
      value: JSON.stringify(activity)
    };

    const result = await producer.send({
      topic: 'user-activities',
      messages: [message]
    });

    logger.info('Activity sent to Kafka:', { activity, result });
    return true;
  } catch (error) {
    logger.error('Error sending activity to Kafka:', error);
    throw error;
  }
};

const initialize = async () => {
  try {
    await producer.connect();
    logger.info('Kafka producer initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Kafka producer:', error);
    throw error;
  }
};

module.exports = {
  sendActivity,
  initialize
}; 