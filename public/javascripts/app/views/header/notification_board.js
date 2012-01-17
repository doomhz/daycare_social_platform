(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Header.NotificationBoardView = (function(_super) {

    __extends(NotificationBoardView, _super);

    function NotificationBoardView() {
      NotificationBoardView.__super__.constructor.apply(this, arguments);
    }

    NotificationBoardView.prototype.el = null;

    NotificationBoardView.prototype.currentUser = null;

    NotificationBoardView.prototype.socket = null;

    NotificationBoardView.prototype.socketUrl = "http://" + window.location.hostname + "/user-notifications";

    NotificationBoardView.prototype.delegates = [];

    NotificationBoardView.prototype.initialize = function(_arg) {
      this.currentUser = _arg.currentUser;
    };

    NotificationBoardView.prototype.addDelegate = function(delegate) {
      return this.delegates.push(delegate);
    };

    NotificationBoardView.prototype.removeDelegate = function(delegate) {
      return this.delegates = _.filter(this.delegates, function(obj) {
        return obj === delegate;
      });
    };

    NotificationBoardView.prototype.watch = function() {
      var that;
      that = this;
      this.socket = window.io.connect(this.socketUrl);
      this.socket.on("new-messages-total", function(data) {
        return that.triggerChangeOnDelegates("new-messages-total", data.total);
      });
      this.socket.on("last-messages", function(data) {
        return that.triggerChangeOnDelegates("last-messages", data.messages);
      });
      this.socket.on("new-wall-posts-total", function(data) {
        return that.triggerChangeOnDelegates("new-wall-posts-total", data.total);
      });
      this.socket.on("last-wall-posts", function(data) {
        return that.triggerChangeOnDelegates("last-wall-posts", data.wall_posts);
      });
      this.socket.on("new-followups-total", function(data) {
        return that.triggerChangeOnDelegates("new-followups-total", data.total);
      });
      this.socket.on("last-followups", function(data) {
        return that.triggerChangeOnDelegates("last-followups", data.followups);
      });
      return this.socket.on("connect", function(socket) {
        var sessionId;
        sessionId = that.socket.socket.sessionid;
        that.socket.emit("get-new-messages-total", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
        that.socket.emit("get-last-messages", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
        that.socket.emit("get-new-wall-posts-total", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
        that.socket.emit("get-last-wall-posts", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
        that.socket.emit("get-new-followups-total", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
        return that.socket.emit("get-last-followups", {
          user_id: that.currentUser.get("_id"),
          session_id: sessionId
        });
      });
    };

    NotificationBoardView.prototype.triggerChangeOnDelegates = function(attribute, value) {
      var delegate, _i, _len, _ref, _results;
      _ref = this.delegates;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        delegate = _ref[_i];
        _results.push(delegate.trigger("change", attribute, value));
      }
      return _results;
    };

    return NotificationBoardView;

  })(Backbone.View);

}).call(this);
