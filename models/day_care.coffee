require('./db_connect')

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
  name:
    type: String
    index: true
  speaking_classes: [Number]
  location:
    lat: Number
    lng: Number
  email: String
  phone: String
  contact_person: String
  licensed:
    type: Boolean
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


exports = module.exports = mongoose.model('DayCare', DayCare)
