RegisterInviteSchema = new Schema
  email:
    type: String
  name:
    type: String
  surname:
    type: String
  created_at:
    type: Date
    default: Date.now

RegisterInviteSchema.methods.send = ()->
  options =
    to:
      email: @email
      name: @name
      surname: @surname
    subject: "Registartion invite from Kindzy"
    template: "register_invite"
  Emailer = require "../lib/emailer"
  emailer = new Emailer options, @
  emailer.send (err, result)->
    if err
      console.log err

RegisterInvite = mongoose.model("RegisterInvite", RegisterInviteSchema)
exports = module.exports = RegisterInvite