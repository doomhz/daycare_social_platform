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
    type: {
      type: String,
      "enum": ['parent', 'staff'],
      "default": 'parent'
    },
    children_ids: {
      type: [String]
    },
    classes_ids: {
      type: [String]
    },
    parent_type: {
      type: String,
      "enum": ['mother', 'father'],
      "default": 'mother'
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
        template: "./views/emails/" + friendRequest.type + "_invite.html",
        body: "Please use a newer version of an e-mail manager to read this mail in HTML format.",
        data: {
          "daycare_name": daycare.name,
          "profile_name": friendRequest.name,
          "profile_surname": friendRequest.surname,
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
    var Child, childrenIds, classesIds, daycareAndClassesToFind, parentType;
    Child = require("./child");
    daycareAndClassesToFind = [];
    daycareAndClassesToFind.push(this.from_id);
    childrenIds = this.children_ids;
    classesIds = this.classes_ids;
    parentType = this.parent_type;
    return User.find().where("_id")["in"](this.classes_ids).run(function(err, classes) {
      var daycareClass, _i, _len;
      if (classes == null) classes = [];
      for (_i = 0, _len = classes.length; _i < _len; _i++) {
        daycareClass = classes[_i];
        daycareAndClassesToFind.push(daycareClass._id);
      }
      return Child.find().where("_id")["in"](childrenIds).run(function(err, children) {
        var child, _j, _len2;
        if (children == null) children = [];
        for (_j = 0, _len2 = children.length; _j < _len2; _j++) {
          child = children[_j];
          daycareAndClassesToFind.push(child.user_id);
        }
        return User.find().where("_id")["in"](daycareAndClassesToFind).run(function(err, dayCares) {
          var dayCare, friendsToAdd, _k, _len3;
          friendsToAdd = [];
          for (_k = 0, _len3 = dayCares.length; _k < _len3; _k++) {
            dayCare = dayCares[_k];
            friendsToAdd = _.union(friendsToAdd, dayCare.friends);
            dayCare.friends.push(userId);
            dayCare.save();
          }
          return User.find().where("type")["in"](["parent", "staff"]).where("_id")["in"](friendsToAdd).run(function(err, dayCareFriends) {
            var myFriendsIds, userFriend, _l, _len4;
            myFriendsIds = daycareAndClassesToFind;
            for (_l = 0, _len4 = dayCareFriends.length; _l < _len4; _l++) {
              userFriend = dayCareFriends[_l];
              myFriendsIds.push(userFriend._id);
              userFriend.friends.push(userId);
              userFriend.save();
            }
            return User.update({
              _id: userId
            }, {
              friends: myFriendsIds,
              children_ids: childrenIds,
              classes_ids: classesIds,
              parent_type: parentType
            }, {}, function(err) {
              if (onFriendshipUpdate) return onFriendshipUpdate(err);
            });
          });
        });
      });
    });
  };

  FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

  exports = module.exports = FriendRequest;

}).call(this);
