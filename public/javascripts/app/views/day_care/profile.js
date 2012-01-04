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
    ProfileView.prototype.events = {
      "submit #add-comment-form": "addCommentHandler",
      "submit .add-followup-form": "addFollowupHandler"
    };
    ProfileView.prototype.maps = null;
    ProfileView.prototype.router = null;
    ProfileView.prototype.currentUser = null;
    ProfileView.prototype.profileGeneralInfo = null;
    ProfileView.prototype.renderProfileWall = true;
    ProfileView.prototype.initialize = function(_arg) {
      this.router = _arg.router, this.currentUser = _arg.currentUser;
      return this;
    };
    ProfileView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var canEdit;
          canEdit = that.currentUser.canEditDayCare(that.model.get('_id'));
          $(that.el).html(tpl({
            dayCare: that.model,
            canEdit: canEdit,
            currentUser: that.currentUser
          }));
          that.$('#profile-main-tabs').doomTabs({
            firstSelectedTab: 1,
            onSelect: function($selectedTab) {
              var mapCenterLat, mapCenterLng;
              if ($selectedTab.attr('id') === 'profile-view-on-map-tab' && !that.maps) {
                mapCenterLat = that.model.get('location').lat;
                mapCenterLng = that.model.get('location').lng;
                that.maps = new window.Kin.GoogleMapsView({
                  id: '#profile-address-maps',
                  mapsOptions: {
                    zoom: 16,
                    mapTypeId: 'google.maps.MapTypeId.ROADMAP',
                    center: "new google.maps.LatLng(" + mapCenterLat + ", " + mapCenterLng + ")"
                  }
                });
                that.maps.render();
                return that.addAddressMarker(mapCenterLat, mapCenterLng, that.model.get('name'));
              }
            }
          });
          if (!that.profileGeneralInfo) {
            that.profileGeneralInfo = new Kin.DayCare.ProfileGeneralInfoView({
              el: that.$('#profile-info-tab'),
              model: that.model,
              router: that.router,
              currentUser: that.currentUser
            });
          }
          that.profileGeneralInfo.render();
          that.$('#daycare-gallery-tabs').doomTabs({
            onSelect: function($selectedTab) {}
          });
          that.$('div.doom-carousel').doomCarousel({
            autoSlide: false,
            showCaption: false,
            slideSpeed: 400,
            showCounter: true
          });
          that.$('a[rel^="prettyPhoto"]').prettyPhoto({
            slideshow: false,
            social_tools: false,
            theme: 'light_rounded',
            deeplinking: false,
            animation_speed: 0
          });
          that.$("#add-comment-form textarea").autoResize({
            extraSpace: -4
          });
          if (that.renderProfileWall && !that.profileWall) {
            return that.profileWall = new Kin.DayCare.ProfileWallView({
              el: that.$('#wall-comments-list'),
              model: that.model,
              collection: new Kin.WallCommentsCollection([], {
                dayCareId: that.model.get("_id")
              }),
              router: that.router,
              currentUser: that.currentUser
            });
          }
        }
      });
      return this;
    };
    ProfileView.prototype.remove = function() {
      if (this.maps) {
        this.maps.remove();
      }
      this.unbind();
      $(this.el).unbind().empty();
      if (this.profileGeneralInfo) {
        this.profileGeneralInfo.remove();
      }
      if (this.profileWall) {
        this.profileWall.remove();
      }
      return this;
    };
    ProfileView.prototype.addAddressMarker = function(lat, lng, name) {
      return this.addressMarker = this.maps.addMarker(lat, lng, name, false);
    };
    ProfileView.prototype.addCommentHandler = function(ev) {
      var $form;
      ev.preventDefault();
      $form = this.$(ev.target);
      this.sendCommentFromForm($form);
      return $form.find("textarea").val("").keyup();
    };
    ProfileView.prototype.addFollowupHandler = function(ev) {
      var $form;
      ev.preventDefault();
      $form = this.$(ev.target);
      this.sendCommentFromForm($form);
      return $form.find("textarea").val("").keyup();
    };
    ProfileView.prototype.sendCommentFromForm = function($form) {
      var comment, commentData, that;
      that = this;
      commentData = $form.serialize();
      comment = new Kin.CommentModel({
        wall_id: this.model.get("_id")
      });
      return comment.save(null, {
        data: commentData,
        success: function() {
          return that.profileWall.collection.loadComments();
        }
      });
    };
    return ProfileView;
  })();
}).call(this);
