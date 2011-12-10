(function() {
  var UserSchema, exports, mongooseAuth;
  mongooseAuth = require('mongoose-auth');
  UserSchema = new Schema({
    type: {
      type: String,
      "enum": ['daycare', 'parent'],
      "default": 'daycare'
    },
    daycare_id: {
      type: String
    },
    daycare_name: {
      type: String
    },
    name: {
      type: String
    },
    surname: {
      type: String
    }
  });
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
        daycare_name: String
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
          var DayCare, User, dayCare, redirectTo;
          redirectTo = '/';
          if (user.type === 'daycare') {
            DayCare = require('./day_care');
            dayCare = new DayCare({
              user_id: user._id,
              picture_sets: [
                {
                  type: 'profile',
                  name: 'Profile pictures',
                  description: 'Your profile pictures.',
                  pictures: []
                }
              ]
            });
            dayCare.save();
            User = require('./user');
            User.update({
              _id: user._id
            }, {
              daycare_id: dayCare._id
            });
            redirectTo = "/#day-cares/edit/" + dayCare._id;
          }
          res.writeHead(303, {
            'Location': redirectTo
          });
          return res.end();
        }
      }
    }
  });
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
  exports = module.exports = mongoose.model('User', UserSchema);
}).call(this);
