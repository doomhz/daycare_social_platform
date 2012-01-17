(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.ProfileCollection = (function(_super) {

    __extends(ProfileCollection, _super);

    function ProfileCollection() {
      ProfileCollection.__super__.constructor.apply(this, arguments);
    }

    ProfileCollection.prototype.model = window.Kin.ProfileModel;

    ProfileCollection.prototype.initialize = function(models, options) {
      this.url = options && options.url;
      return this;
    };

    return ProfileCollection;

  })(Backbone.Collection);

}).call(this);
