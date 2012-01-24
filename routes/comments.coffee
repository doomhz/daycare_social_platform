User         = require('../models/user')
Comment      = require('../models/comment')
Notification = require('../models/notification')

module.exports = (app)->

  app.get '/comments/:wall_id/:last_comment_time/:timeline', (req, res)->
    currentUser = if req.user then req.user else {}
    currentUserId = "#{currentUser._id}"
    wallId = "#{req.params.wall_id}"
    lastCommentTime = req.params.last_comment_time
    timeline = if req.params.timeline in ["future", "past"] then req.params.timeline else "future"
    comparison = if req.params.timeline is "future" then "gt" else "lt"

    if wallId is currentUserId or wallId in currentUser.friends
      Comment.find({wall_id: wallId, type: "status"}).where('added_at')[comparison](lastCommentTime).desc("added_at").limit(5).run (err, statuses)->
        statusIds = []
        for status in statuses
          statusIds.push(status._id)

        followupsQuery = Comment.find({wall_id: wallId, type: "followup"}).desc("added_at")

        if timeline is "past"
          followupsQuery.where("to_id").in(statusIds)
        else
          followupsQuery.where('added_at')[comparison](lastCommentTime)

        followupsQuery.run (err, followups)->
          usersToFind = []
          comments = statuses.concat(followups)
          for comment in comments
            usersToFind.push(comment.from_id)
            comment.timeline = timeline
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

    currentUserId = "#{currentUser._id}"
    wallId = "#{data.wall_id}"

    if wallId is currentUserId or wallId in currentUser.friends
      currentComment = new Comment(data)
      currentComment.save (err, savedComment)->

        if data.type is "status"
          Notification.addForStatus(savedComment, currentUser)

        if data.type is "followup"
          Notification.addForFollowup(savedComment, currentUser)

      res.json {success: true}
