(function() {
  var Comment, User, io;
  User = require('../models/user');
  Comment = require('../models/comment');
  io = require('socket.io');
  module.exports = function(app) {
    var dayCareWallComments, sio;
    app.post('/comments', function(req, res) {
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
    sio = io.listen(app);
    dayCareWallComments = sio.of("/day-cares-wall-comments").on("connection", function(socket) {
      socket.on("get-new-comments", function(data) {
        return Comment.find({
          wall_id: data.wall_id
        }).desc("type").asc("updated_at").run(function(err, comments) {
          var comment, usersToFind, _i, _len;
          if (comments) {
            usersToFind = [];
            for (_i = 0, _len = comments.length; _i < _len; _i++) {
              comment = comments[_i];
              usersToFind.push(comment.from_id);
            }
            if (usersToFind.length) {
              return User.where("_id")["in"](usersToFind).run(function(err, users) {
                var comment, user, _j, _k, _len2, _len3;
                if (users) {
                  for (_j = 0, _len2 = comments.length; _j < _len2; _j++) {
                    comment = comments[_j];
                    for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                      user = users[_k];
                      if (("" + user._id) === ("" + comment.from_id)) {
                        comment.from_user = user;
                      }
                    }
                  }
                }
                return socket.emit("new-wall-comments", {
                  comments: comments
                });
              });
            }
          }
        });
      });
      return socket.on("disconnect", function() {});
    });
    return Comment.setDaycareWallSocket(dayCareWallComments);
  };
}).call(this);
