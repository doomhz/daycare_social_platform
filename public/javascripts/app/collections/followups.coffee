class Kin.FollowupsCollection extends Backbone.Collection

  model: Kin.CommentModel

  uri: "/followups/:comment_id/:comment_time/:timeline"

  commentId: null

  loadCommentsTime: 30000

  isLoadHistory: false

  intervalId: null

  initialize: (models, options = {})->
    @commentId = options.commentId

  startAutoUpdateFollowups: ()->
    @intervalId = window.setInterval(@loadFollowups, @loadCommentsTime)

  stopAutoUpdateFollowups: ()->
    window.clearInterval(@intervalId)

  loadFollowups: (options)=>
    options ?=
      isHistory: false
    @isLoadHistory = options.isHistory
    @fetch
      add: true
      success: options.success
    @isLoadHistory = false

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
      @uri.replace(":comment_id", @commentId).replace(":comment_time", @getMaxCommentTime()).replace(":timeline", "future")
    else
      @historyUrl()

  historyUrl: ()->
    @uri.replace(":comment_id", @commentId).replace(":comment_time", @getMinCommentTime()).replace(":timeline", "past")
