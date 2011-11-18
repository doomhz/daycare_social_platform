(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.PictureSetsCollection = (function() {
    __extends(PictureSetsCollection, Backbone.Collection);
    function PictureSetsCollection() {
      PictureSetsCollection.__super__.constructor.apply(this, arguments);
    }
    PictureSetsCollection.prototype.model = window.Kin.PictureSetModel;
    PictureSetsCollection.prototype.initialize = function() {};
    return PictureSetsCollection;
  })();
}).call(this);
