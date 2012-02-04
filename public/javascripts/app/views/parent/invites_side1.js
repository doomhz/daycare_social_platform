(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Parent.InvitesSide1View = (function(_super) {

    __extends(InvitesSide1View, _super);

    function InvitesSide1View() {
      InvitesSide1View.__super__.constructor.apply(this, arguments);
    }

    InvitesSide1View.prototype.el = null;

    InvitesSide1View.prototype.tplUrl = '/templates/side1/parent/invites.html';

    InvitesSide1View.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };

    InvitesSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            profile: that.model
          }));
        }
      });
      return this;
    };

    InvitesSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };

    return InvitesSide1View;

  })(Backbone.View);

}).call(this);
