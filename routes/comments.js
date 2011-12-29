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
      var comment, data, user, userName;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.created_at;
      delete data.updated_at;
      comment = new Comment(data);
      comment.save();
      comment.postOnWall();
      userName = user.type === "daycare" ? user.daycare_name : "" + user.name + " " + user.surname;
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
            }, notification = new Notification(notificationData), notification.save(function() {
              return Notification.triggerNewWallPosts(usr._id);
            })) : void 0);
          }
          return _results;
        });
      }
      if (data.type === "followup") {
        Comment.find({
          type: "followup",
          wall_id: data.wall_id,
          to_id: data.to_id
        }).run(function(err, comments) {
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
            }, notification = new Notification(notificationData), notification.save(function() {
              return Notification.triggerNewFollowups(comment.from_id);
            }), sentUserIds.push(comment.from_id)) : void 0);
          }
          return _results;
        });
      }
      return res.json({
        success: true
      });
    });
  };
}).call(this);
