User = require('../models/user')

module.exports = (app)->

  app.get '/day-care*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.put '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.post '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.del '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.get '/geolocatio*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.get '/comment*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.post '/comment*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.post '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.get '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.put '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.del '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.post '/user*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()

  app.put '/notification*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()