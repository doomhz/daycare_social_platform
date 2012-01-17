class window.Kin.ProfileModel extends Kin.UserModel

  uri: "/profiles/:profileId"

  pictureSets: null

  initialize: (attributes, uri)->
    @id = attributes._id
    @uri = uri or @uri
    _.bindAll(@, 'setPictureSets', 'updatePicturesFromPictureSets')
    @setPictureSets()
    @

  url: ()->
    @uri.replace(/:profileId/g, @get('_id'))

  getProfilePicture: ()->
    profilePictureSet = @getProfilePictureSet(@get('picture_sets'))
    profilePicture = @getPrimaryPictureFromSet(profilePictureSet)

  getProfilePictureSet: (pictureSets = @get('picture_sets'))->
    @getSetsByType(pictureSets, 'profile')[0]

  getPrimaryPictureFromSet: (set = {pictures: []})->
    $.grep(set.pictures, (picture)->
      return picture.primary is true
    )[0]

  getPublicSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'public')

  getDefaultSets: ()->
    sets = @getSetsByType(@get('picture_sets'), 'default')

  getSetsByType: (pictureSets, type = 'default')->
    $.grep(pictureSets, (set)->
      return set.type is type
    )

  setPictureSets: ()->
    if not @pictureSets
      @pictureSets = new window.Kin.PictureSetsCollection()
      @pictureSets.bind 'add', @updatePicturesFromPictureSets
      @pictureSets.bind 'remove', @updatePicturesFromPictureSets
    @pictureSets.reset(@get('picture_sets'))

  updatePicturesFromPictureSets: ()->
    @set({picture_sets: @pictureSets.toJSON()})
