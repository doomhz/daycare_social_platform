(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.NotificationsView = (function(_super) {

    __extends(NotificationsView, _super);

    function NotificationsView() {
      this.addNotificationHandler = __bind(this.addNotificationHandler, this);
      NotificationsView.__super__.constructor.apply(this, arguments);
    }

    NotificationsView.prototype.el = null;

    NotificationsView.prototype.tplUrl = "/templates/main/profile/notifications.html";

    NotificationsView.prototype.itemTplUrl = "/templates/main/profile/notification_item.html";

    NotificationsView.prototype.events = {
      "click #load-more-notifications-cnt": "loadMoreNotificationsHandler"
    };

    NotificationsView.prototype.initialize = function() {
      return this.collection.bind("add", this.addNotificationHandler);
    };

    NotificationsView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          $(that.el).html(tpl());
          return $.tmpload({
            url: that.itemTplUrl,
            onLoad: function() {
              return that.collection.fetch({
                add: true
              });
            }
          });
        }
      });
    };

    NotificationsView.prototype.addNotificationHandler = function(model) {
      var that, tpl;
      that = this;
      tpl = $.tmpload({
        url: this.itemTplUrl
      });
      return that.$("#notifications-list").append(tpl({
        item: model
      }));
    };

    NotificationsView.prototype.loadMoreNotificationsHandler = function(ev) {
      ev.preventDefault();
      return this.collection.fetch({
        add: true
      });
    };

    NotificationsView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return NotificationsView;

  })(Backbone.View);

}).call(this);
