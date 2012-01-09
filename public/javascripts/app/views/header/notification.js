(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.Header.NotificationView = (function() {
    __extends(NotificationView, Kin.Header.SubmenuView);
    function NotificationView() {
      NotificationView.__super__.constructor.apply(this, arguments);
    }
    NotificationView.prototype.el = null;
    NotificationView.prototype.tplUrl = '/templates/main/header/notification.html';
    NotificationView.prototype.indicatorId = null;
    NotificationView.prototype.listId = null;
    NotificationView.prototype.listItems = null;
    NotificationView.prototype.submenuSelector = "ul.notification-list";
    NotificationView.prototype.doNotClose = false;
    NotificationView.prototype.initialize = function(_arg) {
      this.indicatorId = _arg.indicatorId, this.listId = _arg.listId, this.onShowUrl = _arg.onShowUrl;
      this.bind("change", this.changeHandler);
      this.bind("click:window", this.windowClickHandler);
      return this.$("a:first").bind("click", this.menuButtonClickHandler);
    };
    NotificationView.prototype.changeHandler = function(attribute, value) {
      if (attribute === this.indicatorId) {
        this.updateIndicator(value);
      }
      if (attribute === this.listId) {
        return this.updateList(value);
      }
    };
    NotificationView.prototype.updateIndicator = function(total) {
      var $indicator;
      $indicator = this.$("#" + this.indicatorId);
      $indicator.text(total);
      if (total) {
        return $indicator.removeClass("hidden");
      } else {
        return $indicator.addClass("hidden");
      }
    };
    NotificationView.prototype.updateList = function(value) {
      this.listItems = value;
      return this.render();
    };
    NotificationView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = that.$("#" + that.listId);
          return $el.html(tpl({
            listItems: that.listItems,
            listId: that.listId
          }));
        }
      });
    };
    return NotificationView;
  })();
}).call(this);
