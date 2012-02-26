Tag = require('../models/tag')

module.exports = (app)->

  app.get '/tags/:type', (req, res)->
    type = req.params.type
    Tag.find({type: type}).run (err, tags)->
      res.json tags

  app.post '/tag', (req, res)->
    data = req.body
    tag = new Tag(data)
    tag.save (err, savedTag)->
      res.json savedTag