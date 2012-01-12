User = require("./user")

NotificationSchema = new Schema
  user_id:
    type: String
  from_id:
    type: String
  unread:
    type: Boolean
    default: true
  wall_id:
    type: String
  type:
    type: String
    enum: ["followup", "status"]
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
  from_user:
    type: {}

notificationsSocket = null

NotificationSchema.statics.setNotificationsSocket = (socket)->
  notificationsSocket = socket

NotificationSchema.statics.getNotificationsSocket = ()->
  notificationsSocket

NotificationSchema.methods.saveAndTriggerNewComments = ()->
  Notification = require("./notification")
  @save (err, data)->
    if data.type is "status"
      Notification.triggerNewWallPosts(data.user_id)
    if data.type is "followup"
      Notification.triggerNewFollowups(data.user_id)

NotificationSchema.statics.addForStatus = (newComment, sender)->
  Notification = require("./notification")

  wallOwnerId = "#{newComment.wall_id}"
  senderId    = "#{sender._id}"

  User.findOne({_id: wallOwnerId}).run (err, wallOwner)->
    if wallOwnerId isnt senderId
      notificationData =
        user_id: wallOwnerId
        from_id: senderId
        wall_id: newComment.wall_id
        type: "followup"
        content: "posted on your wall."
      notification = new Notification(notificationData)
      notification.saveAndTriggerNewComments(wallOwnerId)

    User.find().run (err, users)->
      for usr in users
        content = if wallOwnerId is senderId then "posted on his wall." else "posted on #{wallOwner.name} #{wallOwner.surname}'s wall."
        unread  = if senderId is "#{usr._id}" then false else true
        notificationData =
          user_id: usr._id
          from_id: senderId
          wall_id: newComment.wall_id
          type: "status"
          content: content
          unread: unread
        notification = new Notification(notificationData)
        notification.saveAndTriggerNewComments(usr._id)

NotificationSchema.statics.addForFollowup = (newComment, sender)->
  Notification = require("./notification")
  Comment      = require("./comment")

  wallOwnerId      = "#{newComment.wall_id}"
  senderId         = "#{sender._id}"
  originalStatusId = "#{newComment.to_id}"

  User.findOne({_id: wallOwnerId}).run (err, wallOwner)->
    Comment.findOne({_id: originalStatusId}).run (err, originalComment)->
      statusOwnerId    = "#{originalComment.from_id}"

      User.findOne({_id: statusOwnerId}).run (err, statusOwner)->
        if statusOwnerId isnt senderId
          content = if wallOwnerId is statusOwnerId then "commented on your post on your wall." else "commented on your post on #{wallOwner.name} #{wallOwner.surname}'s wall."
          notificationData =
            user_id: statusOwnerId
            from_id: senderId
            wall_id: newComment.wall_id
            type: "followup"
            content: content
          notification = new Notification(notificationData)
          notification.saveAndTriggerNewComments(statusOwnerId)

        if wallOwnerId isnt senderId and wallOwnerId isnt statusOwnerId
          content = "commented on #{statusOwner.name} #{statusOwner.surname}'s post on your wall."
          notificationData =
            user_id: wallOwnerId
            from_id: senderId
            wall_id: newComment.wall_id
            type: "followup"
            content: content
          notification = new Notification(notificationData)
          notification.saveAndTriggerNewComments(wallOwnerId)

        Comment.find([{type: "followup", wall_id: newComment.wall_id, to_id: statusOwnerId}]).where("from_id").nin([senderId, wallOwnerId, statusOwnerId]).run (err, comments)->
          sentUserIds = []
          for comment in comments
            if comment.from_id not in sentUserIds
              content = "commented on #{statusOwner.name} #{statusOwner.surname}'s post on #{wallOwner.name} #{wallOwner.surname}'s wall."
              notificationData =
                user_id: comment.from_id
                from_id: sender._id
                wall_id: newComment.wall_id
                type: "followup"
                content: content
              notification = new Notification(notificationData)
              notification.saveAndTriggerNewComments(comment.from_id)
              sentUserIds.push(comment.from_id)

        User.find().run (err, users)->
          for usr in users
            statusOwnerName = if statusOwnerId is senderId then "his" else "#{statusOwner.name} #{statusOwner.surname}'s"
            wallOwnerName   = if wallOwnerId is senderId then "his" else "#{wallOwner.name} #{wallOwner.surname}'s"
            content = "commented on #{statusOwnerName} post on #{wallOwnerName} wall."
            unread  = if senderId is "#{usr._id}" then false else true
            notificationData =
              user_id: usr._id
              from_id: senderId
              wall_id: newComment.wall_id
              type: "status"
              content: content
              unread: unread
            notification = new Notification(notificationData)
            notification.saveAndTriggerNewComments(usr._id)

NotificationSchema.statics.triggerNewMessages = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    Message = require("./message")
    Message.find({to_id: userId, type: "default", unread: true}).count (err, newMessagesTotal)->
      userSocket.emit("new-messages-total", {total: newMessagesTotal})
    Message.findLastMessages userId, 5, (err, messages)->
      userSocket.emit("last-messages", {messages: messages})

NotificationSchema.statics.findLastWallPosts = (userId, limit, onFind)->
  @find({user_id: userId, type: "status"}).desc('created_at').limit(limit).run (err, posts)->
    usersToFind = []
    if posts
      for post in posts
        if not (post.from_id in usersToFind) then usersToFind.push post.from_id
      # TODO Filter private data
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for post in posts
            for user in users
              if "#{user._id}" is "#{post.from_id}" then post.from_user = user
        onFind(err, posts)
    else
      onFind(err, posts)

NotificationSchema.statics.triggerNewWallPosts = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    @find({user_id: userId, type: "status", unread: true}).count (err, newWallPostsTotal)->
      userSocket.emit("new-wall-posts-total", {total: newWallPostsTotal})
    @findLastWallPosts userId, 5, (err, wallPosts)->
      userSocket.emit("last-wall-posts", {wall_posts: wallPosts})

NotificationSchema.statics.findLastFollowups = (userId, limit, onFind)->
  @find({user_id: userId, type: "followup"}).desc('created_at').limit(limit).run (err, followups)->
    usersToFind = []
    if followups
      for followup in followups
        if not (followup.from_id in usersToFind) then usersToFind.push followup.from_id
      # TODO Filter private data
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for followup in followups
            for user in users
              if "#{user._id}" is "#{followup.from_id}" then followup.from_user = user
        onFind(err, followups)
    else
      onFind(err, followups)

NotificationSchema.statics.triggerNewFollowups = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    @find({user_id: userId, type: "followup", unread: true}).count (err, newFollowupsTotal)->
      userSocket.emit("new-followups-total", {total: newFollowupsTotal})
    @findLastFollowups userId, 5, (err, followups)->
      userSocket.emit("last-followups", {followups: followups})

exports = module.exports = mongoose.model("Notification", NotificationSchema)