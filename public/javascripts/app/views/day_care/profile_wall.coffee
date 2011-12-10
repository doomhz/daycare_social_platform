class Kin.DayCare.ProfileWallView extends Backbone.View
  
  model: null
  
  collection: null
  
  initialize: ()->
    _.bindAll @, "addWallComment"
    @collection.bind("add", @addWallComment)
  
  addWallComment: (model)->
    that = @
    wallComment = new Kin.DayCare.WallCommentView
      model: model

    if model.get("type") is "followup"
      $(@el).find("[data-id='#{model.get("to_id")}'] ul.followups:first").append(wallComment.el)
    else
      $(@el).prepend(wallComment.el)

    wallComment.render()
  
  remove: ()->
    @collection.stopAutoUpdateComments()