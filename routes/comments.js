(function() {
  var Comment, Notification, User, _s,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  User = require('../models/user');

  Comment = require('../models/comment');

  Notification = require('../models/notification');

  _s = require('underscore.string');

  module.exports = function(app) {
    app.get('/comments/:wall_id/:last_comment_time/:timeline', function(req, res) {
      var comparison, currentUser, currentUserId, lastCommentTime, timeline, wallId, _ref;
      currentUser = req.user ? req.user : {};
      currentUserId = "" + currentUser._id;
      wallId = "" + req.params.wall_id;
      lastCommentTime = req.params.last_comment_time;
      timeline = (_ref = req.params.timeline) === "future" || _ref === "past" ? req.params.timeline : "future";
      comparison = req.params.timeline === "future" ? "gt" : "lt";
      if (wallId === currentUserId || __indexOf.call(currentUser.friends, wallId) >= 0) {
        return Comment.find({
          wall_id: wallId,
          type: "status"
        }).where('added_at')[comparison](lastCommentTime).desc("added_at").limit(5).run(function(err, statuses) {
          var followupsQuery, status, statusIds, _i, _len;
          if (statuses == null) statuses = [];
          statusIds = [];
          for (_i = 0, _len = statuses.length; _i < _len; _i++) {
            status = statuses[_i];
            statusIds.push(status._id);
          }
          followupsQuery = Comment.find({
            wall_id: wallId,
            type: "followup"
          }).desc("added_at");
          if (timeline === "past") {
            followupsQuery.where("to_id")["in"](statusIds);
          } else {
            followupsQuery.where('added_at')[comparison](lastCommentTime);
          }
          return followupsQuery.run(function(err, followups) {
            var comment, comments, usersToFind, _j, _len2;
            if (followups == null) followups = [];
            usersToFind = [];
            comments = statuses.concat(followups);
            for (_j = 0, _len2 = comments.length; _j < _len2; _j++) {
              comment = comments[_j];
              usersToFind.push(comment.from_id);
              comment.timeline = timeline;
            }
            if (usersToFind.length) {
              return User.where("_id")["in"](usersToFind).run(function(err, users) {
                var comment, user, _k, _l, _len3, _len4;
                if (users) {
                  for (_k = 0, _len3 = comments.length; _k < _len3; _k++) {
                    comment = comments[_k];
                    for (_l = 0, _len4 = users.length; _l < _len4; _l++) {
                      user = users[_l];
                      if (("" + user._id) === ("" + comment.from_id)) {
                        comment.from_user = user;
                      }
                    }
                  }
                }
                return res.render('comments/comments', {
                  comments: comments,
                  _s: _s,
                  show_private: false,
                  layout: false
                });
              });
            } else {
              return res.render('comments/comments', {
                comments: comments,
                _s: _s,
                show_private: false,
                layout: false
              });
            }
          });
        });
      } else {
        return res.json([]);
      }
    });
    app.post('/comments', function(req, res) {
      var currentComment, currentUser, currentUserId, data, wallId;
      currentUser = req.user ? req.user : {};
      data = req.body;
      data.from_id = currentUser._id;
      data.added_at = new Date().getTime();
      currentUserId = "" + currentUser._id;
      wallId = "" + data.wall_id;
      if (wallId === currentUserId || __indexOf.call(currentUser.friends, wallId) >= 0) {
        currentComment = new Comment(data);
        currentComment.save(function(err, savedComment) {
          if (data.type === "status") {
            Notification.addForStatus(savedComment, currentUser);
          }
          if (data.type === "followup") {
            return Notification.addForFollowup(savedComment, currentUser);
          }
        });
        return res.json({
          success: true
        });
      }
    });
    app.put("/comments/:id", function(req, res) {
      var commentId, currentUser, data;
      currentUser = req.user ? req.user : {};
      commentId = req.params.id;
      data = req.body;
      delete data._id;
      return Comment.update({
        _id: commentId,
        from_id: currentUser._id
      }, data, {}, function(err, comment) {
        return res.json({
          success: true
        });
      });
    });
    return app.del("/comments/:id", function(req, res) {
      var commentId, currentUser;
      currentUser = req.user ? req.user : {};
      commentId = req.params.id;
      return Comment.findOne({
        _id: commentId
      }).run(function(err, comment) {
        if (("" + comment.from_id) === ("" + currentUser._id)) {
          return comment.remove(function() {
            return res.json({
              success: true
            });
          });
        } else {
          return res.json({
            error: "Comment could not be deleted"
          });
        }
      });
    });
  };

}).call(this);
