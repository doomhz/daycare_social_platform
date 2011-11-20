class window.Kin.PictureModel extends Backbone.Model

  defaults:
    primary: false
    description: null
    url: null

  uri: '/day-cares/picture/:pictureId'

  initialize: (attributes)->
    @id = attributes._id

  url: ()->
    @uri.replace(/:pictureId/g, @get('_id'))
