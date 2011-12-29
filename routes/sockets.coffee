User         = require('../models/user')
Comment      = require('../models/comment')
Message      = require('../models/message')
Notification = require('../models/notification')
io           = require('socket.io')

module.exports = (app)->

  sio = io.listen(app)

  userNotifications = sio.of("/user-notifications").on "connection", (socket)->
    userNotifications.userSessions or= {}

    socket.on "get-new-messages-total", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Message.find({to_id: userId, type: "default", unread: true}).count (err, newMessagesTotal)->
        userSocket.emit("new-messages-total", {total: newMessagesTotal})
    socket.on "get-last-messages", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Message.findLastMessages userId, 5, (err, messages)->
        userSocket.emit("last-messages", {messages: messages})
    
    socket.on "get-new-wall-posts-total", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.find({user_id: userId, type: "status", unread: true}).count (err, wallPostsTotal)->
        userSocket.emit("new-wall-posts-total", {total: wallPostsTotal})
    socket.on "get-last-wall-posts", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.findLastWallPosts userId, 5, (err, wallPosts)->
        userSocket.emit("last-wall-posts", {wall_posts: wallPosts})

    socket.on "get-new-followups-total", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.find({user_id: userId, type: "followup", unread: true}).count (err, followupsTotal)->
        userSocket.emit("new-followups-total", {total: followupsTotal})
    socket.on "get-last-followups", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.findLastFollowups userId, 5, (err, followups)->
        userSocket.emit("last-followups", {followups: followups})


    socket.on "disconnect", ()->
      # socket.disconnect()

  Notification.setNotificationsSocket(userNotifications)

  dayCareWallComments = sio.of("/day-cares-wall-comments").on "connection", (socket)->
    socket.on "get-new-comments", (data)->
      # TODO Move this to the model and filter data we send on frontend about the user
      Comment.find({wall_id: data.wall_id}).desc("type").asc("updated_at").run (err, comments)->
        if comments
          usersToFind = []
          for comment in comments
            usersToFind.push(comment.from_id)
          if usersToFind.length
            User.where("_id").in(usersToFind).run (err, users)->
              if users
                for comment in comments
                  for user in users
                    # TODO Filter public data
                    if "#{user._id}" is "#{comment.from_id}"
                      comment.from_user = user
              socket.emit("new-wall-comments", {comments: comments})
    socket.on "disconnect", ()->
      # socket.disconnect()
  
  Comment.setDaycareWallSocket(dayCareWallComments)
