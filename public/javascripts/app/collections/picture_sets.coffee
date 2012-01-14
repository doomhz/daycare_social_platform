class window.Kin.PictureSetsCollection extends Backbone.Collection

  model: window.Kin.PictureSetModel

  initialize: ()->

  getPrimaryPicture: (pictureSets)->
    profileSet = _.filter pictureSets, (pictureSet)->
      pictureSet.type is "profile"
    primarys = false
    if profileSet.length
      primarys = _.filter profileSet[0].pictures, (picture)->
        picture.primary
      primarys = if primarys.length then primarys else profileSet[0].pictures
    primarys[0]