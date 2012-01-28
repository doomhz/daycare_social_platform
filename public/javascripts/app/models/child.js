(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.ChildModel = (function(_super) {

    __extends(ChildModel, _super);

    function ChildModel() {
      ChildModel.__super__.constructor.apply(this, arguments);
    }

    ChildModel.prototype.defaults = {
      name: void 0,
      surname: void 0
    };

    ChildModel.prototype.urlRoot = "/child";

    ChildModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    ChildModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return ChildModel;

  })(Backbone.Model);

}).call(this);
