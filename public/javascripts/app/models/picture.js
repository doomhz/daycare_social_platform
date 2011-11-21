(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.PictureModel = (function() {
    __extends(PictureModel, Backbone.Model);
    function PictureModel() {
      PictureModel.__super__.constructor.apply(this, arguments);
    }
    PictureModel.prototype.defaults = {
      primary: false,
      description: null,
      url: null,
      thumb_url: null,
      medium_url: null
    };
    PictureModel.prototype.uri = '/day-cares/picture/:pictureId';
    PictureModel.prototype.initialize = function(attributes) {
      return this.id = attributes._id;
    };
    PictureModel.prototype.url = function() {
      return this.uri.replace(/:pictureId/g, this.get('_id'));
    };
    return PictureModel;
  })();
}).call(this);
