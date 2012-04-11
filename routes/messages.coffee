User         = require('../models/user')
Message      = require('../models/message')
Notification = require('../models/notification')
_s           = require("underscore.string")

module.exports = (app)->

  app.post '/messages', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    toId = if typeof data.to_id is "string" then [data.to_id] else data.to_id
    for id in toId
      User.findOne({_id: id}).run (err, user = {})->
        messageData = data
        if user.type is "class"
          Message.sendToClass(currentUser, user, messageData)
        else
          messageData.to_id = id
          Message.send(currentUser._id, messageData)
    res.json {success: true}

  app.del '/messages/:id', (req, res)->
    messageId = req.params.id
    user = if req.user then req.user else {}
    Message.findOne({_id: messageId, to_id: user._id}).run (err, message)->
      if message
        message.type = "deleted"
        message.save()
      Notification.triggerNewMessages(user._id)
    res.json {success: true}

  app.put '/messages/:id', (req, res)->
    messageId = req.params.id
    user = if req.user then req.user else {}
    data = req.body
    delete data._id
    delete data.updated_at
    Message.update {_id: messageId, to_id: user._id}, data, {}, (err, message)->
      Notification.triggerNewMessages(user._id)
      res.json {success: true}

  app.get '/messages', (req, res)->
    user = if req.user then req.user else {}
    Message.findConversations user._id, (err, messages)->
      res.render 'messages/messages', {messages: messages, _s: _s, show_private: false, layout: false}

  app.get '/messages/from/:id', (req, res)->
    user = if req.user then req.user else {}
    fromId = req.params.id
    Message.findMessagesFromUser user._id, fromId, (err, messages)->
      res.render 'messages/messages', {messages: messages, _s: _s, show_private: false, layout: false}

  app.get '/messages/:id', (req, res)->
    messageId = req.params.id
    user = if req.user then req.user else {}
    Message.findOne({_id: messageId}).run (err, message)->
      res.render 'messages/_message', {message: message, _s: _s, show_private: false, layout: false}
