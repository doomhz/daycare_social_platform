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
      that.updateNewMessagesIndicator(data.total)
    @socket.on "last-messages", (data)->
      $.l data
    @socket.emit("get-new-messages-total", {user_id: that.currentUser.get("_id")})
    @socket.emit("get-last-messages", {user_id: that.currentUser.get("_id")})

  updateNewMessagesIndicator: (total)->
    @$("#new-messages-indicator").text(total)