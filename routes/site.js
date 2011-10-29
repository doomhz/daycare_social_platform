(function() {
  var DayCare;
  DayCare = require('../models/day_care');
  module.exports = function(app) {
    return app.get('/', function(req, res) {
      return res.render('site/index', {
        title: "Kindzy.com"
      });
    });
  };
}).call(this);
