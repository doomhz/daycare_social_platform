(function() {
  var Notification;
  Notification = require('../models/notification');
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
    return app.put('/notifications/alerts', function(req, res) {
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
  };
}).call(this);
