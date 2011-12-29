Notification = require('../models/notification')

module.exports = (app)->

  app.put '/notifications/wall-posts', (req, res)->
    user = if req.user then req.user else {}
    Notification.update {user_id: user._id, type: "status", unread: true}, {unread: false}, {multi: true}, (err, notifications)->
      Notification.triggerNewWallPosts(user._id)
    
    res.json {success: true}
  
  app.put '/notifications/followups', (req, res)->
    user = if req.user then req.user else {}
    Notification.update {user_id: user._id, type: "followup", unread: true}, {unread: false}, {multi: true}, (err, notifications)->
      Notification.triggerNewFollowups(user._id)
    
    res.json {success: true}