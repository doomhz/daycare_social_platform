class Kin.Profile.ProfileWallView extends Backbone.View

  model: null

  collection: null

  commentTplUrl: '/templates/main/profile/wall_comment.html'

  postsBatchSize: Kin.CONFIG.postsBatchSize

  initialize: (options = {})->
    _.bindAll @, "addWallComment"
    @collection.bind("add", @addWallComment)
    @render()

  render: ()->
    that = @
    $.tmpload
      url: @commentTplUrl
      onLoad: ()->
        that.collection.loadComments
          isHistory: true
          success: (collection, models)->
            statuses = _.filter models, (model)->
              model.type is "status"
            if statuses.length is that.postsBatchSize
              that.options.loadMoreCommentsCnt.removeClass("hidden")

  addWallComment: (model)->
    that = @
    wallComment = new Kin.Profile.WallCommentView
      model: model

    if model.get("type") is "followup"
      $followupsCnt = $(@el).find("[data-id='#{model.get("to_id")}'] ul.followups:first")
      if model.get("timeline") is "future"
        $followupsCnt.append(wallComment.el)
      else
        $followupsCnt.prepend(wallComment.el)
    else
      if model.get("timeline") is "future"
        $(@el).prepend(wallComment.el)
      else
        $(@el).append(wallComment.el)

    wallComment.render()

  remove: ()->
    @collection.stopAutoUpdateComments()
