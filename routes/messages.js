(function() {
  var Message, User;
  User = require('../models/user');
  Message = require('../models/message');
  module.exports = function(app) {
    app.post('/messages', function(req, res) {
      var data, message, user;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.from_user;
      delete data.created_at;
      delete data.updated_at;
      message = new Message(data);
      message.type = "default";
      message.save();
      message = new Message(data);
      message.type = "sent";
      message.save();
      return res.json({
        success: true
      });
    });
    app.get('/messages/default', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.find({
        to_id: user._id,
        type: "default"
      }).desc('created_at').run(function(err, messages) {
        return res.json(messages);
      });
    });
    app.get('/messages/sent', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.find({
        from_id: user._id,
        type: "sent"
      }).desc('created_at').run(function(err, messages) {
        return res.json(messages);
      });
    });
    app.get('/messages/draft', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.find({
        from_id: user._id,
        type: "draft"
      }).desc('created_at').run(function(err, messages) {
        return res.json(messages);
      });
    });
    return app.get('/messages/deleted', function(req, res) {
      var user;
      user = req.user ? req.user : {};
      return Message.find({
        from_id: user._id,
        type: "deleted"
      }).desc('created_at').run(function(err, messages) {
        return res.json(messages);
      });
    });
  };
}).call(this);
