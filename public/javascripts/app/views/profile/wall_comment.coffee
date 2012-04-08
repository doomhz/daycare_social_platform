class Kin.Profile.WallCommentView extends Backbone.View

  tagName: 'li'

  className: 'single'

  tplUrl: '/templates/main/profile/wall_comment.html'

  collection: null

  events:
    "submit .add-followup-form": "addFollowupHandler"
    "keyup .add-followup-form textarea": "typeFollowupHandler"
    "click #load-more-followups-cnt": "loadMoreFollowupsHandler"

  followupsBatchSize: Kin.CONFIG.followupsBatchSize

  initialize: ()->
    @model and @model.view = @
    if @collection
      @collection.bind("add", @addFollowup)

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).addClass(that.model.get("type")).attr("data-id", that.model.get("_id")).html(tpl({comment: that.model}))
        that.$(".time").timeago()

        that.$(".add-followup-form:first textarea").autoResize
          extraSpace: -2

        that.$('a[rel^="prettyPhoto"]').prettyPhoto
          slideshow: false
          social_tools: false
          theme: 'light_rounded'
          deeplinking: false
          animation_speed: 0

        if typeof that.model.get("content") isnt "object"
          that.$(".comment-text").expander
            slicePoint: 215
            expandSpeed: 0
            collapseSpeed: 0
        that.$(".edit-comment").bind("click", that.editCommentHandler)
        that.$(".delete-comment").bind("click", that.deleteCommentHandler)

        that.collection.loadFollowups
          isHistory: true
          success: (collection, models)->
            if models.length is that.followupsBatchSize
              that.$("#load-more-followups-cnt").removeClass("hidden")

        that.collection.startAutoUpdateFollowups()

  editCommentHandler: (ev)=>
    ev.preventDefault()
    that = @
    if typeof @model.get("content") is "string"
      @$(".comment-text:first").doomEdit
        autoTrigger: true
        ajaxSubmit: false
        submitOnBlur: true
        submitBtn: false
        cancelBtn: false
        editField: '<textarea name="content" class="comment-edit-textarea"></textarea>'
        showOnEvent: false
        afterFormSubmit: (data, form, $el)->
          $el.text(data)
          that.model.save({content: data}, {silent: true})

  deleteCommentHandler: (ev)=>
    ev.preventDefault()
    that = @
    dConfirm "Are you sure you want to remove the comment?", (btType, win)->
  		  if btType is "yes"
          win.close()
          that.model.destroy()
          $(that.el).remove()
        if btType in ["no", "close"]
          win.close()

  addFollowup: (model)=>
    wallFollowup = new Kin.Profile.WallFollowupView
      model: model
    $followupsCnt = @$(".followups:first")
    if model.get("timeline") is "future"
      $followupsCnt.append(wallFollowup.el)
    else
      $followupsCnt.prepend(wallFollowup.el)
    wallFollowup.render()

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
        that.collection.loadFollowups()

  loadMoreFollowupsHandler: (ev)->
    ev.preventDefault()
    @collection.loadFollowups
      isHistory: true
      success: (collection, models)=>
        if models.length < @followupsBatchSize
          $(ev.currentTarget).remove()

  remove: ()->
    @collection.stopAutoUpdateFollowups()
    @unbind()
    $(@el).unbind().empty()
