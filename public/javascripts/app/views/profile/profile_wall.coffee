class Kin.Profile.ProfileWallView extends Backbone.View

  model: null

  collection: null

  postsBatchSize: Kin.CONFIG.postsBatchSize

  initialize: (options = {})->
    @collection.bind("add", @addWallComment)
    @render()

  render: ()->
    @preloadTemplates(@onLoadTemplates)

  onLoadTemplates: ()=>
    that = @
    @collection.loadComments
      isHistory: true
      success: (collection, models)->
        statuses = _.filter models, (model)->
          model.type is "status"
        if statuses.length is that.postsBatchSize
          that.options.loadMoreCommentsCnt.removeClass("hidden")

  preloadTemplates: (callback)->
    that = @
    comment = new Kin.Profile.WallCommentView
    followup = new Kin.Profile.WallFollowupView
    $.tmpload
      url: comment.tplUrl
      onLoad: ()->
        $.tmpload
          url: followup.tplUrl
          onLoad: ()->
            callback()

  addWallComment: (model)=>
    that = @
    wallComment = new Kin.Profile.WallCommentView
      model: model
      collection: new Kin.FollowupsCollection([], {commentId: model.id})

    if model.get("timeline") is "future"
      $(@el).prepend(wallComment.el)
    else
      $(@el).append(wallComment.el)

    wallComment.render()

  remove: ()->
    @collection.stopAutoUpdateComments()
    @collection.each (model)->
      model.view.remove()
