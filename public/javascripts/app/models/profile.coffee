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
    id = @get('_id') or ""
    @uri.replace(/:profileId/g, id)

  setPictureSets: ()->
    if not @pictureSets
      @pictureSets = new window.Kin.PictureSetsCollection()
      @pictureSets.bind 'add', @updatePicturesFromPictureSets
      @pictureSets.bind 'remove', @updatePicturesFromPictureSets
    @pictureSets.reset(@get('picture_sets'))

  updatePicturesFromPictureSets: ()->
    @set({picture_sets: @pictureSets.toJSON()})
