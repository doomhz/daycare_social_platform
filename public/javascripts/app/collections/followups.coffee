class Kin.FollowupsCollection extends Backbone.Collection

  model: Kin.CommentModel

  uri: "/followups/:comment_id/:comment_time"

  commentId: null

  loadCommentsTime: 3000

  intervalId: null

  initialize: (models, options = {})->
    window.fl = @
    @commentId = options.commentId

  startAutoUpdateFollowups: ()->
    @intervalId = window.setInterval(@loadFollowups, @loadCommentsTime)

  stopAutoUpdateFollowups: ()->
    window.clearInterval(@intervalId)

  loadFollowups: ()=>
    @fetch
      add: true

  getMaxCommentTime: ()->
    lastCommentTime = 0
    if @length
      for comment in @models
        createdAt = comment.get("added_at")
        if createdAt > lastCommentTime
          lastCommentTime = createdAt
    lastCommentTime

  url: ()->
    "#{@uri.replace(":comment_id", @commentId).replace(":comment_time", @getMaxCommentTime())}"