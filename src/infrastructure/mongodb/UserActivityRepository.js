const mongoose = require('mongoose');
const UserActivity = require('../../domain/models/UserActivity');

const userActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  activityType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

const UserActivityModel = mongoose.model('UserActivity', userActivitySchema);

class UserActivityRepository {
  async save(activity) {
    const activityDoc = new UserActivityModel(activity.toJSON());
    await activityDoc.save();
    return activity;
  }

  async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const activities = await UserActivityModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return activities.map(activity => new UserActivity(activity));
  }

  async findByActivityType(activityType, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const activities = await UserActivityModel
      .find({ activityType })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return activities.map(activity => new UserActivity(activity));
  }

  async countByUserId(userId) {
    return UserActivityModel.countDocuments({ userId });
  }
}

module.exports = UserActivityRepository; 