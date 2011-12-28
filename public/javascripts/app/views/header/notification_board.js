(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Header.NotificationBoardView = (function() {
    __extends(NotificationBoardView, Backbone.View);
    function NotificationBoardView() {
      NotificationBoardView.__super__.constructor.apply(this, arguments);
    }
    NotificationBoardView.prototype.el = null;
    NotificationBoardView.prototype.currentUser = null;
    NotificationBoardView.prototype.socket = null;
    NotificationBoardView.prototype.socketUrl = "http://" + window.location.hostname + "/user-notifications";
    NotificationBoardView.prototype.initialize = function(_arg) {
      this.currentUser = _arg.currentUser;
    };
    NotificationBoardView.prototype.watch = function() {
      var that;
      that = this;
      this.socket = window.io.connect(this.socketUrl);
      this.socket.on("new-messages-total", function(data) {
        $.l(data);
        return that.updateNewMessagesIndicator(data.total);
      });
      this.socket.on("last-messages", function(data) {
        return $.l(data);
      });
      this.socket.emit("get-new-messages-total", {
        user_id: that.currentUser.get("_id")
      });
      return this.socket.emit("get-last-messages", {
        user_id: that.currentUser.get("_id")
      });
    };
    NotificationBoardView.prototype.updateNewMessagesIndicator = function(total) {
      return this.$("#new-messages-indicator").text(total);
    };
    return NotificationBoardView;
  })();
}).call(this);
