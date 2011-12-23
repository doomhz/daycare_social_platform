(function() {
  var Comment, User;
  User = require('../models/user');
  Comment = require('../models/comment');
  module.exports = function(app) {
    return app.post('/comments', function(req, res) {
      var comment, data, user;
      user = req.user ? req.user : {};
      data = req.body;
      data.from_id = user._id;
      delete data.created_at;
      delete data.updated_at;
      comment = new Comment(data);
      comment.save();
      comment.postOnWall();
      return res.json({
        success: true
      });
    });
  };
}).call(this);
