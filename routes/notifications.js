(function() {
  var Notification;
  Notification = require('../models/notification');
  module.exports = function(app) {
    app.put('/notifications/wall-posts', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      Notification.update({
        user_id: user._id,
        type: "status",
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
    return app.put('/notifications/followups', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      Notification.update({
        user_id: user._id,
        type: "followup",
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
