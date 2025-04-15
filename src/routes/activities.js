const express = require('express');
const router = express.Router();
const { sendActivity } = require('../services/kafkaProducer');
const UserActivity = require('../models/UserActivity');
const logger = require('../utils/logger');

// POST /api/activities
router.post('/', async (req, res) => {
  try {
    const activity = {
      userId: req.body.userId,
      activityType: req.body.activityType,
      timestamp: req.body.timestamp || new Date().toISOString(),
      metadata: req.body.metadata || {}
    };

    await sendActivity(activity);
    logger.info('Activity sent to processing:', activity);
    res.status(202).json({ message: 'Activity accepted for processing' });
  } catch (error) {
    logger.error('Error processing activity:', error);
    res.status(500).json({ error: 'Failed to process activity' });
  }
});

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    const { userId, activityType, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = {};

    if (userId) query.userId = userId;
    if (activityType) query.activityType = activityType;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const activities = await UserActivity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UserActivity.countDocuments(query);

    res.json({
      activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router; 