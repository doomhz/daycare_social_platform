User    = require('../models/user')
Comment = require('../models/comment')

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
