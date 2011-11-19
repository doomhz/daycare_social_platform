class window.Kin.PicturesCollection extends Backbone.Collection

  model: window.Kin.PictureModel

  uri: '/day-cares/pictures/:pictureSetId'

  pictureSetId: null

  initialize: (models, {@pictureSetId})->
    @

  getPrimary: (orFirst = true)->
    primarys = _.filter @models, (pictureModel)->
      pictureModel.get('primary')
    primarys or= [@first()]
    primarys[0]

  url: ()->
    @uri.replace(/:pictureSetId/g, @pictureSetId)
