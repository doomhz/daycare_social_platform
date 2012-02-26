TagSchema = new Schema
  type:
    type: String
  name:
    type: String

Tag = mongoose.model("Tag", TagSchema)
exports = module.exports = Tag