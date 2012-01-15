User         = require("./user")

FriendRequestSchema = new Schema
  from_id:
    type: String
  email:
    type: String
  name:
    type: String
  surname:
    type: String
  status:
    type: String
    enum: ["sent", "accepted"]
    default: "sent"
  created_at:
    type: Date
    default: Date.now

FriendRequestSchema.statics.sendMail = (friendRequest, options)->
  User.findOne({_id: friendRequest.from_id}).run (err, daycare)->
    email     = require("mailer")
    siteUrl   = "http://#{options.host}"
    inviteUrl = "#{siteUrl}/register?friend_request=#{friendRequest._id}"
    email.send({
      host : "smtp.gmail.com"
      port : "587"
      ssl: false
      domain : "localhost"
      to : "'#{friendRequest.name} #{friendRequest.surname}' <#{friendRequest.email}>"
      from : "'Kindzy.com' <no-reply@kindzy.com>"
      subject : "Friend request from #{daycare.name} on Kindzy.com"
      template : "./views/emails/parent_invite.html"
      body: "Please use a newer version of an e-mail manager to read this mail in HTML format."
      data :
        "daycare_name": daycare.name
        "parent_name": friendRequest.name
        "parent_surname": friendRequest.surname
        "site_url": siteUrl
        "invite_url": inviteUrl
      authentication : "login"
      username : "no-reply@kindzy.com"
      password : "greatreply#69"
    },
    (err, result)->
      if err
        console.log err
    )

FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema)

exports = module.exports = FriendRequest