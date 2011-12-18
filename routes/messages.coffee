User    = require('../models/user')
Message = require('../models/message')

module.exports = (app)->

  app.post '/messages', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    to_id = data.to_id
    if typeof to_id isnt "string"
      for id in to_id
        messageData = data
        messageData.to_id = id
        Message.send(user._id, messageData)
    else
      Message.send(user._id, data)
    res.json {success: true}

  app.del '/messages/:id', (req, res)->
    messageId = req.params.id
    user = if req.user then req.user else {}
    Message.findOne({_id: messageId, to_id: user._id}).run (err, message)->
      if message
        message.type = "deleted"
        message.save()
    res.json {success: true}

  app.put '/messages/:id', (req, res)->
    messageId = req.params.id
    user = if req.user then req.user else {}
    data = req.body
    delete data._id
    delete data.updated_at
    Message.update {_id: messageId, to_id: user._id}, data, {}, (err, message)->
      res.json {success: true}

  app.get '/messages/default', (req, res)->
    user = if req.user then req.user else {}
    Message.findDefault user._id, (err, messages)->
      res.json messages

  app.get '/messages/sent', (req, res)->
    user = if req.user then req.user else {}
    Message.findSent user._id, (err, messages)->
      res.json messages

  app.get '/messages/draft', (req, res)->
    user = if req.user then req.user else {}
    Message.findDraft user._id, (err, messages)->
      res.json messages

  app.get '/messages/deleted', (req, res)->
    user = if req.user then req.user else {}
    Message.findDeleted user._id, (err, messages)->
      res.json messages
