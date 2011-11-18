(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.PictureSetModel = (function() {
    __extends(PictureSetModel, Backbone.Model);
    function PictureSetModel() {
      PictureSetModel.__super__.constructor.apply(this, arguments);
    }
    PictureSetModel.prototype.defaults = {
      name: null,
      description: null,
      type: 'default',
      pictures: []
    };
    PictureSetModel.prototype.pictures = null;
    PictureSetModel.prototype.initialize = function(pictureSet) {
      if (pictureSet == null) {
        pictureSet = [];
      }
      return this.pictures = new Kin.PicturesCollection(pictureSet.pictures);
    };
    return PictureSetModel;
  })();
}).call(this);
