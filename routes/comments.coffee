User         = require('../models/user')
Comment      = require('../models/comment')
Notification = require('../models/notification')

module.exports = (app)->

  app.get '/comments/:wall_id/:last_query_time', (req, res)->
    wallId = req.params.wall_id
    lastQueryTime = req.params.last_query_time

    Comment.find({wall_id: wallId}).where('added_at').gt(lastQueryTime).desc("type").asc("added_at").run (err, comments)->
      if comments
        usersToFind = []
        for comment in comments
          usersToFind.push(comment.from_id)
        if usersToFind.length
          User.where("_id").in(usersToFind).run (err, users)->
            if users
              for comment in comments
                for user in users
                  if "#{user._id}" is "#{comment.from_id}"
                    comment.from_user = user
            res.render 'comments/comments', {comments: comments, show_private: false, layout: false}
        else
          res.render 'comments/comments', {comments: comments, show_private: false, layout: false}
      else
        res.json []

  app.post '/comments', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    data.from_id = currentUser._id
    data.added_at = new Date().getTime()

    currentComment = new Comment(data)
    currentComment.save (err, savedComment)->

      if data.type is "status"
        Notification.addForStatus(savedComment, currentUser)

      if data.type is "followup"
        Notification.addForFollowup(savedComment, currentUser)

      res.json {success: true}
