User = require("./user")
_    = require("underscore")

NotificationSchema = new Schema
  user_id:
    type: String
  from_id:
    type: [String]
  unread:
    type: Boolean
    default: true
  wall_id:
    type: String
  comment_id:
    type: String
  type:
    type: String
    enum: ["alert", "feed", "request"]
    default: "feed"
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

NotificationSchema.methods.saveAndTriggerNewComments = ()->
  Notification = require("./notification")
  @save (err, data)->
    if data.type is "feed"
      Notification.triggerNewWallPosts(data.user_id)
    if data.type is "alert"
      Notification.triggerNewFollowups(data.user_id)
    if data.type is "request"
      Notification.triggerNewRequests(data.user_id)

NotificationSchema.methods.getLastCommenter = ()->
  _.last(@from_id)

NotificationSchema.statics.setNotificationsSocket = (socket)->
  notificationsSocket = socket

NotificationSchema.statics.getNotificationsSocket = ()->
  notificationsSocket

NotificationSchema.statics.addForStatus = (newComment, sender)->
  Notification = require("./notification")

  commentId   = "#{newComment._id}"
  wallOwnerId = "#{newComment.wall_id}"
  senderId    = "#{sender._id}"

  User.findOne({_id: wallOwnerId}).run (err, wallOwner)->
    if wallOwnerId isnt senderId
      notificationType = if wallOwner.type is "daycare" then "feed" else "alert"
      notificationData =
        user_id: wallOwnerId
        from_id: [senderId]
        wall_id: newComment.wall_id
        comment_id: commentId
        type: notificationType
        content: "posted on your wall."
      notification = new Notification(notificationData)
      notification.saveAndTriggerNewComments(wallOwnerId)

    friendsToFind = if wallOwner.type in ["daycare", "class"] then wallOwner.friends else []
    friendsToFind = _.filter friendsToFind, (friendId)->
      friendId not in [senderId, wallOwnerId]

    if friendsToFind.length
      receiverTypes = ["parent", "daycare", "staff"]
      User.find().where("_id").in(friendsToFind).where("type").in(receiverTypes).run (err, users)->
        for usr in users
          whoseWall = wallOwner.getPronoun()
          content = if wallOwnerId is senderId then "posted on #{whoseWall} wall." else "posted on #{wallOwner.name or ""} #{wallOwner.surname or ""}'s wall."
          notificationData =
            user_id: usr._id
            from_id: [senderId]
            wall_id: newComment.wall_id
            comment_id: commentId
            type: "feed"
            content: content
            unread: true
          notification = new Notification(notificationData)
          notification.saveAndTriggerNewComments(usr._id)

