class window.Kin.PictureSetModel extends Backbone.Model

  defaults:
    _id: null
    name: null
    description: null
    type: 'default'
    pictures: []
    daycare_id: null

  uri: '/day-cares/picture-set/:pictureSetId'

  pictures: null

  initialize: (attributes)->
    @id = attributes._id
    @setPictures()
    @bind 'change', @setPictures
    @

  url: ()->
    @uri.replace(/:pictureSetId/g, @get('_id'))

  setPictures: ()->
    @pictures or= new Kin.PicturesCollection([], {pictureSetId: @get('_id')})
    @pictures.add(@get('pictures'))