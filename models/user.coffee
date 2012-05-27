# TODO Put created and updated dates for each model - check if mongoose can handle the updates automatically
path         = require("path")
mongooseAuth = require('mongoose-auth')

Picture = new Schema
  primary:
    type: Boolean
    default: false
  description:
    type: String
  url:
    type: String
  tiny_url:
    type: String
  mini_url:
    type: String
  small_url:
    type: String
  thumb_url:
    type: String
  medium_url:
    type: String
  big_url:
    type: String
  success: Boolean

PictureSet = new Schema
  user_id:
    type: String
  name:
    type: String
    index: true
  description:
    type: String
  type:
    type: String
    enum: ['default', 'public', 'profile']
    default: 'default'
  pictures: [Picture]

UserSchema = new Schema
  master_id:
    type: String
  name:
    type: String
    index: true
  surname:
    type: String
    index: true
  speaking_classes: [Number]
  address: String
  location:
    type: [Number]
    index: "2d"
  email: String
  phone: String
  fax: String
  contact_person: String
  licensed:
    type: Boolean
  license_number: String
  type:
    type: String
    enum: ['daycare', 'parent', 'class', 'staff']
    default: 'daycare'
  gender:
    type: String
    enum: ['female', 'male', 'mrs']
    default: 'female'
  opened_since:
    type: String
  open_door_policy:
    type: Boolean
  serving_disabilities:
    type: Boolean
  homebased:
    type: Boolean
    default: false
  religious_affiliation:
    type: Boolean
    default: false
  min_class_age:
    type: Number
    default: 0
  max_class_age:
    type: Number
    default: 0
  picture_sets:
    type: [PictureSet]
  friends:
    type: [String]
    default: []
  children_ids:
    type: [String]
    default: []
  reviewed_children:
    type: Boolean
    default: false
  daycare_friends:
    type: [{}]
    default: []
  children:
    type: [{}]
    default: []

UserSchema.methods.findDaycareFriends = (onFind)->
  that = @
  User = mongoose.model('User')
  User.find().where("type").in(["daycare", "class"]).where("_id").in(@friends).run (err, daycareFriends)->
    that.daycare_friends = []
    for daycareFriend in daycareFriends
      daycareFriendData =
        _id: daycareFriend._id
        name: daycareFriend.name
      that.daycare_friends.push(daycareFriendData)
    onFind(err, daycareFriends)

UserSchema.methods.getPronoun = ()->
  pronoun = "his"
  if @type in ["daycare", "class"]
    pronoun = "their"
  else if @gender is "female"
    pronoun = "her"
  pronoun

UserSchema.methods.changePassword = (cleartext, callback)->
  bcrypt = require "bcrypt"
  that = @
  bcrypt.genSalt 10, (error, salt)->
    bcrypt.hash cleartext, salt, (error, hash)->
      that.hash = hash
      that.salt = salt
      that.save ()->
        callback()

UserSchema.methods.sendPasswordLink = (options, callback)->
  that = @
  email   = require("mailer")
  siteUrl = "http://#{options.host}"
  @generateToken (token)->
    passUrl = "#{siteUrl}/change-password/#{token}"
    data =
      "profile_name": that.name
      "profile_surname": that.surname
      "site_url": siteUrl
      "pass_url": passUrl
    options =
      to: that
      subject: "Change password request on Kindzy.com"
      template: "change_password"
    Emailer = require "../lib/emailer"
    emailer = new Emailer options, data
    emailer.send (err, result)->
      if err
        console.log err
    callback()

UserSchema.methods.generateToken = (callback)->
  callback(@_id)


UserSchema.statics.findByToken = (token, callback)->
  User.findOne({_id: token}).run (err, user)->
    callback(err, user)

UserSchema.statics.checkPermissions = (object = {}, requiredKey, requiredValue, resForAutoRedirect)->
  if object and (not requiredKey or not requiredValue)
    return true
  if object[requiredKey] is requiredValue
    return true
  if resForAutoRedirect
    resForAutoRedirect.writeHead(303, {'Location': '/login'})
    resForAutoRedirect.end()
  false

UserSchema.plugin(
  mongooseAuth,
  {
    everymodule:
      everyauth:
        User: ()->
          User
        logoutPath: '/logout'
        logoutRedirectPath: '/login'
        handleLogout: (req, res)->
          req.logout()
          res.writeHead(303, {'Location': this.logoutRedirectPath()})
          res.end()
    password:
      loginWith: 'email'
      extraParams:
        type:              String
        name:              String
        surname:           String
        friend_request_id: String
      everyauth:
        loginFormFieldName: 'email'
        getLoginPath: '/login'
        postLoginPath: '/login'
        loginLayout: 'auth.jade'
        loginView: 'auth/login.jade'
        getRegisterPath: '/register'
        postRegisterPath: '/register'
        registerLayout: 'auth.jade'
        registerView: 'auth/register.jade'
        loginSuccessRedirect: '/'
        registerSuccessRedirect: '/'
        respondToLoginSucceed: (res, user = {}, data)->
          userId = "#{user._id}"
          friendRequestId = data.req.body.friend_request_id
          redirectTo = "/"

          if user.type is "daycare"
            #redirectTo = "/#profiles/view/#{userId}"
            res.writeHead(303, {'Location': redirectTo})
            res.end()

          else if user.type in ["parent", "staff"]

            if friendRequestId

              FriendRequest  = mongoose.model("FriendRequest")

              FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
                friendRequest.status = "accepted"
                friendRequest.user_id = userId
                friendRequest.save (err, updateRequest)->

                  #dayCareId = friendRequest.from_id
                  #redirectTo = "/#profiles/view/#{dayCareId}"

                  FriendRequest.updateFriendship userId, (err)->
                    userInfo =
                      reviewed_children: false

                    User.update {_id: userId}, userInfo, {}, (err)->
                      res.writeHead(303, {'Location': redirectTo})
                      res.end()
            else

              #User.findOne({type: "daycare"}).where("_id").in(user.friends).run (err, daycare)->
              #  if daycare
              #    redirectTo = "/#profiles/view/#{daycare._id}"
              #  else
              #    redirectTo = "/#profiles/view/#{user._id}"
              res.writeHead(303, {'Location': redirectTo})
              res.end()

        respondToRegistrationSucceed: (res, user, data)->
          redirectTo = '/'

          userInfo =
            picture_sets: [
              {
                type: 'profile'
                name: 'Profile pictures'
                description: 'Your profile pictures.'
                pictures: []
              }
            ]

          User.update {_id: user._id}, userInfo, {}, (err)->
            userId = user._id

            if user.type is 'daycare'
              #redirectTo = "/#profiles/edit/#{userId}"
              res.writeHead(303, {'Location': redirectTo})
              res.end()

            else if user.type in ["parent", "staff"] and user.friend_request_id
              friendRequestId = user.friend_request_id
              FriendRequest = require("./friend_request")

              FriendRequest.findOne({_id: friendRequestId}).run (err, friendRequest)->
                friendRequest.status = "accepted"
                friendRequest.user_id = userId
                friendRequest.save()

                #dayCareId = friendRequest.from_id
                #redirectTo = "/#profiles/view/#{dayCareId}"

                FriendRequest.updateFriendship userId, (err)->
                  res.writeHead(303, {'Location': redirectTo})
                  res.end()

            else
              res.writeHead(303, {'Location': redirectTo})
              res.end()
  }
)

User = mongoose.model('User', UserSchema)
exports = module.exports = User
