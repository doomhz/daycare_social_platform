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
      pictures: [],
      profile_id: null
    };
    PictureSetModel.prototype.uri = '/profiles/picture-set/:pictureSetId';
    PictureSetModel.prototype.pictures = null;
    PictureSetModel.prototype.initialize = function(attributes) {
      this.id = attributes._id;
      this.setPictures();
      this.bind('change', this.setPictures);
      return this;
    };
    PictureSetModel.prototype.url = function() {
      var pictureSetId;
      pictureSetId = this.get('_id') || '';
      return this.uri.replace(/:pictureSetId/g, pictureSetId);
    };
    PictureSetModel.prototype.setPictures = function() {
      this.pictures || (this.pictures = new Kin.PicturesCollection([], {
        pictureSetId: this.get('_id')
      }));
      return this.pictures.add(this.get('pictures'));
    };
    return PictureSetModel;
  })();
}).call(this);
