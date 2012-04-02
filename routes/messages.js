(function() {
  var Message, Notification, User, _s;

  User = require('../models/user');

  Message = require('../models/message');

  Notification = require('../models/notification');

  _s = require("underscore.string");

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
    app.get('/messages', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.findConversations(user._id, function(err, messages) {
        return res.render('messages/messages', {
          messages: messages,
          _s: _s,
          show_private: false,
          layout: false
        });
      });
    });
    app.get('/messages/from/:id', function(req, res) {
      var fromId, user;
      user = req.user ? req.user : {};
      fromId = req.params.id;
      return Message.findMessagesFromUser(user._id, fromId, function(err, messages) {
        return res.render('messages/messages', {
          messages: messages,
          _s: _s,
          show_private: false,
          layout: false
        });
      });
    });
    return app.get('/messages/:id', function(req, res) {
      var messageId, user;
      messageId = req.params.id;
      user = req.user ? req.user : {};
      return Message.findOne({
        _id: messageId
      }).run(function(err, message) {
        return res.render('messages/_message', {
          message: message,
          _s: _s,
          show_private: false,
          layout: false
        });
      });
    });
  };

}).call(this);
