mongooseAuth = require('mongoose-auth')
User         = require("./user")

MessageSchema = new Schema
  from_id:
    type: String
  to_id:
    type: String
  type:
    type: String
    enum: ["default", "draft", "sent", "deleted"]
    default: "default"
  content:
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
  message.save()
  
  message = new @(data)
  message.type = "sent"
  message.save()

MessageSchema.statics.findDefault = (toUserId, onFind)->
  @findMessages({to_id: toUserId, type: "default"}, onFind)

MessageSchema.statics.findSent = (fromUserId, onFind)->
  @findMessages({from_id: fromUserId, type: "sent"}, onFind)

MessageSchema.statics.findDraft = (fromUserId, onFind)->
  @findMessages({from_id: fromUserId, type: "draft"}, onFind)

MessageSchema.statics.findDeleted = (toUserId, onFind)->
  @findMessages({to_id: toUserId, type: "deleted"}, onFind)

MessageSchema.statics.findMessages = (findOptions, onFind)->
  @find(findOptions).desc('created_at').run (err, messages)->
    usersToFind = []
    if messages
      for message in messages
        if not (message.to_id in usersToFind) then usersToFind.push message.to_id
        if not (message.from_id in usersToFind) then usersToFind.push message.from_id
      # TODO Filter private data
      User.find().where("_id").in(usersToFind).run (err, users)->
        for message in messages
          for user in users
            if "#{user._id}" is "#{message.to_id}" then message.to_user = user
            if "#{user._id}" is "#{message.from_id}" then message.from_user = user
        onFind(err, messages)
    else
      onFind(err, messages)

Message = mongoose.model("Message", MessageSchema)

exports = module.exports = Message