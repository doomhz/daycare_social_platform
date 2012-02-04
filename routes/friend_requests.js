(function() {
  var FriendRequest, User, _;

  User = require('../models/user');

  FriendRequest = require('../models/friend_request');

  _ = require('underscore');

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
          FriendRequest.sendMail(friendRequest, {
            host: req.headers.host
          });
        }
        return res.json({
          success: true
        });
      });
    });
    app.put('/friend-requests/:id', function(req, res) {
      var currentUser, data, friendRequestId;
      friendRequestId = req.params.id;
      currentUser = req.user ? req.user : {};
      data = req.body;
      delete data._id;
      data.from_id = currentUser._id;
      return FriendRequest.findOne({
        _id: friendRequestId
      }).run(function(err, friendRequest) {
        if (friendRequest) {
          friendRequest.set(data);
          friendRequest.save(function() {
            if (friendRequest.status === "accepted" && friendRequest.user_id) {
              return User.findOne({
                _id: friendRequest.user_id
              }).run(function(err, requestUser) {
                return User.find().where("_id")["in"](requestUser.friends).run(function(err, userFriends) {
                  var userFriend, _i, _len;
                  for (_i = 0, _len = userFriends.length; _i < _len; _i++) {
                    userFriend = userFriends[_i];
                    userFriend.friends = _.filter(userFriend.friends, function(friendId) {
                      return friendId !== ("" + requestUser._id);
                    });
                    userFriend.save();
                  }
                  requestUser.friends = [];
                  requestUser.save();
                  return friendRequest.updateFriendship(requestUser._id);
                });
              });
            }
          });
        }
        return res.json({
          success: true
        });
      });
    });
    app.get('/friend-requests/:type', function(req, res) {
      var currentUser, type;
      currentUser = req.user ? req.user : {};
      type = req.params.type || "parent";
      return FriendRequest.find({
        from_id: currentUser._id,
        type: type
      }).run(function(err, friendRequests) {
        return res.render('friend_requests/friend_requests', {
          friend_requests: friendRequests,
          show_private: false,
          layout: false
        });
      });
    });
    return app.get('/friend-request/:id', function(req, res) {
      var friendRequestId;
      friendRequestId = req.params.id;
      return FriendRequest.findOne({
        _id: friendRequestId
      }).run(function(err, friendRequest) {
        return res.render('friend_requests/_friend_request', {
          friend_request: friendRequest,
          show_private: false,
          layout: false
        });
      });
    });
  };

}).call(this);
