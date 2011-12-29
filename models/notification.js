(function() {
  var NotificationSchema, exports, notificationsSocket;
  NotificationSchema = new Schema({
    user_id: {
      type: String
    },
    unread: {
      type: Boolean,
      "default": true
    },
    wall_id: {
      type: String
    },
    type: {
      type: String,
      "enum": ["status", "followup"],
      "default": "status"
    },
    content: {
      type: {},
      "default": ""
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    updated_at: {
      type: Date,
      "default": Date.now
    }
  });
  notificationsSocket = null;
  NotificationSchema.statics.setNotificationsSocket = function(socket) {
    return notificationsSocket = socket;
  };
  NotificationSchema.statics.getNotificationsSocket = function() {
    return notificationsSocket;
  };
  NotificationSchema.statics.triggerNewMessages = function(userId) {
    var Message, sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    Message = require("./message");
    Message.find({
      to_id: userId,
      type: "default",
      unread: true
    }).count(function(err, newMessagesTotal) {
      return userSocket.emit("new-messages-total", {
        total: newMessagesTotal
      });
    });
    return Message.findLastMessages(userId, 5, function(err, messages) {
      return userSocket.emit("last-messages", {
        messages: messages
      });
    });
  };
  NotificationSchema.statics.findLastWallPosts = function(userId, limit, onFind) {
    return this.find({
      user_id: userId,
      type: "status"
    }).desc('created_at').limit(limit).run(onFind);
  };
  NotificationSchema.statics.triggerNewWallPosts = function(userId) {
    var sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    this.find({
      user_id: userId,
      type: "status",
      unread: true
    }).count(function(err, newWallPostsTotal) {
      return userSocket.emit("new-wall-posts-total", {
        total: newWallPostsTotal
      });
    });
    return this.findLastWallPosts(userId, 5, function(err, wallPosts) {
      return userSocket.emit("last-wall-posts", {
        wall_posts: wallPosts
      });
    });
  };
  NotificationSchema.statics.findLastFollowups = function(userId, limit, onFind) {
    return this.find({
      user_id: userId,
      type: "followup"
    }).desc('created_at').limit(limit).run(onFind);
  };
  NotificationSchema.statics.triggerNewFollowups = function(userId) {
    var sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    this.find({
      user_id: userId,
      type: "followup",
      unread: true
    }).count(function(err, newFollowupsTotal) {
      return userSocket.emit("new-followups-total", {
        total: newFollowupsTotal
      });
    });
    return this.findLastFollowups(userId, 5, function(err, followups) {
      return userSocket.emit("last-followups", {
        followups: followups
      });
    });
  };
  exports = module.exports = mongoose.model("Notification", NotificationSchema);
}).call(this);
