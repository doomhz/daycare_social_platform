User = require("./user")
_    = require "underscore"

MessageSchema = new Schema
  from_id:
    type: String
  to_id:
    type: String
  type:
    type: String
    enum: ["default", "sent", "deleted"]
    default: "default"
  content:
    type: String
    default: ""
  unread:
    type: Boolean
    default: false
  created_at:
    type: Date
    default: Date.now
  updated_at:
    type: Date
    default: Date.now
  from_user:
    type: {}
  to_user:
    type: {}

MessageSchema.statics.send = (userId, data)->
  data.from_id = userId
  delete data.to_user
  delete data.from_user
  delete data.created_at
  delete data.updated_at

  message = new @(data)
  message.type = "default"
  message.unread = true
  message.save ()->
    Notification = require("./notification")
    Notification.triggerNewMessages(data.to_id)

  message = new @(data)
  message.type = "sent"
  message.save()

MessageSchema.statics.sendToClass = (fromUser, toClass, messageData)->
  messageData.to_id = toClass._id
  fromUserId = fromUser._id
  Message.send(fromUserId, messageData)
  receiverIds = _.filter toClass.friends, (receiverId)->
    receiverId isnt fromUserId
  User.find()
  .where("type").in(["parent", "staff", "daycare"])
  .where("_id").in(receiverIds).run (err, users = [])->
    fromId = if fromUser.type is "daycare" then toClass._id else fromUserId
    for user in users
      messageData.to_id = user._id
      Message.send(fromId, messageData)

MessageSchema.statics.findDefault = (toUserId, onFind)->
  @findMessages({to_id: toUserId, type: "default"}, onFind)

MessageSchema.statics.findSent = (fromUserId, onFind)->
  @findMessages({from_id: fromUserId, type: "sent"}, onFind)

MessageSchema.statics.findLastMessages = (toUserId, limit, onFind)->
  @findMessages({to_id: toUserId, type: "default"}, onFind, limit)

MessageSchema.statics.findMessages = (findOptions, onFind, limit = false)->
  @find(findOptions).desc('created_at').limit(limit).run (err, messages)->
    usersToFind = []
    if messages
      for message in messages
        if not (message.to_id in usersToFind) then usersToFind.push message.to_id
        if not (message.from_id in usersToFind) then usersToFind.push message.from_id
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for message in messages
            for user in users
              if "#{user._id}" is "#{message.to_id}" then message.to_user = user
              if "#{user._id}" is "#{message.from_id}" then message.from_user = user
        onFind(err, messages)
    else
      onFind(err, messages)

MessageSchema.statics.findConversations = (userId, onFind)->
  Message.find({to_id: userId, type: "default"}).desc('created_at').run (err, receivedMessages = [])->
    receivedMessages = _.uniq receivedMessages, false, (msg)->
      msg.from_id
    receivedUsersIds = _.map receivedMessages, (message = {})->
      message.from_id
    receivedUsersIds = receivedUsersIds or []
    Message.find({from_id: userId, type: "sent"}).where("to_id").nin(receivedUsersIds).desc('created_at').run (err, sentMessages = [])->
      sentMessages = _.uniq sentMessages, false, (msg)->
        msg.to_id
      messages = receivedMessages.concat(sentMessages)
      if messages
        usersToFind = _.map messages, (message = {})->
          if message.type is "default" then message.from_id else message.to_id
        usersToFind = _.uniq(usersToFind)
        User.find().where("_id").in(usersToFind).run (err, users)->
          if users
            for message in messages
              for user in users
                if "#{user._id}" is "#{message.to_id}" then message.to_user = user
                if "#{user._id}" is "#{message.from_id}" then message.from_user = user
          onFind(err, messages)
      else
        onFind(err, messages)

MessageSchema.statics.findMessagesFromUser = (userId, fromUserId, onFind)->
  Message.find().or([{to_id: userId, from_id: fromUserId, type: "default"}, {to_id: fromUserId, from_id: userId, type: "sent"}]).desc('created_at').run (err, messages)->
    if messages
      usersToFind = _.map messages, (message = {})->
        if message.type is "default" then message.from_id else message.to_id
      usersToFind = _.uniq(usersToFind)
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for message in messages
            for user in users
              if "#{user._id}" is "#{message.to_id}" then message.to_user = user
              if "#{user._id}" is "#{message.from_id}" then message.from_user = user
        onFind(err, messages)
    else
      onFind(err, messages)

Message = mongoose.model("Message", MessageSchema)

exports = module.exports = Message