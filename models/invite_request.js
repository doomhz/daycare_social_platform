(function() {
  var InviteRequest, InviteRequestSchema, exports;

  InviteRequestSchema = new Schema({
    email: {
      type: String
    },
    message: {
      type: String
    },
    created_at: {
      type: Date,
      "default": Date.now
    }
  });

  InviteRequest = mongoose.model("InviteRequest", InviteRequestSchema);

  exports = module.exports = InviteRequest;

}).call(this);
