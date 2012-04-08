(function() {
  var Comment, Notification, User, _s,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  User = require('../models/user');

  Comment = require('../models/comment');

  Notification = require('../models/notification');

  _s = require('underscore.string');

  module.exports = function(app) {
    app.get('/comments/:id', function(req, res) {
      var commentId, currentUser;
      currentUser = req.user ? req.user : {};
      commentId = req.params.id;
      return Comment.findOne({
        _id: commentId
      }).run(function(err, status) {
        return User.findOne({
          _id: status.from_id
        }).run(function(err, user) {
          if (user) status.from_user = user;
          return res.render('comments/comments', {
            comments: [status],
            _s: _s,
            show_private: false,
            layout: false
          });
        });
      });
    });
    app.get('/comment/:id', function(req, res) {
      var commentId, currentUser;
      currentUser = req.user ? req.user : {};
      commentId = req.params.id;
      return Comment.findOne({
        _id: commentId
      }).run(function(err, status) {
        return User.findOne({
          _id: status.from_id
        }).run(function(err, user) {
          if (user) status.from_user = user;
          return res.render('comments/_comment', {
            comment: status,
            _s: _s,
            show_private: false,
            layout: false
          });
        });
      });
    });
    app.get('/followups/:comment_id/:last_comment_time/:timeline', function(req, res) {
      var commentId, comparison, currentUser, followupsLimit, lastCommentTime, timeline, _ref;
      currentUser = req.user ? req.user : {};
      commentId = req.params.comment_id;
      lastCommentTime = req.params.last_comment_time;
      timeline = (_ref = req.params.timeline) === "future" || _ref === "past" ? req.params.timeline : "future";
      comparison = req.params.timeline === "future" ? "gt" : "lt";
      followupsLimit = req.query.limit || 2;
      return Comment.find({
        to_id: commentId,
        type: "followup"
      }).where('added_at')[comparison](lastCommentTime).limit(followupsLimit).desc("added_at").run(function(err, followups) {
        var followup, usersToFind, _i, _len;
        if (followups == null) followups = [];
        if (followups.length) {
          usersToFind = [];
          for (_i = 0, _len = followups.length; _i < _len; _i++) {
            followup = followups[_i];
            usersToFind.push(followup.from_id);
            followup.timeline = timeline;
          }
          return User.where("_id")["in"](usersToFind).run(function(err, users) {
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
            return res.render('comments/comments', {
              comments: followups,
              _s: _s,
              show_private: false,
              layout: false
            });
          });
        } else {
          return res.render('comments/comments', {
            comments: followups,
            _s: _s,
            show_private: false,
            layout: false
          });
        }
      });
    });
    app.get('/comments/:wall_id/:last_comment_time/:timeline', function(req, res) {
      var commentsLimit, comparison, currentUser, currentUserId, lastCommentTime, privacy, timeline, wallId, _ref;
      currentUser = req.user ? req.user : {};
      currentUserId = "" + currentUser._id;
      wallId = "" + req.params.wall_id;
      lastCommentTime = req.params.last_comment_time;
      timeline = (_ref = req.params.timeline) === "future" || _ref === "past" ? req.params.timeline : "future";
      comparison = req.params.timeline === "future" ? "gt" : "lt";
      privacy = ["public"];
      if (wallId === currentUserId || __indexOf.call(currentUser.friends, wallId) >= 0) {
        privacy.push("private");
      }
      commentsLimit = req.query.limit || 10;
      return Comment.find({
        wall_id: wallId,
        type: "status"
      }).where('added_at')[comparison](lastCommentTime).where("privacy")["in"](privacy).desc("added_at").limit(commentsLimit).run(function(err, comments) {
        var comment, usersToFind, _i, _len;
        if (comments == null) comments = [];
        usersToFind = [];
        for (_i = 0, _len = comments.length; _i < _len; _i++) {
          comment = comments[_i];
          usersToFind.push(comment.from_id);
          comment.timeline = timeline;
        }
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
            _s: _s,
            show_private: false,
            layout: false
          });
        });
      });
    });
    app.post('/comment', function(req, res) {
      var currentComment, currentUser, currentUserId, data, wallId;
      currentUser = req.user ? req.user : {};
      data = req.body;
      data.from_id = currentUser._id;
      data.added_at = new Date().getTime();
      currentUserId = "" + currentUser._id;
      wallId = "" + data.wall_id;
      if (wallId === currentUserId || __indexOf.call(currentUser.friends, wallId) >= 0 || (data.type === "followup" && data.privacy === "public")) {
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
    app.put("/comment/:id", function(req, res) {
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
    return app.del("/comment/:id", function(req, res) {
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
