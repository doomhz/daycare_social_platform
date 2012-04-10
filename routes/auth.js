(function() {
  var User;

  User = require('../models/user');

  module.exports = function(app) {
    app.get('/send-password', function(req, res) {
      var errors, success;
      if (req.query.error) errors = [req.query.error];
      success = req.query.success;
      return res.render('auth/send_password', {
        layout: "auth",
        title: "Send Password - Kindzy",
        errors: errors,
        success: success
      });
    });
    app.post('/send-password', function(req, res) {
      var email;
      email = req.body.email;
      if (email) {
        return User.findOne({
          email: email
        }).run(function(err, user) {
          if (user) {
            return user.sendPasswordLink({
              host: req.headers.host
            }, function() {
              res.writeHead(303, {
                "Location": "/send-password?success=true"
              });
              return res.end();
            });
          } else {
            res.writeHead(303, {
              "Location": "/send-password?error=wrong-user"
            });
            return res.end();
          }
        });
      } else {
        res.writeHead(303, {
          "Location": "/send-password"
        });
        return res.end();
      }
    });
    app.get('/change-password/:token', function(req, res) {
      var errors, token;
      token = req.params.token;
      if (req.query.error) errors = [req.query.error];
      return res.render('auth/change_password', {
        layout: "auth",
        title: "Change Password - Kindzy",
        token: token,
        errors: errors
      });
    });
    app.post('/change-password', function(req, res) {
      var confirm_password, password, token;
      token = req.body.token;
      password = req.body.password;
      confirm_password = req.body.confirm_password;
      if (password === confirm_password) {
        return User.findByToken(token, function(err, user) {
          if (user) {
            return user.changePassword(password, function() {
              res.writeHead(303, {
                "Location": "/login?msg=pass-changed"
              });
              return res.end();
            });
          } else {
            res.writeHead(303, {
              "Location": "/change-password/" + token + "?error=wrong-token"
            });
            return res.end();
          }
        });
      } else {
        res.writeHead(303, {
          "Location": "/change-password/" + token + "?error=wrong-pass"
        });
        return res.end();
      }
    });
    app.get('/daycare*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.get('/profile*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.put('/profile*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.post('/profile*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.del('/profile*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.get('/geolocatio*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.get('/comment*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.post('/comment*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.post('/message*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.get('/message*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.put('/message*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.del('/message*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    app.post('/user*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
    return app.put('/notification*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      } else {
        res.statusCode = 401;
        return res.json({
          "error": true
        });
      }
    });
  };

}).call(this);
