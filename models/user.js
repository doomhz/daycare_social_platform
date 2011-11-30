(function() {
  var UserSchema, exports, mongooseAuth;
  mongooseAuth = require('mongoose-auth');
  UserSchema = new Schema({
    type: {
      type: String,
      "enum": ['daycare', 'parent'],
      "default": 'daycare'
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
        type: String
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
          var DayCare, dayCare, redirectTo;
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
  exports = module.exports = mongoose.model('User', UserSchema);
}).call(this);
