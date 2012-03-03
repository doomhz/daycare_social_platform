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

    NotificationsView.prototype.tplUrl = {
      alert: "/templates/main/profile/notifications.html",
      feed: "/templates/main/profile/feeds.html",
      request: "/templates/main/profile/requests.html"
    };

    NotificationsView.prototype.itemTplUrl = "/templates/main/profile/notification_item.html";

    NotificationsView.prototype.dateTplUrl = "/templates/main/profile/notification_date.html";

    NotificationsView.prototype.events = {
      "click #load-more-notifications-cnt": "loadMoreNotificationsHandler"
    };

    NotificationsView.prototype.type = "alert";

    NotificationsView.prototype.lastDisplayedDay = null;

    NotificationsView.prototype.initialize = function(options) {
      if (options == null) options = {};
      this.type = options.type || this.type;
      return this.collection.bind("add", this.addNotificationHandler);
    };

    NotificationsView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl[this.type],
        onLoad: function(tpl) {
          $(that.el).html(tpl());
          return $.tmpload({
            url: that.itemTplUrl,
            onLoad: function() {
              return $.tmpload({
                url: that.dateTplUrl,
                onLoad: function() {
                  return that.collection.fetch({
                    add: true
                  });
                }
              });
            }
          });
        }
      });
    };

    NotificationsView.prototype.addNotificationHandler = function(model) {
      var itemTpl, notificationDate, that;
      that = this;
      itemTpl = $.tmpload({
        url: this.itemTplUrl
      });
      notificationDate = new Date(model.get("created_at"));
      if (this.isAnotherDay(notificationDate)) this.renderDate(notificationDate);
      return that.$("#notifications-list").append(itemTpl({
        item: model
      }));
    };

    NotificationsView.prototype.loadMoreNotificationsHandler = function(ev) {
      ev.preventDefault();
      return this.collection.fetch({
        add: true
      });
    };

    NotificationsView.prototype.isAnotherDay = function(notificationDate) {
      return this.parseDate(notificationDate) !== this.lastDisplayedDay;
    };

    NotificationsView.prototype.renderDate = function(notificationDate) {
      var dateTpl, that;
      that = this;
      dateTpl = $.tmpload({
        url: this.dateTplUrl
      });
      that.$("#notifications-list").append(dateTpl({
        date: notificationDate
      }));
      return this.lastDisplayedDay = this.parseDate(notificationDate);
    };

    NotificationsView.prototype.parseDate = function(date) {
      return "" + (date.getYear()) + (date.getMonth()) + (date.getDay());
    };

    NotificationsView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return NotificationsView;

  })(Backbone.View);

}).call(this);
