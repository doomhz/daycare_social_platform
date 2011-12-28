(function() {
  var Message, Notification, User;
  User = require('../models/user');
  Message = require('../models/message');
  Notification = require('../models/notification');
  module.exports = function(app) {
    app.post('/messages', function(req, res) {
      var data, id, messageData, to_id, user, _i, _len;
      user = req.user ? req.user : {};
      data = req.body;
      to_id = data.to_id;
      if (data.type === "draft") {
        Message.saveDraft(user._id, data);
      } else {
        if (typeof to_id !== "string") {
          for (_i = 0, _len = to_id.length; _i < _len; _i++) {
            id = to_id[_i];
            messageData = data;
            messageData.to_id = id;
            Message.send(user._id, messageData);
          }
        } else {
          Message.send(user._id, data);
        }
      }
      Notification.triggerNewMessages(user._id);
      return res.json({
        success: true
      });
    });
    app.del('/messages/:id', function(req, res) {
      var messageId, user;
      messageId = req.params.id;
      user = req.user ? req.user : {};
      Message.findOne({
        _id: messageId,
        to_id: user._id
      }).run(function(err, message) {
        if (message) {
          message.type = "deleted";
          message.save();
        }
        return Notification.triggerNewMessages(user._id);
      });
      return res.json({
        success: true
      });
    });
    app.put('/messages/:id', function(req, res) {
      var data, messageId, user;
      messageId = req.params.id;
      user = req.user ? req.user : {};
      data = req.body;
      delete data._id;
      delete data.updated_at;
      return Message.update({
        _id: messageId,
        to_id: user._id
      }, data, {}, function(err, message) {
        Notification.triggerNewMessages(user._id);
        return res.json({
          success: true
        });
      });
    });
    app.get('/messages/default', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.findDefault(user._id, function(err, messages) {
        return res.json(messages);
      });
    });
    app.get('/messages/sent', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.findSent(user._id, function(err, messages) {
        return res.json(messages);
      });
    });
    app.get('/messages/draft', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.findDraft(user._id, function(err, messages) {
        return res.json(messages);
      });
    });
    app.get('/messages/deleted', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.findDeleted(user._id, function(err, messages) {
        return res.json(messages);
      });
    });
    return app.get('/messages/:id', function(req, res) {
      var messageId, user;
      messageId = req.params.id;
      user = req.user ? req.user : {};
      return Message.findOne({
        _id: messageId
      }).run(function(err, message) {
        return res.json(message);
      });
    });
  };
}).call(this);
