(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ProfileView = (function() {
    __extends(ProfileView, Backbone.View);
    function ProfileView() {
      ProfileView.__super__.constructor.apply(this, arguments);
    }
    ProfileView.prototype.el = null;
    ProfileView.prototype.tplUrl = '/templates/main/day_care/profile.html';
    ProfileView.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };
    ProfileView.prototype.render = function() {
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
    ProfileView.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return ProfileView;
  })();
}).call(this);