NotificationSchema.statics.addForFollowup = (newComment, sender)->
  Notification = require("./notification")
  Comment      = require("./comment")

  commentId        = "#{newComment.to_id}"
  wallOwnerId      = "#{newComment.wall_id}"
  wallId           = "#{newComment.wall_id}"
  senderId         = "#{sender._id}"
  originalStatusId = "#{newComment.to_id}"

  User.findOne({_id: wallOwnerId}).run (err, wallOwner)->
    Comment.findOne({_id: originalStatusId}).run (err, originalComment)->
      statusOwnerId    = "#{originalComment.from_id}"

      User.findOne({_id: statusOwnerId}).run (err, statusOwner)->

        sentUserIds = [senderId]
        whoseStatus = statusOwner.getPronoun()
        whoseWall = wallOwner.getPronoun()

        Comment.find({type: "followup", wall_id: newComment.wall_id, to_id: originalStatusId}).run (err, comments)->

          for comment in comments
            if comment.from_id not in sentUserIds
              userId = comment.from_id
              sentUserIds.push(userId)

              Notification.addOrUpdateExistent {user_id: userId, wall_id: wallId, comment_id: commentId, type: "alert"}, senderId, ()->
                statusOwnerName = if statusOwnerId is senderId then whoseStatus else "#{statusOwner.name or ""} #{statusOwner.surname or ""}'s"
                wallOwnerName   = if wallOwnerId is senderId then whoseWall else "#{wallOwner.name or ""} #{wallOwner.surname or ""}'s"
                content = "commented on #{statusOwnerName} post on #{wallOwnerName} wall."
                notificationData =
                  user_id: userId
                  from_id: [senderId]
                  wall_id: wallId
                  comment_id: commentId
                  type: "alert"
                  content: content
                notification = new Notification(notificationData)
                notification.saveAndTriggerNewComments()

          if statusOwnerId not in sentUserIds
            sentUserIds.push(statusOwnerId)

            Notification.addOrUpdateExistent {user_id: statusOwnerId, wall_id: wallId, comment_id: commentId, type: "alert"}, senderId, ()->
              wallOwnerName   = if wallOwnerId is senderId then whoseWall else "#{wallOwner.name or ""} #{wallOwner.surname or ""}'s"
              content = "commented on your post on #{wallOwnerName} wall."
              notificationData =
                user_id: statusOwnerId
                from_id: [senderId]
                wall_id: wallId
                comment_id: commentId
                type: "alert"
                content: content
              notification = new Notification(notificationData)
              notification.saveAndTriggerNewComments()


          if wallOwnerId isnt statusOwnerId and wallOwnerId not in sentUserIds
            notificationType = if wallOwner.type in ["daycare", "class"] then "feed" else "alert"

            Notification.addOrUpdateExistent {user_id: wallOwnerId, wall_id: wallId, comment_id: commentId, type: notificationType}, senderId, ()->
              content = "commented on #{statusOwner.name} #{statusOwner.surname}'s post on your wall."
              notificationData =
                user_id: wallOwnerId
                from_id: [senderId]
                wall_id: wallId
                comment_id: commentId
                type: notificationType
                content: content
              notification = new Notification(notificationData)
              notification.saveAndTriggerNewComments()

          if wallOwner.type in ["daycare", "class"]
            friendsToFeed = _.difference(wallOwner.friends, sentUserIds)
            User.find().where("_id").in(friendsToFeed).run (err, users)->
              for usr in users
                userId = usr._id

                Notification.addOrUpdateExistent {user_id: userId, wall_id: wallId, comment_id: commentId, type: "feed"}, senderId, ()->
                  statusOwnerName = if statusOwnerId is senderId then whoseStatus else "#{statusOwner.name or ""} #{statusOwner.surname or ""}'s"
                  wallOwnerName   = if wallOwnerId is senderId then whoseWall else "#{wallOwner.name or ""} #{wallOwner.surname or ""}'s"
                  content = "commented on #{statusOwnerName} post on #{wallOwnerName} wall."
                  notificationData =
                    user_id: userId
                    from_id: [senderId]
                    wall_id: wallId
                    comment_id: commentId
                    type: "feed"
                    content: content
                  notification = new Notification(notificationData)
                  notification.saveAndTriggerNewComments()

NotificationSchema.statics.addForRequest = (receiverId, classesIds)->
  Notification   = mongoose.model("Notification")
  User.find().where("_id").in(classesIds).run (err, classes)->
    for daycareClass in classes
      notificationData =
        user_id: receiverId
        from_id: [daycareClass.master_id]
        comment_id: daycareClass._id
        type: "request"
        content: "invited you to #{daycareClass.name}."
      notification = new Notification(notificationData)
      notification.saveAndTriggerNewComments(receiverId)

NotificationSchema.statics.triggerNewMessages = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    Message = require("./message")
    Message.find({to_id: userId, type: "default", unread: true}).count (err, newMessagesTotal)->
      userSocket.emit("new-messages-total", {total: newMessagesTotal})
    Message.findLastMessages userId, 5, (err, messages)->
      messages = Notification.filterUserData(messages)
      userSocket.emit("last-messages", {messages: messages})

