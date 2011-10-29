(function() {
  var DayCare;
  DayCare = require('../models/day_care');
  module.exports = function(app) {
    app.get('/day-cares', function(req, res) {
      return DayCare.find({}).desc('created_at').run(function(err, dayCares) {
        return res.json(dayCares);
      });
    });
    /*
      app.param 'id', (req, res, next, id)->
        DayCare.findOne({ _id : req.params.id }, (err, dayCare)->
          if (err) return next(err);
          if (!dayCare) return next(new Error('Failed to load article ' + id));
          req.dayCare = dayCare
          next()
      */
    app.get('/day-cares/load/:id', function(req, res) {
      return DayCare.findOne({
        _id: req.params.id
      }).run(function(err, dayCare) {
        return res.json(dayCare);
      });
    });
    return app.put('/day-cares/load/:id', function(req, res) {
      var data;
      data = req.body;
      delete data._id;
      return DayCare.update({
        _id: req.params.id
      }, data, {}, function(err, dayCare) {
        return res.json({
          success: true
        });
      });
    });
  };
}).call(this);
