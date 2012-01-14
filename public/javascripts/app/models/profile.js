(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.ProfileModel = (function() {
    __extends(ProfileModel, Kin.UserModel);
    function ProfileModel() {
      ProfileModel.__super__.constructor.apply(this, arguments);
    }
    ProfileModel.prototype.defaults = {
      _id: null,
      name: '',
      username: '',
      speaking_classes: [],
      address: '',
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
    ProfileModel.prototype.uri = "/profiles/:profileId";
    ProfileModel.prototype.pictureSets = null;
    ProfileModel.prototype.initialize = function(attributes, uri) {
      this.id = attributes._id;
      this.uri = uri || this.uri;
      _.bindAll(this, 'setPictureSets', 'updatePicturesFromPictureSets');
      this.setPictureSets();
      return this;
    };
    ProfileModel.prototype.url = function() {
      return this.uri.replace(/:profileId/g, this.get('_id'));
    };
    ProfileModel.prototype.getProfilePicture = function() {
      var profilePicture, profilePictureSet;
      profilePictureSet = this.getProfilePictureSet(this.get('picture_sets'));
      return profilePicture = this.getPrimaryPictureFromSet(profilePictureSet);
    };
    ProfileModel.prototype.getProfilePictureSet = function(pictureSets) {
      if (pictureSets == null) {
        pictureSets = this.get('picture_sets');
      }
      return this.getSetsByType(pictureSets, 'profile')[0];
    };
    ProfileModel.prototype.getPrimaryPictureFromSet = function(set) {
      if (set == null) {
        set = {
          pictures: []
        };
      }
      return $.grep(set.pictures, function(picture) {
        return picture.primary === true;
      })[0];
    };
    ProfileModel.prototype.getPublicSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'public');
    };
    ProfileModel.prototype.getDefaultSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'default');
    };
    ProfileModel.prototype.getSetsByType = function(pictureSets, type) {
      if (type == null) {
        type = 'default';
      }
      return $.grep(pictureSets, function(set) {
        return set.type === type;
      });
    };
    ProfileModel.prototype.setPictureSets = function() {
      if (!this.pictureSets) {
        this.pictureSets = new window.Kin.PictureSetsCollection();
        this.pictureSets.bind('add', this.updatePicturesFromPictureSets);
        this.pictureSets.bind('remove', this.updatePicturesFromPictureSets);
      }
      return this.pictureSets.reset(this.get('picture_sets'));
    };
    ProfileModel.prototype.updatePicturesFromPictureSets = function() {
      return this.set({
        picture_sets: this.pictureSets.toJSON()
      });
    };
    return ProfileModel;
  })();
}).call(this);
