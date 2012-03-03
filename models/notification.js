(function() {
  var NotificationSchema, User, exports, notificationsSocket, _,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  User = require("./user");

  _ = require("underscore");

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
    comment_id: {
      type: String
    },
    type: {
      type: String,
      "enum": ["alert", "feed", "request"],
      "default": "feed"
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

  NotificationSchema.methods.saveAndTriggerNewComments = function() {
    var Notification;
    Notification = require("./notification");
    return this.save(function(err, data) {
      if (data.type === "feed") Notification.triggerNewWallPosts(data.user_id);
      if (data.type === "alert") Notification.triggerNewFollowups(data.user_id);
      if (data.type === "request") {
        return Notification.triggerNewRequests(data.user_id);
      }
    });
  };

  NotificationSchema.statics.addForStatus = function(newComment, sender) {
    var Notification, commentId, senderId, wallOwnerId;
    Notification = require("./notification");
    commentId = "" + newComment._id;
    wallOwnerId = "" + newComment.wall_id;
    senderId = "" + sender._id;
    return User.findOne({
      _id: wallOwnerId
    }).run(function(err, wallOwner) {
      var friendsToFind, notification, notificationData, notificationType, receiverTypes, _ref;
      if (wallOwnerId !== senderId) {
        notificationType = wallOwner.type === "daycare" ? "feed" : "alert";
        notificationData = {
          user_id: wallOwnerId,
          from_id: senderId,
          wall_id: newComment.wall_id,
          comment_id: commentId,
          type: notificationType,
          content: "posted on your wall."
        };
        notification = new Notification(notificationData);
        notification.saveAndTriggerNewComments(wallOwnerId);
      }
      friendsToFind = (_ref = wallOwner.type) === "daycare" || _ref === "class" ? wallOwner.friends : [];
      friendsToFind = _.filter(friendsToFind, function(friendId) {
        return friendId !== senderId && friendId !== wallOwnerId;
      });
      if (friendsToFind.length) {
        receiverTypes = ["parent", "daycare", "staff"];
        return User.find().where("_id")["in"](friendsToFind).where("type")["in"](receiverTypes).run(function(err, users) {
          var content, usr, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = users.length; _i < _len; _i++) {
            usr = users[_i];
            content = wallOwnerId === senderId ? "posted on his wall." : "posted on " + (wallOwner.name || "") + " " + (wallOwner.surname || "") + "'s wall.";
            notificationData = {
              user_id: usr._id,
              from_id: senderId,
              wall_id: newComment.wall_id,
              comment_id: commentId,
              type: "feed",
              content: content,
              unread: true
            };
            notification = new Notification(notificationData);
            _results.push(notification.saveAndTriggerNewComments(usr._id));
          }
          return _results;
        });
      }
    });
  };

  NotificationSchema.statics.addForFollowup = function(newComment, sender) {
    var Comment, Notification, commentId, originalStatusId, senderId, wallOwnerId;
    Notification = require("./notification");
    Comment = require("./comment");
    commentId = "" + newComment.to_id;
    wallOwnerId = "" + newComment.wall_id;
    senderId = "" + sender._id;
    originalStatusId = "" + newComment.to_id;
    return User.findOne({
      _id: wallOwnerId
    }).run(function(err, wallOwner) {
      return Comment.findOne({
        _id: originalStatusId
      }).run(function(err, originalComment) {
        var statusOwnerId;
        statusOwnerId = "" + originalComment.from_id;
        return User.findOne({
          _id: statusOwnerId
        }).run(function(err, statusOwner) {
          var sentUserIds;
          sentUserIds = [senderId];
          return Comment.find({
            type: "followup",
            wall_id: newComment.wall_id,
            to_id: originalStatusId
          }).run(function(err, comments) {
            var comment, content, friendsToFeed, notification, notificationData, notificationType, statusOwnerName, wallOwnerName, _i, _len, _ref, _ref2, _ref3;
            for (_i = 0, _len = comments.length; _i < _len; _i++) {
              comment = comments[_i];
              if (_ref = comment.from_id, __indexOf.call(sentUserIds, _ref) < 0) {
                statusOwnerName = statusOwnerId === senderId ? "his" : "" + (statusOwner.name || "") + " " + (statusOwner.surname || "") + "'s";
                wallOwnerName = wallOwnerId === senderId ? "his" : "" + (wallOwner.name || "") + " " + (wallOwner.surname || "") + "'s";
                content = "commented on " + statusOwnerName + " post on " + wallOwnerName + " wall.";
                notificationData = {
                  user_id: comment.from_id,
                  from_id: sender._id,
                  wall_id: newComment.wall_id,
                  comment_id: commentId,
                  type: "alert",
                  content: content
                };
                notification = new Notification(notificationData);
                notification.saveAndTriggerNewComments(comment.from_id);
                sentUserIds.push(comment.from_id);
              }
            }
            if (__indexOf.call(sentUserIds, statusOwnerId) < 0) {
              wallOwnerName = wallOwnerId === senderId ? "his" : "" + (wallOwner.name || "") + " " + (wallOwner.surname || "") + "'s";
              content = "commented on your post on " + wallOwnerName + " wall.";
              notificationData = {
                user_id: statusOwnerId,
                from_id: senderId,
                wall_id: newComment.wall_id,
                comment_id: commentId,
                type: "alert",
                content: content
              };
              notification = new Notification(notificationData);
              notification.saveAndTriggerNewComments(statusOwnerId);
              sentUserIds.push(statusOwnerId);
            }
            if (wallOwnerId !== statusOwnerId && __indexOf.call(sentUserIds, wallOwnerId) < 0) {
              content = "commented on " + statusOwner.name + " " + statusOwner.surname + "'s post on your wall.";
              notificationType = (_ref2 = wallOwner.type) === "daycare" || _ref2 === "class" ? "feed" : "alert";
              notificationData = {
                user_id: wallOwnerId,
                from_id: senderId,
                wall_id: newComment.wall_id,
                comment_id: commentId,
                type: notificationType,
                content: content
              };
              notification = new Notification(notificationData);
              notification.saveAndTriggerNewComments(wallOwnerId);
            }
            if ((_ref3 = wallOwner.type) === "daycare" || _ref3 === "class") {
              friendsToFeed = _.difference(wallOwner.friends, sentUserIds);
              return User.find().where("_id")["in"](friendsToFeed).run(function(err, users) {
                var usr, _j, _len2, _results;
                _results = [];
                for (_j = 0, _len2 = users.length; _j < _len2; _j++) {
                  usr = users[_j];
                  statusOwnerName = statusOwnerId === senderId ? "his" : "" + (statusOwner.name || "") + " " + (statusOwner.surname || "") + "'s";
                  wallOwnerName = wallOwnerId === senderId ? "his" : "" + (wallOwner.name || "") + " " + (wallOwner.surname || "") + "'s";
                  content = "commented on " + statusOwnerName + " post on " + wallOwnerName + " wall.";
                  notificationData = {
                    user_id: usr._id,
                    from_id: senderId,
                    wall_id: newComment.wall_id,
                    comment_id: commentId,
                    type: "feed",
                    content: content
                  };
                  notification = new Notification(notificationData);
                  _results.push(notification.saveAndTriggerNewComments(usr._id));
                }
                return _results;
              });
            }
          });
        });
      });
    });
  };

  NotificationSchema.statics.addForRequest = function(receiverId, classesIds) {
    var Notification;
    Notification = mongoose.model("Notification");
    console.log(classesIds);
    return User.find().where("_id")["in"](classesIds).run(function(err, classes) {
      var daycareClass, notification, notificationData, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = classes.length; _i < _len; _i++) {
        daycareClass = classes[_i];
        console.log(daycareClass._id);
        notificationData = {
          user_id: receiverId,
          from_id: daycareClass.master_id,
          comment_id: daycareClass._id,
          type: "request",
          content: "invited you to " + daycareClass.name + "."
        };
        notification = new Notification(notificationData);
        _results.push(notification.saveAndTriggerNewComments(receiverId));
      }
      return _results;
    });
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
      type: "feed"
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
                if (("" + user._id) === ("" + post.from_id)) post.from_user = user;
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
        type: "feed",
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
      type: "alert"
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
        type: "alert",
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

  NotificationSchema.statics.findLastRequests = function(userId, limit, onFind) {
    return this.find({
      user_id: userId,
      type: "request"
    }).desc('created_at').limit(limit).run(function(err, requests) {
      var request, usersToFind, _i, _len, _ref;
      usersToFind = [];
      if (requests) {
        for (_i = 0, _len = requests.length; _i < _len; _i++) {
          request = requests[_i];
          if (!(_ref = request.from_id, __indexOf.call(usersToFind, _ref) >= 0)) {
            usersToFind.push(request.from_id);
          }
        }
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var request, user, _j, _k, _len2, _len3;
          if (users) {
            for (_j = 0, _len2 = requests.length; _j < _len2; _j++) {
              request = requests[_j];
              for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                user = users[_k];
                if (("" + user._id) === ("" + request.from_id)) {
                  request.from_user = user;
                }
              }
            }
          }
          return onFind(err, requests);
        });
      } else {
        return onFind(err, requests);
      }
    });
  };

  NotificationSchema.statics.triggerNewRequests = function(userId) {
    var sessionId, userSocket;
    sessionId = notificationsSocket.userSessions[userId];
    userSocket = notificationsSocket.socket(sessionId);
    if (userSocket) {
      this.find({
        user_id: userId,
        type: "request",
        unread: true
      }).count(function(err, newRequestsTotal) {
        return userSocket.emit("new-requests-total", {
          total: newRequestsTotal
        });
      });
      return this.findLastRequests(userId, 5, function(err, requests) {
        return userSocket.emit("last-requests", {
          requests: requests
        });
      });
    }
  };

  exports = module.exports = mongoose.model("Notification", NotificationSchema);

}).call(this);
