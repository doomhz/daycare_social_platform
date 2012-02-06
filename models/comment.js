(function() {
  var CommentSchema, exports;

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

  exports = module.exports = mongoose.model("Comment", CommentSchema);

}).call(this);
