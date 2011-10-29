DayCare = require('../models/day_care');

module.exports = (app)->

  app.get '/day-cares', (req, res)->
    DayCare.find({}).desc('created_at').run (err, dayCares) ->
      res.json dayCares

  ###
  app.param 'id', (req, res, next, id)->
    DayCare.findOne({ _id : req.params.id }, (err, dayCare)->
      if (err) return next(err);
      if (!dayCare) return next(new Error('Failed to load article ' + id));
      req.dayCare = dayCare
      next()
  ###

  app.get '/day-cares/load/:id', (req, res)->
    DayCare.findOne({_id: req.params.id}).run (err, dayCare) ->
      res.json dayCare

  app.put '/day-cares/load/:id', (req, res)->
    data = req.body
    delete data._id
    DayCare.update {_id: req.params.id}, data, {}, (err, dayCare) ->
      res.json {success: true}
