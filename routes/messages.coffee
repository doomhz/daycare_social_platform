User    = require('../models/user')
Message = require('../models/message')

module.exports = (app)->

  app.post '/messages', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    data.from_id = user._id
    delete data.from_user
    delete data.created_at
    delete data.updated_at
    
    message = new Message(data)
    message.type = "default"
    message.save()
    
    message = new Message(data)
    message.type = "sent"
    message.save()
    
    res.json {success: true}


  app.get '/messages/default', (req, res)->
    user = if req.user then req.user else {}
    Message.find({to_id: user._id, type: "default"}).desc('created_at').run (err, messages) ->
      res.json messages


  app.get '/messages/sent', (req, res)->
    user = if req.user then req.user else {}
    Message.find({from_id: user._id, type: "sent"}).desc('created_at').run (err, messages) ->
      res.json messages

  app.get '/messages/draft', (req, res)->
    user = if req.user then req.user else {}
    Message.find({from_id: user._id, type: "draft"}).desc('created_at').run (err, messages) ->
      res.json messages

  app.get '/messages/deleted', (req, res)->
    user = if req.user then req.user else {}
    Message.find({from_id: user._id, type: "deleted"}).desc('created_at').run (err, messages) ->
      res.json messages