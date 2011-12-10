mongooseAuth = require('mongoose-auth')
User         = require("./user")

MessageSchema = new Schema
  from_id:
    type: String
  to_id:
    type: String
  type:
    type: String
    enum: ["default", "draft", "sent", "deleted"]
    default: "default"
  content:
    default: ""
  created_at:
    type: Date
    default: Date.now
  updated_at:
    type: Date
    default: Date.now
  from_user:
    type: {}

exports = module.exports = mongoose.model("Message", MessageSchema)