(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.ProfileEditSide1View = (function(_super) {

    __extends(ProfileEditSide1View, _super);

    function ProfileEditSide1View() {
      ProfileEditSide1View.__super__.constructor.apply(this, arguments);
    }

    ProfileEditSide1View.prototype.el = null;

    ProfileEditSide1View.prototype.tplUrl = {
      daycare: '/templates/side1/day_care/edit.html',
      parent: '/templates/side1/parent/edit.html',
      staff: '/templates/side1/staff/edit.html',
      "class": '/templates/side1/class/edit.html'
    };

    ProfileEditSide1View.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };

    ProfileEditSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl[this.model.get("type")],
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            profile: that.model
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

  })(Kin.Profile.ProfileSide1View);

}).call(this);
