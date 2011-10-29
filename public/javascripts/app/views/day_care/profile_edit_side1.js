(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ProfileEditSide1View = (function() {
    __extends(ProfileEditSide1View, Backbone.View);
    function ProfileEditSide1View() {
      ProfileEditSide1View.__super__.constructor.apply(this, arguments);
    }
    ProfileEditSide1View.prototype.el = null;
    ProfileEditSide1View.prototype.tplUrl = '/templates/side1/day_care/edit.html';
    ProfileEditSide1View.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };
    ProfileEditSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            dayCare: that.model
          }));
        }
      });
      return this;
    };
    ProfileEditSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return ProfileEditSide1View;
  })();
}).call(this);
