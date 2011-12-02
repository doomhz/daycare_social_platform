User = require('../models/user')

module.exports = (app)->

  app.get '/*', (req, res, next)->
    console.log req
    publicRoutes =
      "/": true
      "/current-user": true
    if not req.user and not publicRoutes[req.url]
      res.writeHead(303, {'Location': '/login'})
      res.end()
    else
      next()