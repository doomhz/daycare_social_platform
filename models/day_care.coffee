# TODO Put created and updated dates for each model - check if mongoose can handle the updates automatically

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
  daycare_id:
    type: String
  name:
    type: String
    index: true
  description:
    type: String
  type:
    type: String
    enum: ['default', 'daycare', 'profile']
    default: 'default'
  pictures: [Picture]

DayCare = new Schema
  user_id:
    type: String
  name:
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
    enum: ['daycare', 'kindergarten', 'preschool']
    default: 'daycare'
  opened_since:
    type: Date
  open_door_policy:
    type: Boolean
  serving_disabilities:
    type: Boolean
  picture_sets:
    type: [PictureSet]
    #default: [
      #{
        #type: 'profile'
        #name: 'Profile pictures'
        #description: 'Your profile pictures.'
        #pictures: []
      #}
    #]

DayCare.methods.filterPrivateDataByUserId = (user_id)->
  if @constructor is Array
    dayCares = []
    for dayCare in @
      if "#{user_id}" is "#{dayCare.user_id}"
        dayCares.push(dayCare)
      else
        dayCares.push(DayCare.statics.getPublicData(dayCare))
    return dayCares
  else
    if "#{user_id}" is "#{@user_id}"
      return @
    else
      return DayCare.statics.getPublicData(@)

DayCare.statics.filterPrivatePictureSetsByUserId = (user_id, dayCareUserId, pictureSets)->
  if "#{user_id}" is "#{dayCareUserId}"
    return pictureSets
  else
    publicPictureSetTypes = ["profile", "daycare"]
    publicPictureSets = []

    for pictureSet in pictureSets
      if pictureSet.type in publicPictureSetTypes
        publicPictureSets.push(pictureSet)

    return publicPictureSets

DayCare.statics.getPublicData = (dayCare)->
  data = {}
  publicRows =
    "user_id": true
    "name": true
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
    
  for key, val of dayCare
    if publicRows[key]
      data[key] = val

  data.picture_sets = []
  publicPictureSetTypes = ["profile", "daycare"]
  
  for pictureSet in dayCare.picture_sets
    if pictureSet.type in publicPictureSetTypes
      data.picture_sets.push(pictureSet)

  data
  

exports = module.exports = mongoose.model('DayCare', DayCare)
