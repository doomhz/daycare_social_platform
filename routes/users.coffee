User = require('../models/user')

module.exports = (app)->

  app.get '/users', (req, res)->
    User.find().asc('name', 'surname').run (err, users)->
      # TODO Filter public data
      res.json users