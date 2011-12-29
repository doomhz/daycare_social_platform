NotificationSchema = new Schema

notificationsSocket = null

NotificationSchema.statics.setNotificationsSocket = (socket)->
  notificationsSocket = socket

NotificationSchema.statics.getNotificationsSocket = ()->
  notificationsSocket

NotificationSchema.statics.triggerNewMessages = (userId)->
  Message = require("./message")
  Message.find({to_id: userId, type: "default", unread: true}).count (err, newMessagesTotal)->
    notificationsSocket.emit("new-messages-total", {total: newMessagesTotal})
  Message.findLastMessages userId, 5, (err, messages)->
    notificationsSocket.emit("last-messages", {messages: messages})

exports = module.exports = mongoose.model("Notification", NotificationSchema)