(function() {
  var NotificationSchema, User, exports, notificationsSocket;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  User = require("./user");
  NotificationSchema = new Schema({
    user_id: {
      type: String
    },
    from_id: {
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
    },
    from_user: {
      type: {}
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
    if (userSocket) {
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
    }
  };
  NotificationSchema.statics.findLastWallPosts = function(userId, limit, onFind) {
    return this.find({
      user_id: userId,
      type: "status"
    }).desc('created_at').limit(limit).run(function(err, posts) {
      var post, usersToFind, _i, _len, _ref;
      usersToFind = [];
      if (posts) {
        for (_i = 0, _len = posts.length; _i < _len; _i++) {
          post = posts[_i];
          if (!(_ref = post.from_id, __indexOf.call(usersToFind, _ref) >= 0)) {
            usersToFind.push(post.from_id);
          }
        }
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var post, user, _j, _k, _len2, _len3;
          if (users) {
            for (_j = 0, _len2 = posts.length; _j < _len2; _j++) {
              post = posts[_j];
              for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                user = users[_k];
                if (("" + user._id) === ("" + post.from_id)) {
                  post.from_user = user;
                }
              }
            }
          }
          return onFind(err, posts);
        });
      } else {
        return onFind(err, posts);
      }
    });
  };
  NotificationSchema.statics.triggerNewWallPosts = function(userId) {
    var sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    if (userSocket) {
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
    }
  };
  NotificationSchema.statics.findLastFollowups = function(userId, limit, onFind) {
    return this.find({
      user_id: userId,
      type: "followup"
    }).desc('created_at').limit(limit).run(function(err, followups) {
      var followup, usersToFind, _i, _len, _ref;
      usersToFind = [];
      if (followups) {
        for (_i = 0, _len = followups.length; _i < _len; _i++) {
          followup = followups[_i];
          if (!(_ref = followup.from_id, __indexOf.call(usersToFind, _ref) >= 0)) {
            usersToFind.push(followup.from_id);
          }
        }
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var followup, user, _j, _k, _len2, _len3;
          if (users) {
            for (_j = 0, _len2 = followups.length; _j < _len2; _j++) {
              followup = followups[_j];
              for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                user = users[_k];
                if (("" + user._id) === ("" + followup.from_id)) {
                  followup.from_user = user;
                }
              }
            }
          }
          return onFind(err, followups);
        });
      } else {
        return onFind(err, followups);
      }
    });
  };
  NotificationSchema.statics.triggerNewFollowups = function(userId) {
    var sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    if (userSocket) {
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
    }
  };
  exports = module.exports = mongoose.model("Notification", NotificationSchema);
}).call(this);
