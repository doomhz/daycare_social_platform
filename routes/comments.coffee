User         = require('../models/user')
Comment      = require('../models/comment')
Notification = require('../models/notification')

module.exports = (app)->

  app.post '/comments', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    data.from_id = user._id
    delete data.created_at
    delete data.updated_at
    
    comment = new Comment(data)
    comment.save (err)->
      comment.postOnWall()
    
      userName = if user.type is "daycare" then user.daycare_name else "#{user.name} #{user.surname}"
    
      if data.type is "status"
        User.find().run (err, users)->
          for usr in users
            if "#{usr._id}" isnt "#{user._id}"
              notificationData =
                user_id: usr._id
                wall_id: data.wall_id
                type: "status"
                content: "#{userName} wrote on wall."
              notification = new Notification(notificationData)
              notification.save ()->
                Notification.triggerNewWallPosts(usr._id)

      if data.type is "followup"
        Comment.find([{type: "followup", wall_id: data.wall_id, to_id: data.to_id}, {type: "status", wall_id: data.wall_id}]).run (err, comments)->
          sentUserIds = []
          for comment in comments
            if "#{comment.from_id}" isnt "#{user._id}" and comment.from_id not in sentUserIds
              notificationData =
                user_id: comment.from_id
                wall_id: data.wall_id
                type: "followup"
                content: "#{userName} commented on a post."
              notification = new Notification(notificationData)
              notification.save ()->
                Notification.triggerNewFollowups(comment.from_id)
              sentUserIds.push(comment.from_id)
    
    res.json {success: true}
