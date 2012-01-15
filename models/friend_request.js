(function() {
  var FriendRequest, FriendRequestSchema, User, exports;
  User = require("./user");
  FriendRequestSchema = new Schema({
    from_id: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    status: {
      type: String,
      "enum": ["sent", "accepted"],
      "default": "sent"
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });
  FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
  exports = module.exports = FriendRequest;
}).call(this);
