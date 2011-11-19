class window.Kin.PictureSetModel extends Backbone.Model

  defaults:
    _id: null
    name: null
    description: null
    type: 'default'
    pictures: []
    daycare_id: null

  uri: '/day-cares/view/picture-set'

  pictures: null

  initialize: (attributes)->
    @setPictures()
    @bind 'change', @setPictures

  url: ()->
    "#{@uri}/#{@get('_id')}"

  setPictures: ()->
    @pictures or= new Kin.PicturesCollection()
    @pictures.add(@get('pictures'))