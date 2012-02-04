User = require("./user")
_    = require('underscore')

FriendRequestSchema = new Schema
  user_id:
    type: String
  from_id:
    type: String
  email:
    type: String
  name:
    type: String
  surname:
    type: String
  type:
    type: String
    enum: ['parent', 'staff']
    default: 'parent'
  children_ids:
    type: [String]
  classes_ids:
    type: [String]
  parent_type:
    type: String
    enum: ['mother', 'father']
    default: 'mother'
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
      template : "./views/emails/#{friendRequest.type}_invite.html"
      body: "Please use a newer version of an e-mail manager to read this mail in HTML format."
      data :
        "daycare_name": daycare.name
        "profile_name": friendRequest.name
        "profile_surname": friendRequest.surname
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

FriendRequestSchema.methods.updateFriendship = (userId, onFriendshipUpdate)->
  Child = require("./child")

  daycareAndClassesToFind = []
  daycareAndClassesToFind.push(@from_id)
  childrenIds = @children_ids
  classesIds = @classes_ids
  parentType = @parent_type

  User.find().where("_id").in(@classes_ids).run (err, classes = [])->
    for daycareClass in classes
      daycareAndClassesToFind.push(daycareClass._id)

    Child.find().where("_id").in(childrenIds).run (err, children = [])->
      for child in children
        daycareAndClassesToFind.push(child.user_id)

      User.find().where("_id").in(daycareAndClassesToFind).run (err, dayCares)->
        friendsToAdd = []
        for dayCare in dayCares
          friendsToAdd = _.union(friendsToAdd, dayCare.friends)
          dayCare.friends.push(userId)
          dayCare.save()

        User.find().where("type").in(["parent", "staff"]).where("_id").in(friendsToAdd).run (err, dayCareFriends)->
          myFriendsIds = daycareAndClassesToFind
          for userFriend in dayCareFriends
            myFriendsIds.push(userFriend._id)
            userFriend.friends.push(userId)
            userFriend.save()

          User.update {_id: userId}, {friends: myFriendsIds, children_ids: childrenIds, classes_ids: classesIds, parent_type: parentType}, {}, (err)->
            if onFriendshipUpdate
              onFriendshipUpdate(err)

FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema)

exports = module.exports = FriendRequest