class window.Kin.PictureModel extends Backbone.Model

  defaults:
    primary: false
    description: null
    url: null
    thumb_url: null
    medium_url: null
    big_url: null

  uri: '/profiles/picture/:pictureId'

  initialize: (attributes)->
    @id = attributes._id

  url: ()->
    @uri.replace(/:pictureId/g, @get('_id'))
