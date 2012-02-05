class Kin.WallCommentsCollection extends Backbone.Collection

  model: Kin.CommentModel

  profileId: null

  intervalId: null

  loadCommentsTime: 3000

  isLoadHistory: false

  loadInProgress: false

  uri: "/comments/:wall_id/:comment_time/:timeline"

  initialize: (models, {@profileId})->
    @startAutoUpdateComments()

  startAutoUpdateComments: ()->
    that = @
    @intervalId = window.setInterval(@loadComments, @loadCommentsTime)

  stopAutoUpdateComments: ()->
    window.clearInterval(@intervalId)

  loadComments: (options)=>
    options ?=
      isHistory: false
    if not @loadInProgress
      @loadInProgress = true
      @isLoadHistory = options.isHistory
      @fetch
        add: true
        success: options.success
        complete: ()=>
          @loadInProgress = false
      @isLoadHistory = false

  add: (models, options)->
    models = if _.isArray(models) then models.slice() else [models]
    models = _.difference(models, @models)
    super(models, options)

  getMaxCommentTime: ()->
    lastCommentTime = 0
    if @length
      for comment in @models
        createdAt = comment.get("added_at")
        if createdAt > lastCommentTime
          lastCommentTime = createdAt
    lastCommentTime

  getMinCommentTime: ()->
    firstCommentTime = new Date().getTime()
    for comment in @models
      createdAt = comment.get("added_at")
      if createdAt < firstCommentTime
        firstCommentTime = createdAt
    firstCommentTime

  url: ()->
    if not @isLoadHistory
      @uri.replace(":wall_id", @profileId).replace(":comment_time", @getMaxCommentTime()).replace(":timeline", "future")
    else
      @historyUrl()

  historyUrl: ()->
    @uri.replace(":wall_id", @profileId).replace(":comment_time", @getMinCommentTime()).replace(":timeline", "past")