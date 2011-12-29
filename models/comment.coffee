User = require("./user")

CommentSchema = new Schema
  from_id:
    type: String
  to_id:
    type: String
  wall_id:
    type: String
  type:
    type: String
    enum: ["status", "followup"]
    default: "status"
  content:
    type: {}
    default: ""
  created_at:
    type: Date
    default: Date.now
  updated_at:
    type: Date
    default: Date.now
  from_user:
    type: {}

dayCareWallCommentsSocket = null

CommentSchema.statics.setDaycareWallSocket = (socket)->
  dayCareWallCommentsSocket = socket

CommentSchema.statics.getDaycareWallSocket = ()->
  dayCareWallCommentsSocket

CommentSchema.methods.postOnWall = ()->
  comment = @
  User.findOne({_id: comment.from_id}).run (err, user)->
    comment.from_user = user
    dayCareWallCommentsSocket.emit("new-wall-comments", {comments: comment, wall_id: comment.wall_id})

exports = module.exports = mongoose.model("Comment", CommentSchema)