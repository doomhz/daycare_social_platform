User    = require('../models/user')
Message = require('../models/message')
io      = require('socket.io')

module.exports = (app)->

  sio = io.listen(app)
  userNotifications = sio.of("/user-notifications").on "connection", (socket)->
    socket.on "get-new-messages-total", (data)->
      socket.emit("new-messages-total", {total: 3})
    socket.on "disconnect", ()->
      # socket.disconnect()
