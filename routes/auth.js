(function() {
  var User;
  User = require('../models/user');
  module.exports = function(app) {
    app.get('/day-care*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      }
    });
    app.put('/day-care*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      }
    });
    app.post('/day-care*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      }
    });
    app.del('/day-care*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      }
    });
    return app.get('/geolocatio*', function(req, res, next) {
      if (User.checkPermissions(req.user, null, null, res)) {
        return next();
      }
    });
  };
}).call(this);
