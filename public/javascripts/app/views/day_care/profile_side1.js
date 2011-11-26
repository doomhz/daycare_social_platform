(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ProfileSide1View = (function() {
    __extends(ProfileSide1View, Backbone.View);
    function ProfileSide1View() {
      ProfileSide1View.__super__.constructor.apply(this, arguments);
    }
    ProfileSide1View.prototype.el = null;
    ProfileSide1View.prototype.tplUrl = '/templates/side1/day_care/profile.html';
    ProfileSide1View.prototype.selectedMenuItem = null;
    ProfileSide1View.prototype.initialize = function(_arg) {
      this.selectedMenuItem = _arg.selectedMenuItem;
      this.model && (this.model.view = this);
      return this;
    };
    ProfileSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            dayCare: that.model,
            selectedMenuItem: that.selectedMenuItem
          }));
        }
      });
      return this;
    };
    ProfileSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return ProfileSide1View;
  })();
}).call(this);
