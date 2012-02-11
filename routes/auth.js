(function() {
  var User;

  User = require('../models/user');

  module.exports = function(app) {
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
