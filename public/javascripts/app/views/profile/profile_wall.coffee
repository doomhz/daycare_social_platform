class Kin.Profile.ProfileWallView extends Backbone.View

  model: null

  collection: null

  commentTplUrl: '/templates/main/profile/wall_comment.html'

  initialize: ()->
    _.bindAll @, "addWallComment"
    @collection.bind("add", @addWallComment)
    that = @
    $.tmpload
      url: @commentTplUrl
      onLoad: ()->
        that.collection.loadComments()

  addWallComment: (model)->
    that = @
    wallComment = new Kin.Profile.WallCommentView
      model: model

    if model.get("type") is "followup"
      $(@el).find("[data-id='#{model.get("to_id")}'] ul.followups:first").append(wallComment.el)
    else
      $(@el).prepend(wallComment.el)

    wallComment.render()

  remove: ()->
    @collection.stopAutoUpdateComments()