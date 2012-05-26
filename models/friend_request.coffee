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
  gender:
    type: String
    enum: ['female', 'male', 'mrs']
    default: 'female'
  status:
    type: String
    enum: ["pending", "accepted", "canceled"]
    default: "pending"
  created_at:
    type: Date
    default: Date.now
  user:
    type: {}

FriendRequestSchema.statics.sendMail = (friendRequest, options)->
  User.findOne({_id: friendRequest.from_id}).run (err, daycare)->
    siteUrl   = "http://#{options.host}"
    inviteUrl = "#{siteUrl}/register?friend_request=#{friendRequest._id}"
    data =
      "daycare_name": daycare.name
      "profile_name": friendRequest.name
      "profile_surname": friendRequest.surname
      "site_url": siteUrl
      "invite_url": inviteUrl
    options =
      to: friendRequest
      subject: "Friend request from #{daycare.name} on Kindzy.com"
      template: "#{friendRequest.type}_invite"
    Emailer = require "../lib/emailer"
    emailer = new Emailer options, data
    emailer.send (err, result)->
      if err
        console.log err

FriendRequestSchema.statics.updateFriendship = (userId, onFriendshipUpdate)->
  Child          = mongoose.model("Child")
  FriendRequest  = mongoose.model("FriendRequest")
  Notification   = mongoose.model("Notification")

  FriendRequest.find({user_id: userId}).run (err, friendRequests)->

    daycareAndClassesToFind = []
    childrenIds             = []
    classesIds              = []
    gender                  = ""

    for friendRequest in friendRequests
      daycareAndClassesToFind.push(friendRequest.from_id)
      childrenIds = childrenIds.concat(friendRequest.children_ids)
      classesIds  = classesIds.concat(friendRequest.classes_ids)
      gender      = friendRequest.gender

    User.find().where("_id").in(classesIds).run (err, classes = [])->
      for daycareClass in classes
        daycareAndClassesToFind.push(daycareClass._id)

      Child.find().where("_id").in(childrenIds).run (err, children = [])->
        for child in children
          daycareAndClassesToFind.push(child.user_id)
          classesIds.push(child.user_id)

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

            myFriendsIds = _.uniq(myFriendsIds)
            childrenIds  = _.uniq(childrenIds)
            classesIds   = _.uniq(classesIds)

            User.update {_id: userId}, {friends: myFriendsIds, children_ids: childrenIds, classes_ids: classesIds, gender: gender}, {}, (err)->
              if onFriendshipUpdate
                onFriendshipUpdate(err)
              Notification.addForRequest(userId, classesIds)

FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema)

exports = module.exports = FriendRequest