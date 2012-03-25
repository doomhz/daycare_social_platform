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
  privacy:
    type: String
    enum: ["private", "public"]
    default: "private"
  content:
    type: {}
    default: ""
  added_at:
    type: Number
    default: ()->
      new Date().getTime()
  created_at:
    type: Date
    default: Date.now
  updated_at:
    type: Date
    default: Date.now
  timeline:
    type: String
  from_user:
    type: {}

CommentSchema.statics.addNewPictureStatus = (commentData, pictureSet, newPicture)->
  timeago = new Date().getTime() - 43200000 # 12 hour ago
  Comment.findOne({type: "status", "content.type": "new_picture", "content.picture_set_id": pictureSet._id}).gt("added_at", timeago).run (err, comment)->
    pictureData =
      _id: newPicture._id
      url: newPicture.url
      tiny_url: newPicture.tiny_url
      mini_url: newPicture.mini_url
      small_url: newPicture.small_url
      thumb_url: newPicture.thumb_url
      medium_url: newPicture.medium_url
      big_url: newPicture.big_url
      primary: newPicture.primary
    if comment
      pictures = comment.content.pictures
      pictures.unshift(pictureData)
      Comment.update({_id: comment._id}, {"content.picture_set_name": pictureSet.name, "content.pictures": pictures}).run ()->
    else
      comment = new Comment
        from_id: commentData.from_id
        to_id: commentData.to_id
        wall_id: commentData.to_id
        type: "status"
        content:
          type: "new_picture"
          picture_set_id: pictureSet._id
          picture_set_name: pictureSet.name
          pictures: [pictureData]
      comment.save()

Comment = mongoose.model("Comment", CommentSchema)

exports = module.exports = Comment