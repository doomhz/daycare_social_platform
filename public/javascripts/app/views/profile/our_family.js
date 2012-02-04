(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.Profile.OurFamilyView = (function(_super) {

    __extends(OurFamilyView, _super);

    function OurFamilyView() {
      OurFamilyView.__super__.constructor.apply(this, arguments);
    }

    OurFamilyView.prototype.model = null;

    OurFamilyView.prototype.el = null;

    OurFamilyView.prototype.tplUrl = '/templates/main/profile/our_family.html';

    OurFamilyView.prototype.parentsList = null;

    OurFamilyView.prototype.profileGeneralInfo = null;

    OurFamilyView.prototype.currentUser = null;

    OurFamilyView.prototype.router = null;

    OurFamilyView.prototype.events = {
      "keyup #our-family-name-filter": "filterNamesHandler",
      "click #our-family-name-filter-bt": "filterNamesHandler",
      "change #our-family-type-filter": "filterNamesHandler"
    };

    OurFamilyView.prototype.initialize = function(options) {
      this.currentUser = options.currentUser;
      return this.router = options.router;
    };

    OurFamilyView.prototype.render = function() {
      var that;
      that = this;
      return $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el, $parentsListGroup, canEdit;
          $el = $(that.el);
          $el.html(tpl());
          canEdit = that.currentUser.canEditProfile(that.model.get('_id'));
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
          $parentsListGroup = $el.find("#our-family-list-cnt");
          that.parentsList = new Kin.Profile.OurFamilyListView({
            el: $parentsListGroup,
            model: that.model
          });
          that.parentsList.render();
          if (!that.profileGeneralInfo) {
            that.profileGeneralInfo = new Kin.Profile.ProfileGeneralInfoView({
              el: that.$('#profile-info-tab'),
              model: that.model,
              router: that.router,
              currentUser: that.currentUser,
              canEdit: canEdit
            });
          }
          that.profileGeneralInfo.render();
          that.$('#profile-gallery-tabs').doomTabs({
            onSelect: function($selectedTab) {}
          });
          that.$('div.doom-carousel').doomCarousel({
            autoSlide: false,
            showCaption: false,
            slideSpeed: 400,
            showCounter: true
          });
          return that.$('a[rel^="prettyPhoto"]').prettyPhoto({
            slideshow: false,
            social_tools: false,
            theme: 'light_rounded',
            deeplinking: false,
            animation_speed: 0
          });
        }
      });
    };

    OurFamilyView.prototype.filterNamesHandler = function(ev) {
      var textToFind, typeToFind;
      textToFind = $("#our-family-name-filter").val().toLowerCase().trim();
      typeToFind = $("#our-family-type-filter").val();
      return this.parentsList.findByNameAndType(textToFind, typeToFind);
    };

    OurFamilyView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };

    return OurFamilyView;

  })(Kin.Profile.ProfileView);

}).call(this);
