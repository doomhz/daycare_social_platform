(function() {
  var Picture, PictureSet, UserSchema, exports, mongooseAuth;

  mongooseAuth = require('mongoose-auth');

  Picture = new Schema({
    primary: {
      type: Boolean,
      "default": false
    },
    description: {
      type: String
    },
    url: {
      type: String
    },
    thumb_url: {
      type: String
    },
    medium_url: {
      type: String
    },
    big_url: {
      type: String
    },
    success: Boolean
  });

  PictureSet = new Schema({
    user_id: {
      type: String
    },
    name: {
      type: String,
      index: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      "enum": ['default', 'public', 'profile'],
      "default": 'default'
    },
    pictures: [Picture]
  });

  UserSchema = new Schema({
    master_id: {
      type: String
    },
    name: {
      type: String,
      index: true
    },
    surname: {
      type: String,
      index: true
    },
    speaking_classes: [Number],
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    email: String,
    phone: String,
    fax: String,
    contact_person: String,
    licensed: {
      type: Boolean
    },
    license_number: String,
    type: {
      type: String,
      "enum": ['daycare', 'parent', 'class', 'staff'],
      "default": 'daycare'
    },
    gender: {
      type: String,
      "enum": ['female', 'male'],
      "default": 'female'
    },
    opened_since: {
      type: String
    },
    open_door_policy: {
      type: Boolean
    },
    serving_disabilities: {
      type: Boolean
    },
    picture_sets: {
      type: [PictureSet]
    },
    friends: {
      type: [String],
      "default": []
    },
    children_ids: {
      type: [String],
      "default": []
    },
    daycare_friends: {
      type: [{}],
      "default": []
    },
    children: {
      type: [{}],
      "default": []
    }
  });

  UserSchema.methods.findDaycareFriends = function(onFind) {
    var User, that;
    that = this;
    User = mongoose.model('User');
    return User.find().where("type")["in"](["daycare", "class"]).where("_id")["in"](this.friends).run(function(err, daycareFriends) {
      var daycareFriend, daycareFriendData, _i, _len;
      for (_i = 0, _len = daycareFriends.length; _i < _len; _i++) {
        daycareFriend = daycareFriends[_i];
        daycareFriendData = {
          _id: daycareFriend._id,
          name: daycareFriend.name
        };
        that.daycare_friends.push(daycareFriendData);
      }
      return onFind(err, daycareFriends);
    });
  };

  UserSchema.statics.checkPermissions = function(object, requiredKey, requiredValue, resForAutoRedirect) {
    if (object == null) object = {};
    if (object && (!requiredKey || !requiredValue)) return true;
    if (object[requiredKey] === requiredValue) return true;
    if (resForAutoRedirect) {
      resForAutoRedirect.writeHead(303, {
        'Location': '/login'
      });
      resForAutoRedirect.end();
    }
    return false;
  };

  UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
        User: function() {
          return mongoose.model('User');
        },
        logoutPath: '/logout',
        logoutRedirectPath: '/login',
        handleLogout: function(req, res) {
          req.logout();
          res.writeHead(303, {
            'Location': this.logoutRedirectPath()
          });
          return res.end();
        }
      }
    },
    password: {
      loginWith: 'email',
      extraParams: {
        type: String,
        name: String,
        surname: String,
        friend_request_id: String
      },
      everyauth: {
        loginFormFieldName: 'email',
        getLoginPath: '/login',
        postLoginPath: '/login',
        loginLayout: 'auth.jade',
        loginView: 'auth/login.jade',
        getRegisterPath: '/register',
        postRegisterPath: '/register',
        registerLayout: 'auth.jade',
        registerView: 'auth/register.jade',
        loginSuccessRedirect: '/',
        registerSuccessRedirect: '/',
        respondToRegistrationSucceed: function(res, user, data) {
          var User, redirectTo, userInfo;
          redirectTo = '/';
          userInfo = {
            picture_sets: [
              {
                type: 'profile',
                name: 'Profile pictures',
                description: 'Your profile pictures.',
                pictures: []
              }
            ]
          };
          User = mongoose.model('User');
          return User.update({
            _id: user._id
          }, userInfo, {}, function(err) {
            var FriendRequest, friendRequestId, userId, _ref;
            userId = user._id;
            if (user.type === 'daycare') {
              redirectTo = "/#profiles/edit/" + userId;
              res.writeHead(303, {
                'Location': redirectTo
              });
              return res.end();
            } else if (((_ref = user.type) === "parent" || _ref === "staff") && user.friend_request_id) {
              friendRequestId = user.friend_request_id;
              FriendRequest = require("./friend_request");
              return FriendRequest.findOne({
                _id: friendRequestId
              }).run(function(err, friendRequest) {
                var dayCareId;
                friendRequest.status = "accepted";
                friendRequest.user_id = userId;
                friendRequest.save();
                dayCareId = friendRequest.from_id;
                redirectTo = "/#profiles/view/" + dayCareId;
                return friendRequest.updateFriendship(userId, function(err) {
                  res.writeHead(303, {
                    'Location': redirectTo
                  });
                  return res.end();
                });
              });
            } else {
              res.writeHead(303, {
                'Location': redirectTo
              });
              return res.end();
            }
          });
        }
      }
    }
  });

  exports = module.exports = mongoose.model('User', UserSchema);

}).call(this);
