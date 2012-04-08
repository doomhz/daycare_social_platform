class window.Kin.Comment.CommentView extends Backbone.View

  el: null

  collection: null

  model: null

  tplUrl: "/templates/main/comment/comment.html"

  initialize: (options = {})->
    @collection.bind("add", @addWallComment)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())
        that.collection.fetch
          add: true

  remove: ()->
    @collection.each (model)->
      model.view.remove()
    @unbind()
    $(@el).unbind().empty()

  addWallComment: (model)=>
    that = @
    model.set({"wall_id": @model.get("wall_id")})

    wallComment = new Kin.Profile.WallCommentView
      model: model
      collection: new Kin.FollowupsCollection([], {commentId: model.id})

    $.tmpload
      url: wallComment.tplUrl
      onLoad: (tpl)->
        that.$("#wall-comments-list").append(wallComment.el)
        wallComment.render()
