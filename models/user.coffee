# TODO Put created and updated dates for each model - check if mongoose can handle the updates automatically
mongooseAuth = require('mongoose-auth')

Picture = new Schema
  primary:
    type: Boolean
    default: false
  description:
    type: String
  url:
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
  name:
    type: String
    index: true
  surname:
    type: String
    index: true
  speaking_classes: [Number]
  address: String
  location:
    lat: Number
    lng: Number
  email: String
  phone: String
  fax: String
  contact_person: String
  licensed:
    type: Boolean
  license_number: String
  type:
    type: String
    enum: ['daycare', 'parent']
    default: 'daycare'
  opened_since:
    type: String
  open_door_policy:
    type: Boolean
  serving_disabilities:
    type: Boolean
  picture_sets:
    type: [PictureSet]

UserSchema.methods.filterPrivateDataByUserId = (user_id)->
  if @constructor is Array
    users = []
    for user in @
      if "#{user_id}" is "#{user._id}"
        users.push(user)
      else
        users.push(UserSchema.statics.getPublicData(user))
    return users
  else
    if "#{user_id}" is "#{@_id}"
      return @
    else
      return UserSchema.statics.getPublicData(@)

UserSchema.statics.filterPrivatePictureSetsByUserId = (user_id, guestUserId, pictureSets)->
  if "#{user_id}" is "#{guestUserId}"
    return pictureSets
  else
    publicPictureSetTypes = ["profile", "public"]
    publicPictureSets = []

    for pictureSet in pictureSets
      if pictureSet.type in publicPictureSetTypes
        publicPictureSets.push(pictureSet)

    return publicPictureSets

UserSchema.statics.getPublicData = (user)->
  data = {}
  publicRows =
    "_id": true
    "name": true
    "surname": true
    "speaking_classes": true
    "address": true
    "location": true
    "email": true
    "phone": true
    "fax": true
    "contact_person": true
    "licensed": true
    "license_number": true
    "type": true
    "opened_since": true
    "open_door_policy": true
    "serving_disabilities": true

  for key, val of user
    if publicRows[key]
      data[key] = val

  data.picture_sets = []
  publicPictureSetTypes = ["profile", "public"]

  for pictureSet in user.picture_sets
    if pictureSet.type in publicPictureSetTypes
      data.picture_sets.push(pictureSet)

  data

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
          mongoose.model('User')
        logoutPath: '/logout'
        logoutRedirectPath: '/login'
        handleLogout: (req, res)->
          req.logout()
          res.writeHead(303, {'Location': this.logoutRedirectPath()})
          res.end()
    password:
      loginWith: 'email'
      extraParams:
        type:         String
        name:         String
        surname:      String
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

          User = require('./user')
          User.update {_id: user._id}, userInfo, {}, (err, updatedUser)->
            if user.type is 'daycare'
              redirectTo = "/#profiles/edit/#{user._id}"

            res.writeHead(303, {'Location': redirectTo})
            res.end()
  }
)

exports = module.exports = mongoose.model('User', UserSchema)
