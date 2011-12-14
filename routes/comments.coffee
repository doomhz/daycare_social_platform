User    = require('../models/user')
Comment = require('../models/comment')
io      = require('socket.io')

module.exports = (app)->

  app.post '/comments', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    data.from_id = user._id
    delete data.created_at
    delete data.updated_at
    comment = new Comment(data)
    comment.save()
    comment.postOnWall()
    
    res.json {success: true}

  
  sio = io.listen(app)
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
                    if "#{user._id}" is "#{comment.from_id}"
                      comment.from_user = user
              socket.emit("new-wall-comments", {comments: comments})
    socket.on "disconnect", ()->
      # socket.disconnect()
  
  Comment.setDaycareWallSocket(dayCareWallComments)