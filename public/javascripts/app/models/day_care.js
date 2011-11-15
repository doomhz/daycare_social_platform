(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCareModel = (function() {
    __extends(DayCareModel, Backbone.Model);
    function DayCareModel() {
      DayCareModel.__super__.constructor.apply(this, arguments);
    }
    DayCareModel.prototype.defaults = {
      _id: null,
      name: '',
      speaking_classes: [],
      location: {
        lat: 10,
        lng: 40
      },
      email: '',
      phone: '',
      contact_person: '',
      licensed: false,
      type: 'daycare',
      opened_since: '',
      open_door_policy: false,
      serving_disabilities: false,
      picture_sets: []
    };
    DayCareModel.prototype.uri = "/day-cares/load";
    DayCareModel.prototype.initialize = function(options, uri) {
      this.uri = uri || this.uri;
      this.id = this.get('_id') || this.id;
      return this;
    };
    DayCareModel.prototype.url = function() {
      return "" + this.uri + "/" + this.id;
    };
    DayCareModel.prototype.getProfilePicture = function() {
      var profilePicture, profilePictureSet;
      profilePictureSet = this.getProfilePictureSet(this.get('picture_sets'));
      return profilePicture = this.getPrimaryPictureFromSet(profilePictureSet);
    };
    DayCareModel.prototype.getProfilePictureSet = function(pictureSets) {
      return this.getSetsByType(pictureSets, 'profile')[0];
    };
    DayCareModel.prototype.getPrimaryPictureFromSet = function(set) {
      if (set == null) {
        set = {
          pictures: []
        };
      }
      return $.grep(set.pictures, function(picture) {
        return picture.primary === true;
      })[0];
    };
    DayCareModel.prototype.getDaycareSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'daycare');
    };
    DayCareModel.prototype.getDefaultSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'default');
    };
    DayCareModel.prototype.getSetsByType = function(pictureSets, type) {
      if (type == null) {
        type = 'default';
      }
      return $.grep(pictureSets, function(set) {
        return set.type === type;
      });
    };
    return DayCareModel;
  })();
}).call(this);
