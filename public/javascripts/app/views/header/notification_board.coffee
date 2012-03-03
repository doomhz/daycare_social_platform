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

    @socket.on "new-wall-posts-total", (data)->
      that.triggerChangeOnDelegates("new-wall-posts-total", data.total)
    @socket.on "last-wall-posts", (data)->
      that.triggerChangeOnDelegates("last-wall-posts", data.wall_posts)

    @socket.on "new-followups-total", (data)->
      that.triggerChangeOnDelegates("new-followups-total", data.total)
    @socket.on "last-followups", (data)->
      that.triggerChangeOnDelegates("last-followups", data.followups)

    @socket.on "new-requests-total", (data)->
      that.triggerChangeOnDelegates("new-requests-total", data.total)
    @socket.on "last-requests", (data)->
      that.triggerChangeOnDelegates("last-requests", data.requests)

    @socket.on "connect", (socket)->
      sessionId = that.socket.socket.sessionid

      that.socket.emit("get-new-messages-total", {user_id: that.currentUser.get("_id"), session_id: sessionId})
      that.socket.emit("get-last-messages", {user_id: that.currentUser.get("_id"), session_id: sessionId})

      that.socket.emit("get-new-wall-posts-total", {user_id: that.currentUser.get("_id"), session_id: sessionId})
      that.socket.emit("get-last-wall-posts", {user_id: that.currentUser.get("_id"), session_id: sessionId})

      that.socket.emit("get-new-followups-total", {user_id: that.currentUser.get("_id"), session_id: sessionId})
      that.socket.emit("get-last-followups", {user_id: that.currentUser.get("_id"), session_id: sessionId})

      that.socket.emit("get-new-requests-total", {user_id: that.currentUser.get("_id"), session_id: sessionId})
      that.socket.emit("get-last-requests", {user_id: that.currentUser.get("_id"), session_id: sessionId})

  triggerChangeOnDelegates: (attribute, value)->
    for delegate in @delegates
      delegate.trigger("change", attribute, value)
