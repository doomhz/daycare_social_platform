(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Header.ProfileInfoView = (function(_super) {

    __extends(ProfileInfoView, _super);

    function ProfileInfoView() {
      ProfileInfoView.__super__.constructor.apply(this, arguments);
    }

    ProfileInfoView.prototype.model = null;

    ProfileInfoView.prototype.daycaresListTplUrl = '/templates/main/header/my_daycares_list.html';

    ProfileInfoView.prototype.listId = "my-daycares-list";

    ProfileInfoView.prototype.initialize = function() {
      ProfileInfoView.__super__.initialize.call(this);
      this.bind("change", this.currentUserChangeHandler);
      this.updateProfilePicture();
      this.updateProfileUrls();
      return this.renderDaycaresList();
    };

    ProfileInfoView.prototype.currentUserChangeHandler = function(attribute, value) {
      if (attribute === "picture_sets") this.updateProfilePicture();
      if (attribute === "daycare_friends") return this.renderDaycaresList();
    };

    ProfileInfoView.prototype.updateProfilePicture = function() {
      var profilePicture;
      profilePicture = this.model.getProfilePicture();
      if (profilePicture) {
        return this.$("#my-profile-thumb").attr("src", this.model.getProfilePicture().thumb_url);
      }
    };

    ProfileInfoView.prototype.updateProfileUrls = function() {
      var $url, href, urlId, urlIds, _i, _len, _results;
      urlIds = ["#my-profile-view-url", "#my-profile-edit-url"];
      _results = [];
      for (_i = 0, _len = urlIds.length; _i < _len; _i++) {
        urlId = urlIds[_i];
        $url = this.$(urlId);
        href = $url.attr("href").replace(":id", this.model.get("_id"));
        _results.push($url.attr("href", href));
      }
      return _results;
    };

    ProfileInfoView.prototype.renderDaycaresList = function() {
      var daycares, that;
      that = this;
      daycares = this.model.get("daycare_friends");
      return $.tmpload({
        url: this.daycaresListTplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = that.$("#" + that.listId);
          return $el.html(tpl({
            daycares: daycares
          }));
        }
      });
    };

    return ProfileInfoView;

  })(Kin.Header.SubmenuView);

}).call(this);
