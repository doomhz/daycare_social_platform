class window.Kin.PictureSetModel extends Backbone.Model

  defaults:
    name: null
    description: null
    type: 'default'
    pictures: []

  pictures: null

  initialize: (pictureSet = [])->
    @pictures = new Kin.PicturesCollection(pictureSet.pictures)