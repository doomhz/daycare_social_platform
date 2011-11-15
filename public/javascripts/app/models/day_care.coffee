class window.Kin.DayCareModel extends Backbone.Model

  defaults:
    _id: null
    name: ''
    speaking_classes: []
    location:
      lat: 10
      lng: 40
    email: ''
    phone: ''
    contact_person: ''
    licensed: false
    type: 'daycare'
    opened_since: ''
    open_door_policy: false
    serving_disabilities: false
    picture_sets: []

  uri: "/day-cares/load"

  initialize: (options, uri)->
    @uri = uri or @uri
    @id = @get('_id') or @id
    @

  url: ()->
    "#{@uri}/#{@id}"

  getProfilePicture: ()->
    profilePictureSet = @getProfilePictureSet(@get('picture_sets'))
    profilePicture = @getPrimaryPictureFromSet(profilePictureSet)
      
  getProfilePictureSet: (pictureSets)->
    @getSetsByType(pictureSets, 'profile')[0]

  getPrimaryPictureFromSet: (set = {pictures: []})->
    $.grep(set.pictures, (picture)->
      return picture.primary is true
    )[0]

  getDaycareSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'daycare')

  getDefaultSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'default')

  getSetsByType: (pictureSets, type = 'default')->
    $.grep(pictureSets, (set)->
      return set.type is type
    )