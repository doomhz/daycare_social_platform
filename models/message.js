(function() {
  var Message, MessageSchema, User, exports, mongooseAuth;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  mongooseAuth = require('mongoose-auth');
  User = require("./user");
  MessageSchema = new Schema({
    from_id: {
      type: String
    },
    to_id: {
      type: String
    },
    type: {
      type: String,
      "enum": ["default", "draft", "sent", "deleted"],
      "default": "default"
    },
    content: {
      "default": ""
    },
    unread: {
      type: Boolean,
      "default": false
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    updated_at: {
      type: Date,
      "default": Date.now
    },
    from_user: {
      type: {}
    },
    to_user: {
      type: {}
    }
  });
  MessageSchema.statics.send = function(userId, data) {
    var message;
    data.from_id = userId;
    delete data.to_user;
    delete data.from_user;
    delete data.created_at;
    delete data.updated_at;
    message = new this(data);
    message.type = "default";
    message.unread = true;
    message.save(function() {
      var Notification;
      Notification = require("./notification");
      return Notification.triggerNewMessages(data.to_id);
    });
    message = new this(data);
    message.type = "sent";
    return message.save();
  };
  MessageSchema.statics.saveDraft = function(userId, data) {
    var message;
    data.from_id = userId;
    delete data.to_user;
    delete data.to_id;
    delete data.from_user;
    delete data.created_at;
    delete data.updated_at;
    message = new this(data);
    message.type = "draft";
    return message.save();
  };
  MessageSchema.statics.findDefault = function(toUserId, onFind) {
    return this.findMessages({
      to_id: toUserId,
      type: "default"
    }, onFind);
  };
  MessageSchema.statics.findSent = function(fromUserId, onFind) {
    return this.findMessages({
      from_id: fromUserId,
      type: "sent"
    }, onFind);
  };
  MessageSchema.statics.findDraft = function(fromUserId, onFind) {
    return this.findMessages({
      from_id: fromUserId,
      type: "draft"
    }, onFind);
  };
  MessageSchema.statics.findDeleted = function(toUserId, onFind) {
    return this.findMessages({
      to_id: toUserId,
      type: "deleted"
    }, onFind);
  };
  MessageSchema.statics.findLastMessages = function(toUserId, limit, onFind) {
    return this.findMessages({
      to_id: toUserId,
      type: "default"
    }, onFind, limit);
  };
  MessageSchema.statics.findMessages = function(findOptions, onFind, limit) {
    if (limit == null) {
      limit = false;
    }
    return this.find(findOptions).desc('created_at').limit(limit).run(function(err, messages) {
      var message, usersToFind, _i, _len, _ref, _ref2;
      usersToFind = [];
      if (messages) {
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          message = messages[_i];
          if (!(_ref = message.to_id, __indexOf.call(usersToFind, _ref) >= 0)) {
            usersToFind.push(message.to_id);
          }
          if (!(_ref2 = message.from_id, __indexOf.call(usersToFind, _ref2) >= 0)) {
            usersToFind.push(message.from_id);
          }
        }
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var message, user, _j, _k, _len2, _len3;
          if (users) {
            for (_j = 0, _len2 = messages.length; _j < _len2; _j++) {
              message = messages[_j];
              for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                user = users[_k];
                if (("" + user._id) === ("" + message.to_id)) {
                  message.to_user = user;
                }
                if (("" + user._id) === ("" + message.from_id)) {
                  message.from_user = user;
                }
              }
            }
          }
          return onFind(err, messages);
        });
      } else {
        return onFind(err, messages);
      }
    });
  };
  Message = mongoose.model("Message", MessageSchema);
  exports = module.exports = Message;
}).call(this);
