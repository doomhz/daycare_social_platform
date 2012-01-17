(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Messages.InboxSide1View = (function(_super) {

    __extends(InboxSide1View, _super);

    function InboxSide1View() {
      InboxSide1View.__super__.constructor.apply(this, arguments);
    }

    InboxSide1View.prototype.el = null;

    InboxSide1View.prototype.tplUrl = '/templates/side1/messages/inbox.html';

    InboxSide1View.prototype.selectedMenuItem = null;

    InboxSide1View.prototype.initialize = function(_arg) {
      this.selectedMenuItem = _arg.selectedMenuItem;
      return this.model && (this.model.view = this);
    };

    InboxSide1View.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            selectedMenuItem: that.selectedMenuItem
          }));
        }
      });
    };

    InboxSide1View.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return InboxSide1View;

  })(Backbone.View);

}).call(this);
