(function() {
  var FriendRequest, User;
  User = require('../models/user');
  FriendRequest = require('../models/friend_request');
  module.exports = function(app) {
    app.post('/friend-requests', function(req, res) {
      var currentUser, data;
      currentUser = req.user ? req.user : {};
      data = req.body;
      data.from_id = currentUser._id;
      return FriendRequest.findOne({
        email: data.email,
        from_id: data.from_id
      }).run(function(err, friendRequest) {
        if (!friendRequest) {
          friendRequest = new FriendRequest(data);
          friendRequest.save();
        }
        return res.json({
          success: true
        });
      });
    });
    return app.get('/friend-requests', function(req, res) {
      var currentUser;
      currentUser = req.user ? req.user : {};
      return FriendRequest.find({
        from_id: currentUser._id
      }).run(function(err, friendRequests) {
        return res.render('friend_requests/friend_requests', {
          friend_requests: friendRequests,
          show_private: false,
          layout: false
        });
      });
    });
  };
}).call(this);
