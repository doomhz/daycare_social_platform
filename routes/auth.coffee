User = require('../models/user')

module.exports = (app)->

  app.get '/day-care*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.put '/day-care*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
  
  app.post '/day-care*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
  
  app.del '/day-care*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.get '/geolocatio*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
  
  app.post '/comment*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()