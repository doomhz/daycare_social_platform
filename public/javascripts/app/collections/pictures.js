(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.PicturesCollection = (function() {
    __extends(PicturesCollection, Backbone.Collection);
    function PicturesCollection() {
      PicturesCollection.__super__.constructor.apply(this, arguments);
    }
    PicturesCollection.prototype.model = window.Kin.PictureModel;
    PicturesCollection.prototype.uri = '/day-cares/pictures/:pictureSetId';
    PicturesCollection.prototype.pictureSetId = null;
    PicturesCollection.prototype.initialize = function(models, _arg) {
      this.pictureSetId = _arg.pictureSetId;
      return this;
    };
    PicturesCollection.prototype.getPrimary = function(orFirst) {
      var primarys;
      if (orFirst == null) {
        orFirst = true;
      }
      primarys = _.filter(this.models, function(pictureModel) {
        return pictureModel.get('primary');
      });
      primarys || (primarys = [this.first()]);
      return primarys[0];
    };
    PicturesCollection.prototype.url = function() {
      return this.uri.replace(/:pictureSetId/g, this.pictureSetId);
    };
    return PicturesCollection;
  })();
}).call(this);
