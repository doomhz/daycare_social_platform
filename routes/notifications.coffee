Notification = require('../models/notification')
_            = require('underscore')

module.exports = (app)->

  app.put '/notifications/feeds', (req, res)->
    user = if req.user then req.user else {}
    Notification.update {user_id: user._id, type: "feed", unread: true}, {unread: false}, {multi: true}, (err, notifications)->
      Notification.triggerNewWallPosts(user._id)

    res.json {success: true}

  app.put '/notifications/alerts', (req, res)->
    user = if req.user then req.user else {}
    Notification.update {user_id: user._id, type: "alert", unread: true}, {unread: false}, {multi: true}, (err, notifications)->
      Notification.triggerNewFollowups(user._id)

    res.json {success: true}

  app.put '/notifications/requests', (req, res)->
    user = if req.user then req.user else {}
    Notification.update {user_id: user._id, type: "request", unread: true}, {unread: false}, {multi: true}, (err, notifications)->
      Notification.triggerNewRequests(user._id)

    res.json {success: true}

  app.get '/notifications/:type/:max_time', (req, res)->
    currentUser = if req.user then req.user else {}
    type = req.params.type
    maxTime = req.params.max_time
    Notification.find({user_id: currentUser._id, type: type}).where("created_at").lte(maxTime).limit(10).desc("created_at").run (err, notifications = [])->
      usersToFind = []
      for notification in notifications
        usersToFind.push(notification.getLastCommenter())
      usersToFind = _.uniq(usersToFind)
      User.find().where("_id").in(usersToFind).run (err, users = [])->
        for notification in notifications
          for user in users
            if "#{user._id}" is "#{notification.getLastCommenter()}"
              notification.from_user = user

        res.render 'notifications/notifications', {notifications: notifications, show_private: true, layout: false}
