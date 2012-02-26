(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.TagsCollection = (function(_super) {

    __extends(TagsCollection, _super);

    function TagsCollection() {
      TagsCollection.__super__.constructor.apply(this, arguments);
    }

    TagsCollection.prototype.model = window.Kin.TagModel;

    TagsCollection.prototype.uri = "/tags/:type";

    TagsCollection.prototype.type = null;

    TagsCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.type = options.type || this.type;
      return this;
    };

    TagsCollection.prototype.url = function() {
      return this.uri.replace(/:type/g, this.type);
    };

    return TagsCollection;

  })(Backbone.Collection);

}).call(this);
