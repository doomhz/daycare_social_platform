(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.TagModel = (function(_super) {

    __extends(TagModel, _super);

    function TagModel() {
      TagModel.__super__.constructor.apply(this, arguments);
    }

    TagModel.prototype.defaults = {
      name: void 0
    };

    TagModel.prototype.urlRoot = "/tag";

    TagModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    TagModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return TagModel;

  })(Backbone.Model);

}).call(this);
