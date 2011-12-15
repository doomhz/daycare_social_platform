(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.Messages.ListItemView = (function() {
    __extends(ListItemView, Backbone.View);
    function ListItemView() {
      ListItemView.__super__.constructor.apply(this, arguments);
    }
    ListItemView.prototype.tagName = 'li';
    ListItemView.prototype.tplUrl = '/templates/main/messages/list_item.html';
    ListItemView.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };
    ListItemView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            message: that.model
          }));
        }
      });
      return this;
    };
    return ListItemView;
  })();
}).call(this);
