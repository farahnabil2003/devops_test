const kafka = require('../config/kafka');
const UserActivity = require('../models/UserActivity');
const logger = require('../utils/logger');

const consumer = kafka.consumer({ groupId: 'user-activity-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-activities', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const activity = JSON.parse(message.value.toString());
          logger.info('Processing activity:', { activity });

          const userActivity = new UserActivity({
            userId: activity.userId,
            activityType: activity.activityType,
            timestamp: new Date(activity.timestamp),
            metadata: activity.metadata || {}
          });

          await userActivity.save();
          logger.info('Activity saved successfully:', { activityId: userActivity._id });
        } catch (error) {
          logger.error('Error processing message:', { error: error.message, topic, partition });
        }
      },
    });
  } catch (error) {
    logger.error('Consumer error:', error);
    process.exit(1);
  }
};

module.exports = runConsumer; 