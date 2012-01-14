class window.Kin.PictureSetModel extends Backbone.Model

  defaults:
    name: null
    description: null
    type: 'default'
    pictures: []
    profile_id: null

  uri: '/profiles/picture-set/:pictureSetId'

  pictures: null

  initialize: (attributes)->
    @id = attributes._id
    @setPictures()
    @bind 'change', @setPictures
    @

  url: ()->
    pictureSetId = @get('_id') or ''
    @uri.replace(/:pictureSetId/g, pictureSetId)

  setPictures: ()->
    @pictures or= new Kin.PicturesCollection([], {pictureSetId: @get('_id')})
    @pictures.add(@get('pictures'))