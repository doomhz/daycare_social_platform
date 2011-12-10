(function() {
  var Message, User;
  User = require('../models/user');
  Message = require('../models/message');
  module.exports = function(app) {
    return app.post('/messages', function(req, res) {
      var data, message, user;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.created_at;
      delete data.updated_at;
      message = new Message(data);
      message.save();
      return res.json({
        success: true
      });
    });
  };
}).call(this);
