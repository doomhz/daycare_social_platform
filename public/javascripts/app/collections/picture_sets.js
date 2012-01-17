(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.PictureSetsCollection = (function(_super) {

    __extends(PictureSetsCollection, _super);

    function PictureSetsCollection() {
      PictureSetsCollection.__super__.constructor.apply(this, arguments);
    }

    PictureSetsCollection.prototype.model = window.Kin.PictureSetModel;

    PictureSetsCollection.prototype.initialize = function() {};

    PictureSetsCollection.prototype.getPrimaryPicture = function(pictureSets) {
      var primarys, profileSet;
      profileSet = _.filter(pictureSets, function(pictureSet) {
        return pictureSet.type === "profile";
      });
      primarys = false;
      if (profileSet.length) {
        primarys = _.filter(profileSet[0].pictures, function(picture) {
          return picture.primary;
        });
        primarys = primarys.length ? primarys : profileSet[0].pictures;
      }
      return primarys[0];
    };

    return PictureSetsCollection;

  })(Backbone.Collection);

}).call(this);
