(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.Messages.InboxView = (function() {
    __extends(InboxView, Backbone.View);
    function InboxView() {
      InboxView.__super__.constructor.apply(this, arguments);
    }
    InboxView.prototype.el = null;
    InboxView.prototype.tplUrl = '/templates/main/messages/inbox.html';
    InboxView.prototype.initialize = function() {};
    InboxView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl());
        }
      });
    };
    InboxView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };
    return InboxView;
  })();
}).call(this);
