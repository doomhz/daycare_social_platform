(function() {
  var FriendRequest, FriendRequestSchema, User, exports, _;

  User = require("./user");

  _ = require('underscore');

  FriendRequestSchema = new Schema({
    user_id: {
      type: String
    },
    from_id: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    children_ids: {
      type: [String]
    },
    status: {
      type: String,
      "enum": ["sent", "accepted"],
      "default": "sent"
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });

  FriendRequestSchema.statics.sendMail = function(friendRequest, options) {
    return User.findOne({
      _id: friendRequest.from_id
    }).run(function(err, daycare) {
      var email, inviteUrl, siteUrl;
      email = require("mailer");
      siteUrl = "http://" + options.host;
      inviteUrl = "" + siteUrl + "/register?friend_request=" + friendRequest._id;
      return email.send({
        host: "smtp.gmail.com",
        port: "587",
        ssl: false,
        domain: "localhost",
        to: "'" + friendRequest.name + " " + friendRequest.surname + "' <" + friendRequest.email + ">",
        from: "'Kindzy.com' <no-reply@kindzy.com>",
        subject: "Friend request from " + daycare.name + " on Kindzy.com",
        template: "./views/emails/parent_invite.html",
        body: "Please use a newer version of an e-mail manager to read this mail in HTML format.",
        data: {
          "daycare_name": daycare.name,
          "parent_name": friendRequest.name,
          "parent_surname": friendRequest.surname,
          "site_url": siteUrl,
          "invite_url": inviteUrl
        },
        authentication: "login",
        username: "no-reply@kindzy.com",
        password: "greatreply#69"
      }, function(err, result) {
        if (err) return console.log(err);
      });
    });
  };

  FriendRequestSchema.methods.updateFriendship = function(userId, onFriendshipUpdate) {
    var Child, childrenIds, daycareAndClassesToFind;
    Child = require("./child");
    daycareAndClassesToFind = [];
    daycareAndClassesToFind.push(this.from_id);
    childrenIds = this.children_ids;
    return Child.find().where("_id")["in"](this.children_ids).run(function(err, children) {
      var child, _i, _len;
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        daycareAndClassesToFind.push(child.user_id);
      }
      return User.find().where("_id")["in"](daycareAndClassesToFind).run(function(err, dayCares) {
        var dayCare, friendsToAdd, _j, _len2;
        friendsToAdd = [];
        for (_j = 0, _len2 = dayCares.length; _j < _len2; _j++) {
          dayCare = dayCares[_j];
          friendsToAdd = _.union(friendsToAdd, dayCare.friends);
          dayCare.friends.push(userId);
          dayCare.save();
        }
        return User.find({
          type: "parent"
        }).where("_id")["in"](friendsToAdd).run(function(err, dayCareFriends) {
          var myFriendsIds, userFriend, _k, _len3;
          myFriendsIds = daycareAndClassesToFind;
          for (_k = 0, _len3 = dayCareFriends.length; _k < _len3; _k++) {
            userFriend = dayCareFriends[_k];
            myFriendsIds.push(userFriend._id);
            userFriend.friends.push(userId);
            userFriend.save();
          }
          return User.update({
            _id: userId
          }, {
            friends: myFriendsIds,
            children_ids: childrenIds
          }, {}, function(err) {
            if (onFriendshipUpdate) return onFriendshipUpdate(err);
          });
        });
      });
    });
  };

  FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

  exports = module.exports = FriendRequest;

}).call(this);
