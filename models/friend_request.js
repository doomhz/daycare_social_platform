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
    gender: {
      type: String,
      "enum": ['female', 'male'],
      "default": 'female'
    },
    status: {
      type: String,
      "enum": ["sent", "accepted"],
      "default": "sent"
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    user: {
      type: {}
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

  FriendRequestSchema.statics.updateFriendship = function(userId, onFriendshipUpdate) {
    var Child, FriendRequest;
    Child = mongoose.model("Child");
    FriendRequest = mongoose.model("FriendRequest");
    return FriendRequest.find({
      user_id: userId
    }).run(function(err, friendRequests) {
      var childrenIds, classesIds, daycareAndClassesToFind, friendRequest, gender, _i, _len;
      daycareAndClassesToFind = [];
      childrenIds = [];
      classesIds = [];
      gender = "";
      for (_i = 0, _len = friendRequests.length; _i < _len; _i++) {
        friendRequest = friendRequests[_i];
        daycareAndClassesToFind.push(friendRequest.from_id);
        childrenIds = childrenIds.concat(friendRequest.children_ids);
        classesIds = classesIds.concat(friendRequest.classes_ids);
        gender = friendRequest.gender;
      }
      return User.find().where("_id")["in"](classesIds).run(function(err, classes) {
        var daycareClass, _j, _len2;
        if (classes == null) classes = [];
        for (_j = 0, _len2 = classes.length; _j < _len2; _j++) {
          daycareClass = classes[_j];
          daycareAndClassesToFind.push(daycareClass._id);
        }
        return Child.find().where("_id")["in"](childrenIds).run(function(err, children) {
          var child, _k, _len3;
          if (children == null) children = [];
          for (_k = 0, _len3 = children.length; _k < _len3; _k++) {
            child = children[_k];
            daycareAndClassesToFind.push(child.user_id);
          }
          return User.find().where("_id")["in"](daycareAndClassesToFind).run(function(err, dayCares) {
            var dayCare, friendsToAdd, _l, _len4;
            friendsToAdd = [];
            for (_l = 0, _len4 = dayCares.length; _l < _len4; _l++) {
              dayCare = dayCares[_l];
              friendsToAdd = _.union(friendsToAdd, dayCare.friends);
              dayCare.friends.push(userId);
              dayCare.save();
            }
            return User.find().where("type")["in"](["parent", "staff"]).where("_id")["in"](friendsToAdd).run(function(err, dayCareFriends) {
              var myFriendsIds, userFriend, _len5, _m;
              myFriendsIds = daycareAndClassesToFind;
              for (_m = 0, _len5 = dayCareFriends.length; _m < _len5; _m++) {
                userFriend = dayCareFriends[_m];
                myFriendsIds.push(userFriend._id);
                userFriend.friends.push(userId);
                userFriend.save();
              }
              myFriendsIds = _.uniq(myFriendsIds);
              childrenIds = _.uniq(childrenIds);
              classesIds = _.uniq(classesIds);
              return User.update({
                _id: userId
              }, {
                friends: myFriendsIds,
                children_ids: childrenIds,
                classes_ids: classesIds,
                gender: gender
              }, {}, function(err) {
                if (onFriendshipUpdate) return onFriendshipUpdate(err);
              });
            });
          });
        });
      });
    });
  };

  FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

  exports = module.exports = FriendRequest;

}).call(this);
