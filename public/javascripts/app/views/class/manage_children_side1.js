(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Class.ManageChildrenSide1View = (function(_super) {

    __extends(ManageChildrenSide1View, _super);

    function ManageChildrenSide1View() {
      ManageChildrenSide1View.__super__.constructor.apply(this, arguments);
    }

    ManageChildrenSide1View.prototype.el = null;

    ManageChildrenSide1View.prototype.tplUrl = '/templates/side1/class/manage_children.html';

    ManageChildrenSide1View.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };

    ManageChildrenSide1View.prototype.render = function() {
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

    ManageChildrenSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };

    return ManageChildrenSide1View;

  })(Backbone.View);

}).call(this);
