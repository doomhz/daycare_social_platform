class window.Kin.PicturesCollection extends Backbone.Collection

  model: window.Kin.PictureModel

  getPrimary: (orFirst = true)->
    primarys = _.filter @models, (pictureModel)->
      pictureModel.get('primary')
    primarys or= [@first()]
    primarys[0]