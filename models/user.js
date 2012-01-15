(function() {
  var Picture, PictureSet, UserSchema, exports, mongooseAuth;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
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
      "enum": ['daycare', 'parent'],
      "default": 'daycare'
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
    }
  });
  UserSchema.methods.filterPrivateDataByUserId = function(user_id) {
    var user, users, _i, _len;
    if (this.constructor === Array) {
      users = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        user = this[_i];
        if (("" + user_id) === ("" + user._id)) {
          users.push(user);
        } else {
          users.push(UserSchema.statics.getPublicData(user));
        }
      }
      return users;
    } else {
      if (("" + user_id) === ("" + this._id)) {
        return this;
      } else {
        return UserSchema.statics.getPublicData(this);
      }
    }
  };
  UserSchema.statics.filterPrivatePictureSetsByUserId = function(user_id, guestUserId, pictureSets) {
    var pictureSet, publicPictureSetTypes, publicPictureSets, _i, _len, _ref;
    if (("" + user_id) === ("" + guestUserId)) {
      return pictureSets;
    } else {
      publicPictureSetTypes = ["profile", "public"];
      publicPictureSets = [];
      for (_i = 0, _len = pictureSets.length; _i < _len; _i++) {
        pictureSet = pictureSets[_i];
        if (_ref = pictureSet.type, __indexOf.call(publicPictureSetTypes, _ref) >= 0) {
          publicPictureSets.push(pictureSet);
        }
      }
      return publicPictureSets;
    }
  };
  UserSchema.statics.getPublicData = function(user) {
    var data, key, pictureSet, publicPictureSetTypes, publicRows, val, _i, _len, _ref, _ref2;
    data = {};
    publicRows = {
      "_id": true,
      "name": true,
      "surname": true,
      "speaking_classes": true,
      "address": true,
      "location": true,
      "email": true,
      "phone": true,
      "fax": true,
      "contact_person": true,
      "licensed": true,
      "license_number": true,
      "type": true,
      "opened_since": true,
      "open_door_policy": true,
      "serving_disabilities": true
    };
    for (key in user) {
      val = user[key];
      if (publicRows[key]) {
        data[key] = val;
      }
    }
    data.picture_sets = [];
    publicPictureSetTypes = ["profile", "public"];
    _ref = user.picture_sets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pictureSet = _ref[_i];
      if (_ref2 = pictureSet.type, __indexOf.call(publicPictureSetTypes, _ref2) >= 0) {
        data.picture_sets.push(pictureSet);
      }
    }
    return data;
  };
  UserSchema.statics.checkPermissions = function(object, requiredKey, requiredValue, resForAutoRedirect) {
    if (object == null) {
      object = {};
    }
    if (object && (!requiredKey || !requiredValue)) {
      return true;
    }
    if (object[requiredKey] === requiredValue) {
      return true;
    }
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
          User = require('./user');
          return User.update({
            _id: user._id
          }, userInfo, {}, function(err) {
            var FriendRequest, friendRequestId, userId;
            userId = user._id;
            if (user.type === 'daycare') {
              redirectTo = "/#profiles/edit/" + userId;
              res.writeHead(303, {
                'Location': redirectTo
              });
              return res.end();
            } else if (user.type === "parent" && user.friend_request_id) {
              friendRequestId = user.friend_request_id;
              FriendRequest = require("./friend_request");
              return FriendRequest.findOne({
                _id: friendRequestId
              }).run(function(err, friendRequest) {
                var dayCareId;
                friendRequest.status = "accepted";
                friendRequest.save();
                dayCareId = friendRequest.from_id;
                redirectTo = "/#profiles/view/" + dayCareId;
                User.findOne({
                  _id: dayCareId
                }).run(function(err, dayCare) {
                  dayCare.friends.push(userId);
                  return dayCare.save();
                });
                return User.update({
                  _id: userId
                }, {
                  friends: [dayCareId]
                }, {}, function(err) {
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
