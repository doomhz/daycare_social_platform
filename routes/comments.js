(function() {
  var Comment, Notification, User;
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
      }).where('added_at').gt(lastQueryTime).desc("type").asc("added_at").run(function(err, comments) {
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
              return res.render('comments/comments', {
                comments: comments,
                show_private: false,
                layout: false
              });
            });
          } else {
            return res.render('comments/comments', {
              comments: comments,
              show_private: false,
              layout: false
            });
          }
        } else {
          return res.json([]);
        }
      });
    });
    return app.post('/comments', function(req, res) {
      var currentComment, currentUser, data;
      currentUser = req.user ? req.user : {};
      data = req.body;
      data.from_id = currentUser._id;
      data.added_at = new Date().getTime();
      currentComment = new Comment(data);
      return currentComment.save(function(err, savedComment) {
        if (data.type === "status") {
          Notification.addForStatus(savedComment, currentUser);
        }
        if (data.type === "followup") {
          Notification.addForFollowup(savedComment, currentUser);
        }
        return res.json({
          success: true
        });
      });
    });
  };
}).call(this);
