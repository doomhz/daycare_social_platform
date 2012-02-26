Tag = require('../models/tag')

module.exports = (app)->

  app.get '/tags/:type', (req, res)->
    type = req.params.type
    Tag.find({type: type}).run (err, tags)->
      res.json tags