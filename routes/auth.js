(function() {
  var User;
  User = require('../models/user');
  module.exports = function(app) {
    return app.get('/*', function(req, res, next) {
      var publicRoutes;
      console.log(req);
      publicRoutes = {
        "/": true,
        "/current-user": true
      };
      if (!req.user && !publicRoutes[req.url]) {
        res.writeHead(303, {
          'Location': '/login'
        });
        return res.end();
      } else {
        return next();
      }
    });
  };
}).call(this);
