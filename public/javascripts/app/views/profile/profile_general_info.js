(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Profile.ProfileGeneralInfoView = (function(_super) {

    __extends(ProfileGeneralInfoView, _super);

    function ProfileGeneralInfoView() {
      this.goToEditProfile = __bind(this.goToEditProfile, this);
      ProfileGeneralInfoView.__super__.constructor.apply(this, arguments);
    }

    ProfileGeneralInfoView.prototype.tplUrl = {
      daycare: '/templates/main/day_care/profile_general_info.html',
      parent: '/templates/main/parent/profile_general_info.html',
      staff: '/templates/main/staff/profile_general_info.html',
      "class": '/templates/main/class/profile_general_info.html'
    };

    ProfileGeneralInfoView.prototype.router = null;

    ProfileGeneralInfoView.prototype.currentUser = null;

    ProfileGeneralInfoView.prototype.initialize = function(_arg) {
      this.router = _arg.router, this.currentUser = _arg.currentUser;
    };

    ProfileGeneralInfoView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl[this.model.get("type")],
        onLoad: function(tpl) {
          var $el, canEdit;
          $el = $(that.el);
          canEdit = that.currentUser.canEditProfile(that.model.get('_id'));
          $el.html(tpl({
            profile: that.model,
            canEdit: canEdit
          }));
          if (canEdit) {
            return that.$("#profile-general-info").bind("click", that.goToEditProfile);
          }
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

  })(Backbone.View);

}).call(this);
