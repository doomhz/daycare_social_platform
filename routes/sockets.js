(function() {
  var Comment, Message, Notification, User, io;
  User = require('../models/user');
  Comment = require('../models/comment');
  Message = require('../models/message');
  Notification = require('../models/notification');
  io = require('socket.io');
  module.exports = function(app) {
    var dayCareWallComments, sio, userNotifications;
    sio = io.listen(app);
    userNotifications = sio.of("/user-notifications").on("connection", function(socket) {
      userNotifications.userSessions || (userNotifications.userSessions = {});
      socket.on("get-new-messages-total", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Message.find({
          to_id: userId,
          type: "default",
          unread: true
        }).count(function(err, newMessagesTotal) {
          return userSocket.emit("new-messages-total", {
            total: newMessagesTotal
          });
        });
      });
      socket.on("get-last-messages", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Message.findLastMessages(userId, 5, function(err, messages) {
          return userSocket.emit("last-messages", {
            messages: messages
          });
        });
      });
      socket.on("get-new-wall-posts-total", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Notification.find({
          user_id: userId,
          type: "status",
          unread: true
        }).count(function(err, wallPostsTotal) {
          return userSocket.emit("new-wall-posts-total", {
            total: wallPostsTotal
          });
        });
      });
      socket.on("get-last-wall-posts", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Notification.findLastWallPosts(userId, 5, function(err, wallPosts) {
          return userSocket.emit("last-wall-posts", {
            wall_posts: wallPosts
          });
        });
      });
      socket.on("get-new-followups-total", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Notification.find({
          user_id: userId,
          type: "followup",
          unread: true
        }).count(function(err, followupsTotal) {
          return userSocket.emit("new-followups-total", {
            total: followupsTotal
          });
        });
      });
      socket.on("get-last-followups", function(data) {
        var sessionId, userId, userSocket;
        userId = data.user_id;
        sessionId = data.session_id;
        userSocket = userNotifications.socket(sessionId);
        userNotifications.userSessions[userId] = sessionId;
        return Notification.findLastFollowups(userId, 5, function(err, followups) {
          return userSocket.emit("last-followups", {
            followups: followups
          });
        });
      });
      return socket.on("disconnect", function() {});
    });
    Notification.setNotificationsSocket(userNotifications);
    dayCareWallComments = sio.of("/day-cares-wall-comments").on("connection", function(socket) {
      socket.on("get-new-comments", function(data) {
        return Comment.find({
          wall_id: data.wall_id
        }).desc("type").asc("updated_at").run(function(err, comments) {
          var comment, usersToFind, _i, _len;
          if (comments) {
            usersToFind = [];
            for (_i = 0, _len = comments.length; _i < _len; _i++) {
              comment = comments[_i];
              usersToFind.push(comment.from_id);
            }
            if (usersToFind.length) {
              return User.where("_id")["in"](usersToFind).run(function(err, users) {
                var comment, user, _j, _k, _len2, _len3;
                if (users) {
                  for (_j = 0, _len2 = comments.length; _j < _len2; _j++) {
                    comment = comments[_j];
                    for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                      user = users[_k];
                      if (("" + user._id) === ("" + comment.from_id)) {
                        comment.from_user = user;
                      }
                    }
                  }
                }
                return socket.emit("new-wall-comments", {
                  comments: comments
                });
              });
            }
          }
        });
      });
      return socket.on("disconnect", function() {});
    });
    return Comment.setDaycareWallSocket(dayCareWallComments);
  };
}).call(this);
