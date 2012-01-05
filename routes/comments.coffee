User         = require('../models/user')
Comment      = require('../models/comment')
Notification = require('../models/notification')

module.exports = (app)->

  app.get '/comments/:wall_id/:last_query_time', (req, res)->
    wallId = req.params.wall_id
    lastQueryTime = req.params.last_query_time

    Comment.find({wall_id: wallId}).where('created_at').gt(lastQueryTime).desc("type").asc("updated_at").run (err, comments)->
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
            res.json comments
        else
          res.json comments
      else
        res.json []

  app.post '/comments', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    data.from_id = user._id
    delete data.created_at
    delete data.updated_at
    
    comment = new Comment(data)
    comment.save (err)->
    
      userName = if user.type is "daycare" then user.daycare_name else "#{user.name} #{user.surname}"
      triggerNewWallPosts = (userId, notif)->
        notif.save ()->
          Notification.triggerNewWallPosts(userId)
      triggerNewFollowups = (userId, notif)->
        notif.save ()->
          Notification.triggerNewFollowups(userId)
    
      if data.type is "status"
        User.find().run (err, users)->
          for usr in users
            if "#{usr._id}" isnt "#{user._id}"
              notificationData =
                user_id: usr._id
                from_id: user._id
                wall_id: data.wall_id
                type: "status"
                content: "#{userName} wrote on wall."
              notification = new Notification(notificationData)
              triggerNewWallPosts(usr._id, notification)

      if data.type is "followup"
        Comment.find([{type: "followup", wall_id: data.wall_id, to_id: data.to_id}, {type: "status", wall_id: data.wall_id}]).run (err, comments)->
          sentUserIds = []
          for comment in comments
            if "#{comment.from_id}" isnt "#{user._id}" and comment.from_id not in sentUserIds
              notificationData =
                user_id: comment.from_id
                from_id: user._id
                wall_id: data.wall_id
                type: "followup"
                content: "#{userName} commented on a post."
              notification = new Notification(notificationData)
              triggerNewFollowups(comment.from_id, notification)
              sentUserIds.push(comment.from_id)
    
      res.json {success: true}
