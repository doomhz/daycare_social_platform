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
      user_id: null,
      name: '',
      speaking_classes: [],
      location: {
        lat: 10,
        lng: 40
      },
      email: '',
      phone: '',
      fax: '',
      contact_person: '',
      licensed: false,
      license_number: '',
      type: 'daycare',
      opened_since: '',
      open_door_policy: false,
      serving_disabilities: false,
      picture_sets: []
    };
    DayCareModel.prototype.uri = "/day-cares/:dayCareId";
    DayCareModel.prototype.pictureSets = null;
    DayCareModel.prototype.initialize = function(attributes, uri) {
      this.id = attributes._id;
      this.uri = uri || this.uri;
      _.bindAll(this, 'setPictureSets', 'updatePicturesFromPictureSets');
      this.setPictureSets();
      return this;
    };
    DayCareModel.prototype.url = function() {
      return this.uri.replace(/:dayCareId/g, this.get('_id'));
    };
    DayCareModel.prototype.getProfilePicture = function() {
      var profilePicture, profilePictureSet;
      profilePictureSet = this.getProfilePictureSet(this.get('picture_sets'));
      return profilePicture = this.getPrimaryPictureFromSet(profilePictureSet);
    };
    DayCareModel.prototype.getProfilePictureSet = function(pictureSets) {
      if (pictureSets == null) {
        pictureSets = this.get('picture_sets');
      }
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
    DayCareModel.prototype.setPictureSets = function() {
      if (!this.pictureSets) {
        this.pictureSets = new window.Kin.PictureSetsCollection();
        this.pictureSets.bind('add', this.updatePicturesFromPictureSets);
        this.pictureSets.bind('remove', this.updatePicturesFromPictureSets);
      }
      return this.pictureSets.reset(this.get('picture_sets'));
    };
    DayCareModel.prototype.updatePicturesFromPictureSets = function() {
      return this.set({
        picture_sets: this.pictureSets.toJSON()
      });
    };
    return DayCareModel;
  })();
}).call(this);
