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
    app.get('/comments/:wall_id/:last_query_time', function(req, res) {
      var lastQueryTime, wallId;
      wallId = req.params.wall_id;
      lastQueryTime = req.params.last_query_time;
      return Comment.find({
        wall_id: wallId
      }).where('created_at').gt(lastQueryTime).desc("type").asc("updated_at").run(function(err, comments) {
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
              return res.json(comments);
            });
          } else {
            return res.json(comments);
          }
        } else {
          return res.json([]);
        }
      });
    });
    return app.post('/comments', function(req, res) {
      var comment, data, user;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.created_at;
      delete data.updated_at;
      comment = new Comment(data);
      return comment.save(function(err) {
        var triggerNewFollowups, triggerNewWallPosts, userName;
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
          Comment.find([
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
        return res.json({
          success: true
        });
      });
    });
  };
}).call(this);
