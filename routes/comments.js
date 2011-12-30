(function() {
  var Comment, Notification, User;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  User = require('../models/user');
  Comment = require('../models/comment');
  Notification = require('../models/notification');
  module.exports = function(app) {
    return app.post('/comments', function(req, res) {
      var comment, data, user;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.created_at;
      delete data.updated_at;
      comment = new Comment(data);
      comment.save(function(err) {
        var triggerNewFollowups, triggerNewWallPosts, userName;
        comment.postOnWall();
        userName = user.type === "daycare" ? user.daycare_name : "" + user.name + " " + user.surname;
        triggerNewWallPosts = function(userId, notif) {
          return notif.save(function() {
            return Notification.triggerNewWallPosts(userId);
          });
        };
        triggerNewFollowups = function(userId, notif) {
          return notif.save(function() {
            return Notification.triggerNewFollowups(userId);
          });
        };
        if (data.type === "status") {
          User.find().run(function(err, users) {
            var notification, notificationData, usr, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = users.length; _i < _len; _i++) {
              usr = users[_i];
              _results.push(("" + usr._id) !== ("" + user._id) ? (notificationData = {
                user_id: usr._id,
                wall_id: data.wall_id,
                type: "status",
                content: "" + userName + " wrote on wall."
              }, notification = new Notification(notificationData), triggerNewWallPosts(usr._id, notification)) : void 0);
            }
            return _results;
          });
        }
        if (data.type === "followup") {
          return Comment.find([
            {
              type: "followup",
              wall_id: data.wall_id,
              to_id: data.to_id
            }, {
              type: "status",
              wall_id: data.wall_id
            }
          ]).run(function(err, comments) {
            var comment, notification, notificationData, sentUserIds, _i, _len, _ref, _results;
            sentUserIds = [];
            _results = [];
            for (_i = 0, _len = comments.length; _i < _len; _i++) {
              comment = comments[_i];
              _results.push(("" + comment.from_id) !== ("" + user._id) && (_ref = comment.from_id, __indexOf.call(sentUserIds, _ref) < 0) ? (notificationData = {
                user_id: comment.from_id,
                wall_id: data.wall_id,
                type: "followup",
                content: "" + userName + " commented on a post."
              }, notification = new Notification(notificationData), triggerNewFollowups(comment.from_id, notification), sentUserIds.push(comment.from_id)) : void 0);
            }
            return _results;
          });
        }
      });
      return res.json({
        success: true
      });
    });
  };
}).call(this);
