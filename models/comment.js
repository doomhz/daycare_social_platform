(function() {
  var CommentSchema, User, dayCareWallCommentsSocket, exports, mongooseAuth;
  mongooseAuth = require('mongoose-auth');
  User = require("./user");
  CommentSchema = new Schema({
    from_id: {
      type: String
    },
    to_id: {
      type: String
    },
    wall_id: {
      type: String
    },
    type: {
      type: String,
      "enum": ["status", "followup"],
      "default": "status"
    },
    content: {
      type: {},
      "default": ""
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
    }
  });
  dayCareWallCommentsSocket = null;
  CommentSchema.statics.setDaycareWallSocket = function(socket) {
    return dayCareWallCommentsSocket = socket;
  };
  CommentSchema.statics.getDaycareWallSocket = function() {
    return dayCareWallCommentsSocket;
  };
  CommentSchema.methods.postOnWall = function() {
    var comment;
    comment = this;
    return User.findOne({
      _id: comment.from_id
    }).run(function(err, user) {
      comment.from_user = user;
      return dayCareWallCommentsSocket.emit("new-wall-comments", {
        comments: comment,
        wall_id: comment.wall_id
      });
    });
  };
  exports = module.exports = mongoose.model("Comment", CommentSchema);
}).call(this);
