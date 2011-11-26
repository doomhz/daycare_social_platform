(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.DayCare.ProfileGeneralInfoView = (function() {
    __extends(ProfileGeneralInfoView, Backbone.View);
    function ProfileGeneralInfoView() {
      ProfileGeneralInfoView.__super__.constructor.apply(this, arguments);
    }
    ProfileGeneralInfoView.prototype.tplUrl = '/templates/main/day_care/profile_general_info.html';
    ProfileGeneralInfoView.prototype.events = {
      'click #profile-general-info': 'goToEditProfile'
    };
    ProfileGeneralInfoView.prototype.router = null;
    ProfileGeneralInfoView.prototype.initialize = function(_arg) {
      this.router = _arg.router;
    };
    ProfileGeneralInfoView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          return $el.html(tpl({
            dayCare: that.model
          }));
        }
      });
    };
    ProfileGeneralInfoView;
    ProfileGeneralInfoView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind();
      return this;
    };
    ProfileGeneralInfoView.prototype.goToEditProfile = function(ev) {
      var editProfileUrl;
      editProfileUrl = $(ev.currentTarget).data('edit-url');
      return this.router.navigate(editProfileUrl, true);
    };
    return ProfileGeneralInfoView;
  })();
}).call(this);
