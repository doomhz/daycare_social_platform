User = require('../models/user')

module.exports = (app)->

  app.get '/send-password', (req, res)->
    if req.query.error
      errors = [req.query.error]
    success = req.query.success
    res.render 'auth/send_password', {layout: "auth", title: "Send Password - Kindzy", errors: errors, success: success}

  app.post '/send-password', (req, res)->
    email = req.body.email
    if email
      User.findOne({email: email}).run (err, user)->
        if user
          user.sendPasswordLink {host: req.headers.host}, ()->
            res.writeHead(303, {"Location": "/send-password?success=true"})
            res.end()
        else
          res.writeHead(303, {"Location": "/send-password?error=wrong-user"})
          res.end()
    else
      res.writeHead(303, {"Location": "/send-password"})
      res.end()

  app.get '/change-password/:token', (req, res)->
    token = req.params.token
    if req.query.error
      errors = [req.query.error]
    res.render 'auth/change_password', {layout: "auth", title: "Change Password - Kindzy", token: token, errors: errors}

  app.post '/change-password', (req, res)->
    token = req.body.token
    password = req.body.password
    confirm_password = req.body.confirm_password
    if password is confirm_password
      User.findByToken token, (err, user)->
        if user
          user.changePassword password, ()->
            res.writeHead(303, {"Location": "/login?msg=pass-changed"})
            res.end()
        else
          res.writeHead(303, {"Location": "/change-password/#{token}?error=wrong-token"})
          res.end()
    else
      res.writeHead(303, {"Location": "/change-password/#{token}?error=wrong-pass"})
      res.end()

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
