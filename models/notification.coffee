NotificationSchema = new Schema
  user_id:
    type: String
  unread:
    type: Boolean
    default: true
  wall_id:
    type: String
  type:
    type: String
    enum: ["status", "followup"]
    default: "status"
  content:
    type: {}
    default: ""
  created_at:
    type: Date
    default: Date.now
  updated_at:
    type: Date
    default: Date.now

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

NotificationSchema.statics.findLastWallPosts = (userId, limit, onFind)->
  @find({user_id: userId, type: "status"}).desc('created_at').limit(limit).run onFind

NotificationSchema.statics.triggerNewWallPosts = (userId)->
  @find({user_id: userId, type: "status", unread: true}).count (err, newWallPostsTotal)->
    notificationsSocket.emit("new-wall-posts-total", {total: newWallPostsTotal})
  @findLastWallPosts userId, 5, (err, wallPosts)->
    notificationsSocket.emit("last-wall-posts", {wall_posts: wallPosts})

NotificationSchema.statics.findLastFollowups = (userId, limit, onFind)->
  @find({user_id: userId, type: "followup"}).desc('created_at').limit(limit).run onFind

NotificationSchema.statics.triggerNewFollowups = (userId)->
  @find({user_id: userId, type: "followup", unread: true}).count (err, newFollowupsTotal)->
    notificationsSocket.emit("new-followups-total", {total: newFollowupsTotal})
  @findLastFollowups userId, 5, (err, followups)->
    notificationsSocket.emit("last-followups", {followups: followups})

exports = module.exports = mongoose.model("Notification", NotificationSchema)