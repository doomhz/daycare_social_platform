(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.ClassesCollection = (function(_super) {

    __extends(ClassesCollection, _super);

    function ClassesCollection() {
      ClassesCollection.__super__.constructor.apply(this, arguments);
    }

    ClassesCollection.prototype.model = window.Kin.ClassModel;

    ClassesCollection.prototype.uri = "/classes/:masterId";

    ClassesCollection.masterId = null;

    ClassesCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.masterId = options.masterId || this.masterId;
      return this;
    };

    ClassesCollection.prototype.url = function() {
      return this.uri.replace(/:masterId/g, this.masterId);
    };

    return ClassesCollection;

  })(Backbone.Collection);

}).call(this);
