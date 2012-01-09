class window.Kin.PicturesCollection extends Backbone.Collection

  model: window.Kin.PictureModel

  uri: '/profiles/pictures/:pictureSetId'

  pictureSetId: null

  initialize: (models, {@pictureSetId})->
    @

  getPrimary: (orFirst = true)->
    primarys = _.filter @models, (pictureModel)->
      pictureModel.get('primary')
    primarys = if primarys.length then primarys else [@first()]
    primarys[0]

  url: ()->
    @uri.replace(/:pictureSetId/g, @pictureSetId)

  unsetPrimaryPicture: ()->
    for picture in @models
      picture.set({primary: false})