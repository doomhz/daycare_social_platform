class Kin.WallCommentsCollection extends Backbone.Collection

  model: Kin.CommentModel
  
  dayCareId: null
  
  intervalId: null
  
  loadCommentsTime: 3000
  
  lastQueryTime: 0
  
  uri: "/comments/:wall_id/:last_query_time"

  initialize: (models, {@dayCareId})->
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
        @lastQueryTime = new Date().getTime()

  url: ()->
    @uri.replace(":wall_id", @dayCareId).replace(":last_query_time", @lastQueryTime)
