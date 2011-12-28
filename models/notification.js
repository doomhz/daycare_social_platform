(function() {
  var Message, NotificationSchema, exports, notificationsSocket;
  Message = require("./message");
  NotificationSchema = new Schema;
  notificationsSocket = null;
  NotificationSchema.statics.setNotificationsSocket = function(socket) {
    return notificationsSocket = socket;
  };
  NotificationSchema.statics.getNotificationsSocket = function() {
    return notificationsSocket;
  };
  NotificationSchema.statics.triggerNewMessages = function(userId) {
    Message.find({
      to_id: userId,
      type: "default",
      unread: true
    }).count(function(err, newMessagesTotal) {
      return notificationsSocket.emit("new-messages-total", {
        total: newMessagesTotal
      });
    });
    return Message.findLastMessages(userId, 5, function(err, messages) {
      return notificationsSocket.emit("last-messages", {
        messages: messages
      });
    });
  };
  exports = module.exports = mongoose.model("Notification", NotificationSchema);
}).call(this);
