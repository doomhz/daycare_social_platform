class Kin.WallCommentsCollection extends Backbone.Collection

  model: Kin.CommentModel
  
  dayCareId: null
  
  socket: null
  
  socketUrl: "http://#{window.location.hostname}/day-cares-wall-comments"

  initialize: (models, {@dayCareId})->
    @startAutoUpdateComments()
  
  startAutoUpdateComments: ()->
    that = @
    @socket = window.io.connect(@socketUrl)
    # @socket.on "connect", ()->
    @socket.on "new-wall-comments", (data)->
      if data.wall_id 
        if data.wall_id is that.dayCareId
          that.add(data.comments)
      else
        that.addAll(data.comments)
    @socket.emit("get-new-comments", {wall_id: that.dayCareId})

  stopAutoUpdateComments: ()->
    # @socket.emit("disconnect")
    # @socket.disconnect()

  addAll: (comments)->
    that = @
    loaderModel = new Kin.DayCare.WallCommentView()
    loaderModel.deferOnTemplateLoad(
      ()->
        for comment in comments
          that.add(comment)
    )