(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.ProfileModel = (function(_super) {

    __extends(ProfileModel, _super);

    function ProfileModel() {
      ProfileModel.__super__.constructor.apply(this, arguments);
    }

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
      var id;
      id = this.get('_id') || "";
      return this.uri.replace(/:profileId/g, id);
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

  })(Kin.UserModel);

}).call(this);
