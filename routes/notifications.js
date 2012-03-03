(function() {
  var Notification, _;

  Notification = require('../models/notification');

  _ = require('underscore');

  module.exports = function(app) {
    app.put('/notifications/feeds', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      Notification.update({
        user_id: user._id,
        type: "feed",
        unread: true
      }, {
        unread: false
      }, {
        multi: true
      }, function(err, notifications) {
        return Notification.triggerNewWallPosts(user._id);
      });
      return res.json({
        success: true
      });
    });
    app.put('/notifications/alerts', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      Notification.update({
        user_id: user._id,
        type: "alert",
        unread: true
      }, {
        unread: false
      }, {
        multi: true
      }, function(err, notifications) {
        return Notification.triggerNewFollowups(user._id);
      });
      return res.json({
        success: true
      });
    });
    app.put('/notifications/requests', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      Notification.update({
        user_id: user._id,
        type: "request",
        unread: true
      }, {
        unread: false
      }, {
        multi: true
      }, function(err, notifications) {
        return Notification.triggerNewRequests(user._id);
      });
      return res.json({
        success: true
      });
    });
    return app.get('/notifications/:type/:max_time', function(req, res) {
      var currentUser, maxTime, type;
      currentUser = req.user ? req.user : {};
      type = req.params.type;
      maxTime = req.params.max_time;
      return Notification.find({
        user_id: currentUser._id,
        type: type
      }).where("created_at").lte(maxTime).limit(10).desc("created_at").run(function(err, notifications) {
        var notification, usersToFind, _i, _len;
        if (notifications == null) notifications = [];
        usersToFind = [];
        for (_i = 0, _len = notifications.length; _i < _len; _i++) {
          notification = notifications[_i];
          usersToFind.push(notification.from_id);
        }
        usersToFind = _.uniq(usersToFind);
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var notification, user, _j, _k, _len2, _len3;
          if (users == null) users = [];
          for (_j = 0, _len2 = notifications.length; _j < _len2; _j++) {
            notification = notifications[_j];
            for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
              user = users[_k];
              if (("" + user._id) === ("" + notification.from_id)) {
                notification.from_user = user;
              }
            }
          }
          return res.render('notifications/notifications', {
            notifications: notifications,
            show_private: true,
            layout: false
          });
        });
      });
    });
  };

}).call(this);
