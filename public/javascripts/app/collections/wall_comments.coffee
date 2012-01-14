class Kin.WallCommentsCollection extends Backbone.Collection

  model: Kin.CommentModel

  profileId: null

  intervalId: null

  loadCommentsTime: 3000

  lastQueryTime: 0

  uri: "/comments/:wall_id/:last_query_time"

  initialize: (models, {@profileId})->
    @startAutoUpdateComments()

  startAutoUpdateComments: ()->
    that = @
    @intervalId = window.setInterval(@loadComments, @loadCommentsTime)

  stopAutoUpdateComments: ()->
    window.clearInterval(@intervalId)

  loadComments: ()=>
    @fetch
      add: true
      success: (comments)=>
        if comments.length
          lastCommentTime = 0
          for comment in comments.models
            createdAt = new Date(comment.get("created_at")).getTime()
            if createdAt > lastCommentTime
              lastCommentTime = createdAt
          @lastQueryTime = lastCommentTime

  url: ()->
    @uri.replace(":wall_id", @profileId).replace(":last_query_time", @lastQueryTime)
