class Kin.Header.NotificationBoardView extends Backbone.View

  el: null
  
  currentUser: null
  
  socket: null
  
  socketUrl: "http://#{window.location.hostname}/user-notifications"

  initialize: ({@currentUser})->
    
  watch: ()->
    that = @
    @socket = window.io.connect(@socketUrl)
    @socket.on "new-messages-total", (data)->
      $.l data
    @socket.emit("get-new-messages-total", {user_id: that.currentUser.get("_id")})
    window.s = @socket
