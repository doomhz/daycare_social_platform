(function() {
  var Comment, CommentSchema, exports;

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
    privacy: {
      type: String,
      "enum": ["private", "public"],
      "default": "private"
    },
    content: {
      type: {},
      "default": ""
    },
    added_at: {
      type: Number,
      "default": function() {
        return new Date().getTime();
      }
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    updated_at: {
      type: Date,
      "default": Date.now
    },
    timeline: {
      type: String
    },
    from_user: {
      type: {}
    }
  });

  CommentSchema.statics.addNewPictureStatus = function(commentData, pictureSet, newPicture) {
    var timeago;
    timeago = new Date().getTime() - 43200000;
    return Comment.findOne({
      type: "status",
      "content.type": "new_picture",
      "content.picture_set_id": pictureSet._id
    }).gt("added_at", timeago).run(function(err, comment) {
      var pictureData, pictures;
      pictureData = {
        _id: newPicture._id,
        url: newPicture.url,
        tiny_url: newPicture.tiny_url,
        mini_url: newPicture.mini_url,
        small_url: newPicture.small_url,
        thumb_url: newPicture.thumb_url,
        medium_url: newPicture.medium_url,
        big_url: newPicture.big_url,
        primary: newPicture.primary
      };
      if (comment) {
        pictures = comment.content.pictures;
        pictures.unshift(pictureData);
        return Comment.update({
          _id: comment._id
        }, {
          "content.picture_set_name": pictureSet.name,
          "content.pictures": pictures
        }).run(function() {});
      } else {
        comment = new Comment({
          from_id: commentData.from_id,
          to_id: commentData.to_id,
          wall_id: commentData.to_id,
          type: "status",
          content: {
            type: "new_picture",
            picture_set_id: pictureSet._id,
            picture_set_name: pictureSet.name,
            pictures: [pictureData]
          }
        });
        return comment.save();
      }
    });
  };

  Comment = mongoose.model("Comment", CommentSchema);

  exports = module.exports = Comment;

}).call(this);
