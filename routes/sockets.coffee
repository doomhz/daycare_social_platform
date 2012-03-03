User         = require('../models/user')
Comment      = require('../models/comment')
Message      = require('../models/message')
Notification = require('../models/notification')
io           = require('socket.io')

module.exports = (app)->

  sioOptions =
    log: if process.env.NODE_ENV is "production" then false else true

  sio = io.listen(app, sioOptions)

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
      Notification.find({user_id: userId, type: "feed", unread: true}).count (err, wallPostsTotal)->
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
      Notification.find({user_id: userId, type: "alert", unread: true}).count (err, followupsTotal)->
        userSocket.emit("new-followups-total", {total: followupsTotal})
    socket.on "get-last-followups", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.findLastFollowups userId, 5, (err, followups)->
        userSocket.emit("last-followups", {followups: followups})

    socket.on "get-new-requests-total", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.find({user_id: userId, type: "request", unread: true}).count (err, requestsTotal)->
        userSocket.emit("new-requests-total", {total: requestsTotal})
    socket.on "get-last-requests", (data)->
      userId = data.user_id
      sessionId = data.session_id
      userSocket = userNotifications.socket(sessionId)
      userNotifications.userSessions[userId] = sessionId
      Notification.findLastRequests userId, 5, (err, requests)->
        userSocket.emit("last-requests", {requests: requests})


    socket.on "disconnect", ()->
      # socket.disconnect()

  Notification.setNotificationsSocket(userNotifications)
