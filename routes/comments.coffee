User         = require('../models/user')
Comment      = require('../models/comment')
Notification = require('../models/notification')
_s           = require('underscore.string')

module.exports = (app)->

  app.get '/comments/:id', (req, res)->
    currentUser = if req.user then req.user else {}
    commentId   = req.params.id
    Comment.findOne({_id: commentId}).run (err, status)->
      User.findOne({_id: status.from_id}).run (err, user)->
        if user
          status.from_user = user
        res.render 'comments/comments', {comments: [status], _s: _s, show_private: false, layout: false}

  app.get '/comment/:id', (req, res)->
    currentUser = if req.user then req.user else {}
    commentId   = req.params.id
    Comment.findOne({_id: commentId}).run (err, status)->
      User.findOne({_id: status.from_id}).run (err, user)->
        if user
          status.from_user = user
        res.render 'comments/_comment', {comment: status, _s: _s, show_private: false, layout: false}

  app.get '/followups/:comment_id/:last_comment_time/:timeline', (req, res)->
    currentUser = if req.user then req.user else {}
    commentId   = req.params.comment_id
    lastCommentTime = req.params.last_comment_time
    timeline = if req.params.timeline in ["future", "past"] then req.params.timeline else "future"
    comparison = if req.params.timeline is "future" then "gt" else "lt"
    followupsLimit = req.query.limit or 2

    Comment.find({to_id: commentId, type: "followup"})
    .where('added_at')[comparison](lastCommentTime).limit(followupsLimit)
    .desc("added_at").run (err, followups = [])->

      if followups.length
        usersToFind = []
        for followup in followups
          usersToFind.push(followup.from_id)
          followup.timeline = timeline
        User.where("_id").in(usersToFind).run (err, users)->
          if users
            for followup in followups
              for user in users
                if "#{user._id}" is "#{followup.from_id}"
                  followup.from_user = user
          res.render 'comments/comments', {comments: followups, _s: _s, show_private: false, layout: false}
      else
        res.render 'comments/comments', {comments: followups, _s: _s, show_private: false, layout: false}

  app.get '/comments/:wall_id/:last_comment_time/:timeline', (req, res)->
    currentUser = if req.user then req.user else {}
    currentUserId = "#{currentUser._id}"
    wallId = "#{req.params.wall_id}"
    lastCommentTime = req.params.last_comment_time
    timeline = if req.params.timeline in ["future", "past"] then req.params.timeline else "future"
    comparison = if req.params.timeline is "future" then "gt" else "lt"
    privacy = ["public"]
    if wallId is currentUserId or wallId in currentUser.friends
      privacy.push("private")
    commentsLimit = req.query.limit or 10

    Comment.find({wall_id: wallId, type: "status"})
    .where('added_at')[comparison](lastCommentTime)
    .where("privacy").in(privacy)
    .desc("added_at").limit(commentsLimit).run (err, comments = [])->
      usersToFind = []
      for comment in comments
        usersToFind.push(comment.from_id)
        comment.timeline = timeline

      User.where("_id").in(usersToFind).run (err, users)->
        if users
          for comment in comments
            for user in users
              if "#{user._id}" is "#{comment.from_id}"
                comment.from_user = user

        res.render 'comments/comments', {comments: comments, _s: _s, show_private: false, layout: false}

  app.post '/comment', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    data.from_id = currentUser._id
    data.added_at = new Date().getTime()

    currentUserId = "#{currentUser._id}"
    wallId = "#{data.wall_id}"

    if wallId is currentUserId or wallId in currentUser.friends or (data.type is "followup" and data.privacy is "public")
      currentComment = new Comment(data)
      currentComment.save (err, savedComment)->

        if data.type is "status"
          Notification.addForStatus(savedComment, currentUser)

        if data.type is "followup"
          Notification.addForFollowup(savedComment, currentUser)

      res.json {success: true}

  app.put "/comment/:id", (req, res)->
    currentUser = if req.user then req.user else {}
    commentId = req.params.id
    data = req.body
    delete data._id

    Comment.update {_id: commentId, from_id: currentUser._id}, data, {}, (err, comment)->
      res.json {success: true}

  app.del "/comment/:id", (req, res)->
    currentUser = if req.user then req.user else {}
    commentId = req.params.id

    Comment.findOne({_id: commentId}).run (err, comment)->
      if "#{comment.from_id}" is "#{currentUser._id}"
        comment.remove ()->
          res.json {success: true}
      else
        res.json {error: "Comment could not be deleted"}