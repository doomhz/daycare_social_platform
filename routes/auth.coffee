User = require('../models/user')

module.exports = (app)->
  app.get '/daycare*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.get '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.put '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.post '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.del '/profile*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.get '/geolocatio*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.get '/comment*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.post '/comment*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.post '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.get '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.put '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.del '/message*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.post '/user*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}

  app.put '/notification*', (req, res, next)->
    if User.checkPermissions(req.user, null, null, res)
      next()
    else
      res.statusCode = 401
      res.json {"error": true}