(function() {
  var Comment, Message, User, io;
  User = require('../models/user');
  Comment = require('../models/comment');
  Message = require('../models/message');
  io = require('socket.io');
  module.exports = function(app) {
    var dayCareWallComments, sio, userNotifications;
    sio = io.listen(app);
    userNotifications = sio.of("/user-notifications").on("connection", function(socket) {
      socket.on("get-new-messages-total", function(data) {
        var userId;
        userId = data.user_id;
        return Message.find({
          to_id: userId,
          type: "default",
          unread: true
        }).count(function(err, newMessagesTotal) {
          return socket.emit("new-messages-total", {
            total: newMessagesTotal
          });
        });
      });
      socket.on("get-last-messages", function(data) {
        var userId;
        userId = data.user_id;
        return Message.findLastMessages(userId, 5, function(err, messages) {
          return socket.emit("last-messages", {
            messages: messages
          });
        });
      });
      return socket.on("disconnect", function() {});
    });
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
