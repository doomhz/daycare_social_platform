User         = require('../models/user')
Message      = require('../models/message')
Notification = require('../models/notification')
_s           = require("underscore.string")

module.exports = (app)->

  app.post '/messages', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    to_id = data.to_id
    if data.type is "draft"
      Message.saveDraft(user._id, data)
    else
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