NotificationSchema.statics.findLastWallPosts = (userId, limit, onFind)->
  @find({user_id: userId, type: "feed"}).desc('created_at').limit(limit).run (err, posts)->
    usersToFind = []
    if posts
      for post in posts
        usersToFind.push post.getLastCommenter()
      usersToFind = _.uniq usersToFind
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for post in posts
            for user in users
              if "#{user._id}" is "#{post.getLastCommenter()}" then post.from_user = user
        onFind(err, posts)
    else
      onFind(err, posts)

NotificationSchema.statics.triggerNewWallPosts = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    @find({user_id: userId, type: "feed", unread: true}).count (err, newWallPostsTotal)->
      userSocket.emit("new-wall-posts-total", {total: newWallPostsTotal})
    @findLastWallPosts userId, 5, (err, wallPosts)->
      wallPosts = Notification.filterUserData(wallPosts)
      userSocket.emit("last-wall-posts", {wall_posts: wallPosts})

NotificationSchema.statics.findLastFollowups = (userId, limit, onFind)->
  @find({user_id: userId, type: "alert"}).desc('created_at').limit(limit).run (err, followups)->
    usersToFind = []
    if followups
      for followup in followups
        usersToFind.push followup.getLastCommenter()
      usersToFind = _.uniq usersToFind
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for followup in followups
            for user in users
              if "#{user._id}" is "#{followup.getLastCommenter()}" then followup.from_user = user
        onFind(err, followups)
    else
      onFind(err, followups)

NotificationSchema.statics.triggerNewFollowups = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    @find({user_id: userId, type: "alert", unread: true}).count (err, newFollowupsTotal)->
      userSocket.emit("new-followups-total", {total: newFollowupsTotal})
    @findLastFollowups userId, 5, (err, followups)->
      followups = Notification.filterUserData(followups)
      userSocket.emit("last-followups", {followups: followups})

NotificationSchema.statics.findLastRequests = (userId, limit, onFind)->
  @find({user_id: userId, type: "request"}).desc('created_at').limit(limit).run (err, requests)->
    usersToFind = []
    if requests
      for request in requests
        usersToFind.push request.getLastCommenter()
      usersToFind = _.uniq usersToFind
      User.find().where("_id").in(usersToFind).run (err, users)->
        if users
          for request in requests
            for user in users
              if "#{user._id}" is "#{request.getLastCommenter()}" then request.from_user = user
        onFind(err, requests)
    else
      onFind(err, requests)

NotificationSchema.statics.triggerNewRequests = (userId)->
  sessionId = notificationsSocket.userSessions[userId]
  userSocket = notificationsSocket.socket(sessionId)
  if userSocket
    @find({user_id: userId, type: "request", unread: true}).count (err, newRequestsTotal)->
      userSocket.emit("new-requests-total", {total: newRequestsTotal})
    @findLastRequests userId, 5, (err, requests)->
      requests = Notification.filterUserData(requests)
      userSocket.emit("last-requests", {requests: requests})

NotificationSchema.statics.addOrUpdateExistent = (query, senderId, onCreate)->
  Notification.findOne(query).run (err, notification)->
    if notification
      notification.from_id.push(senderId)
      notification.unread = true
      notification.saveAndTriggerNewComments()
    else
      onCreate()

NotificationSchema.statics.filterUserData = (models)->
  allowedProps = ["_id", "id", "type", "gender", "name", "surname", "picture_sets"]
  for model in models
    if model.from_user
      fromUser = model.from_user.toJSON()
      for key, val of fromUser
        if not (key in allowedProps)
          delete fromUser[key]
      fromUser.picture_sets = _.filter fromUser.picture_sets, (pictureSet)->
        pictureSet.type is "profile"
    model.from_user = fromUser
  models

Notification = mongoose.model("Notification", NotificationSchema)

exports = module.exports = Notification