class window.Kin.Comment.CommentView extends Backbone.View

  el: null

  collection: null

  followupsCollection: null

  model: null

  tplUrl: "/templates/main/comment/comment.html"

  events:
    "submit .add-followup-form": "addFollowupHandler"
    "keyup .add-followup-form textarea": "typeFollowupHandler"

  initialize: (options = {})->
    @followupsCollection = options.followupsCollection
    @collection.bind("add", @addWallComment)
    @followupsCollection.bind("add", @addWallComment)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())
        that.collection.fetch
          add: true
          success: ()->
            that.followupsCollection.loadFollowups()
            that.followupsCollection.startAutoUpdateFollowups()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @followupsCollection.stopAutoUpdateFollowups()

  addWallComment: (model)=>
    that = @
    model.set({"wall_id": @model.get("wall_id")})

    wallComment = new Kin.Profile.WallCommentView
      model: model

    $.tmpload
      url: wallComment.tplUrl
      onLoad: (tpl)->
        if model.get("type") is "followup"
          $followupsCnt = that.$("#wall-comments-list").find("[data-id='#{model.get("to_id")}'] ul.followups:first")
          $followupsCnt.append(wallComment.el)
        else
          that.$("#wall-comments-list").append(wallComment.el)

        wallComment.render()

  addFollowupHandler: (ev)->
    ev.preventDefault()
    $form = @$(ev.target)
    @sendCommentFromForm($form)
    $form.find("textarea").val("").keyup()

  typeFollowupHandler: (ev)->
    if ev.keyCode is 13
      $form = @$(ev.target).parents("form")
      $form.submit()

  sendCommentFromForm: ($form)->
    that = @
    commentData = $form.serialize()
    comment = new Kin.CommentModel({wall_id: @model.get("wall_id")})
    comment.save null,
      data: commentData
      success: ()->
        that.followupsCollection.loadFollowups()

