(function() {
  var Picture, PictureSet, User, UserSchema, exports, mongooseAuth, path;

  path = require("path");

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
    tiny_url: {
      type: String
    },
    mini_url: {
      type: String
    },
    small_url: {
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
      type: [Number],
      index: "2d"
    },
    location_components: {
      city: "",
      county: "",
      state: "",
      state_code: "",
      country: "",
      zip_code: ""
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
      "enum": ['female', 'male', 'mrs'],
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
    homebased: {
      type: Boolean,
      "default": false
    },
    religious_affiliation: {
      type: Boolean,
      "default": false
    },
    min_class_age: {
      type: Number,
      "default": 0
    },
    max_class_age: {
      type: Number,
      "default": 0
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
    reviewed_children: {
      type: Boolean,
      "default": false
    },
    daycare_friends: {
      type: [{}],
      "default": []
    },
    children: {
      type: [{}],
      "default": []
    },
    flags: {
      type: [String],
      "default": []
    }
  });

  UserSchema.methods.findDaycareFriends = function(onFind) {
    var User, that;
    that = this;
    User = mongoose.model('User');
    return User.find().where("type")["in"](["daycare", "class"]).where("_id")["in"](this.friends).run(function(err, daycareFriends) {
      var daycareFriend, daycareFriendData, _i, _len;
      that.daycare_friends = [];
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

  UserSchema.methods.getPronoun = function() {
    var pronoun, _ref;
    pronoun = "his";
    if ((_ref = this.type) === "daycare" || _ref === "class") {
      pronoun = "their";
    } else if (this.gender === "female") {
      pronoun = "her";
    }
    return pronoun;
  };

  UserSchema.methods.changePassword = function(cleartext, callback) {
    var bcrypt, that;
    bcrypt = require("bcrypt");
    that = this;
    return bcrypt.genSalt(10, function(error, salt) {
      return bcrypt.hash(cleartext, salt, function(error, hash) {
        that.hash = hash;
        that.salt = salt;
        return that.save(function() {
          return callback();
        });
      });
    });
  };

  UserSchema.methods.sendPasswordLink = function(options, callback) {
    var email, siteUrl, that;
    that = this;
    email = require("mailer");
    siteUrl = "http://" + options.host;
    return this.generateToken(function(token) {
      var Emailer, data, emailer, passUrl;
      passUrl = "" + siteUrl + "/change-password/" + token;
      data = {
        "profile_name": that.name,
        "profile_surname": that.surname,
        "site_url": siteUrl,
        "pass_url": passUrl
      };
      options = {
        to: that,
        subject: "Change password request on Kindzy.com",
        template: "change_password"
      };
      Emailer = require("../lib/emailer");
      emailer = new Emailer(options, data);
      emailer.send(function(err, result) {
        if (err) return console.log(err);
      });
      return callback();
    });
  };

  UserSchema.methods.generateToken = function(callback) {
    return callback(this._id);
  };

  UserSchema.statics.findByToken = function(token, callback) {
    return User.findOne({
      _id: token
    }).run(function(err, user) {
      return callback(err, user);
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
          return User;
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
        respondToLoginSucceed: function(res, user, data) {
          var FriendRequest, friendRequestId, redirectTo, userId, _ref;
          if (user == null) user = {};
          userId = "" + user._id;
          friendRequestId = data.req.body.friend_request_id;
          redirectTo = "/";
          if (user.type === "daycare") {
            res.writeHead(303, {
              'Location': redirectTo
            });
            return res.end();
          } else if ((_ref = user.type) === "parent" || _ref === "staff") {
            if (friendRequestId) {
              FriendRequest = mongoose.model("FriendRequest");
              return FriendRequest.findOne({
                _id: friendRequestId
              }).run(function(err, friendRequest) {
                friendRequest.status = "accepted";
                friendRequest.user_id = userId;
                return friendRequest.save(function(err, updateRequest) {
                  return FriendRequest.updateFriendship(userId, function(err) {
                    var userInfo;
                    userInfo = {
                      reviewed_children: false
                    };
                    return User.update({
                      _id: userId
                    }, userInfo, {}, function(err) {
                      res.writeHead(303, {
                        'Location': redirectTo
                      });
                      return res.end();
                    });
                  });
                });
              });
            } else {
              res.writeHead(303, {
                'Location': redirectTo
              });
              return res.end();
            }
          }
        },
        respondToRegistrationSucceed: function(res, user, data) {
          var redirectTo, userInfo;
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
          return User.update({
            _id: user._id
          }, userInfo, {}, function(err) {
            var FriendRequest, friendRequestId, userId, _ref;
            userId = user._id;
            if (user.type === 'daycare') {
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
                friendRequest.status = "accepted";
                friendRequest.user_id = userId;
                friendRequest.save();
                return FriendRequest.updateFriendship(userId, function(err) {
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

  User = mongoose.model('User', UserSchema);

  exports = module.exports = User;

}).call(this);
