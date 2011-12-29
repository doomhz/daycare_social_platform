class Kin.Header.NotificationBoardView extends Backbone.View

  el: null
  
  currentUser: null
  
  socket: null
  
  socketUrl: "http://#{window.location.hostname}/user-notifications"
  
  delegates: []

  initialize: ({@currentUser})->
  
  addDelegate: (delegate)->
    @delegates.push(delegate)
  
  removeDelegate: (delegate)->
    @delegates = _.filter @delegates, (obj)->
      obj is delegate

  watch: ()->
    that = @
    @socket = window.io.connect(@socketUrl)
    @socket.on "new-messages-total", (data)->
      that.triggerChangeOnDelegates("new-messages-total", data.total)
    @socket.on "last-messages", (data)->
      that.triggerChangeOnDelegates("last-messages", data.messages)
    @socket.emit("get-new-messages-total", {user_id: that.currentUser.get("_id")})
    @socket.emit("get-last-messages", {user_id: that.currentUser.get("_id")})

  triggerChangeOnDelegates: (attribute, value)->
    for delegate in @delegates
      delegate.trigger("change", attribute, value)
