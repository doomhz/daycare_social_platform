module.exports = (app)->

  app.get '/home', (req, res)->
    res.render 'users/home', {layout: 'users'}
  
  app.get '/logout', (req, res)->
      req.logout()
      res.redirect 'users/home', {layout: 'users'}