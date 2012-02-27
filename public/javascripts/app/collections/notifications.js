(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.NotificationsCollection = (function(_super) {

    __extends(NotificationsCollection, _super);

    function NotificationsCollection() {
      NotificationsCollection.__super__.constructor.apply(this, arguments);
    }

    NotificationsCollection.prototype.model = window.Kin.NotificationModel;

    NotificationsCollection.prototype.uri = "/notifications/:max_time";

    NotificationsCollection.prototype.userId = null;

    NotificationsCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      return this.url = options.url || this.url;
    };

    NotificationsCollection.prototype.getMinTime = function() {
      var createdAt, minTime, notification, _i, _len, _ref;
      minTime = new Date().getTime();
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        createdAt = new Date(notification.get("created_at")).getTime();
        if (createdAt < minTime) minTime = createdAt;
      }
      return minTime;
    };

    NotificationsCollection.prototype.url = function() {
      return "" + (this.uri.replace(":max_time", this.getMinTime()));
    };

    return NotificationsCollection;

  })(Backbone.Collection);

}).call(this);
