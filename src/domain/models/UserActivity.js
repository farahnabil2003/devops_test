class UserActivity {
  constructor({ userId, activityType, timestamp, metadata }) {
    this.userId = userId;
    this.activityType = activityType;
    this.timestamp = timestamp || new Date();
    this.metadata = metadata || {};
  }

  static create({ userId, activityType, metadata }) {
    return new UserActivity({
      userId,
      activityType,
      metadata
    });
  }

  toJSON() {
    return {
      userId: this.userId,
      activityType: this.activityType,
      timestamp: this.timestamp,
      metadata: this.metadata
    };
  }
}

module.exports = UserActivity; 