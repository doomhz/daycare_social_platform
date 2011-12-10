User    = require('../models/user')
Message = require('../models/message')

module.exports = (app)->

  app.post '/messages', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    data.from_id = user._id
    delete data.created_at
    delete data.updated_at
    message = new Message(data)
    message.save()
    
    res.json {success: true}
