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
          var $el, $parentsListGroup;
          $el = $(that.el);
          $el.html(tpl({
            profile: that.model
          }));
          $parentsListGroup = $el.find("#our-family-list-cnt");
          that.parentsList = new Kin.Profile.OurFamilyListView({
            el: $parentsListGroup,
            model: that.model
          });
          return that.parentsList.render();
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

  })(Backbone.View);

}).call(this);
