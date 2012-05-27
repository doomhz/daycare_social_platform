InviteRequestSchema = new Schema
  email:
    type: String
  message:
    type: String
  created_at:
    type: Date
    default: Date.now

InviteRequestSchema.methods.send = ()->
  data =
    "email": @email
    "message": @message
  options =
    to:
      email: "help@kindzy.com"
      name: "Kindzy"
      surname: "Help"
    subject: "Invite requested on Kindzy.com"
    template: "request_invite"
  Emailer = require "../lib/emailer"
  emailer = new Emailer options, data
  emailer.send (err, result)->
    if err
      console.log err

InviteRequest = mongoose.model("InviteRequest", InviteRequestSchema)
exports = module.exports = InviteRequest