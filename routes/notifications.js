(function() {
  var Message, User, io;
  User = require('../models/user');
  Message = require('../models/message');
  io = require('socket.io');
  module.exports = function(app) {
    var sio, userNotifications;
    sio = io.listen(app);
    return userNotifications = sio.of("/user-notifications").on("connection", function(socket) {
      socket.on("get-new-messages-total", function(data) {
        return socket.emit("new-messages-total", {
          total: 3
        });
      });
      return socket.on("disconnect", function() {});
    });
  };
}).call(this);
