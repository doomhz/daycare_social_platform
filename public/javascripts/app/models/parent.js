(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.ParentModel = (function(_super) {

    __extends(ParentModel, _super);

    function ParentModel() {
      ParentModel.__super__.constructor.apply(this, arguments);
    }

    ParentModel.prototype.urlRoot = "/profile";

    ParentModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    ParentModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return ParentModel;

  })(Kin.UserModel);

}).call(this);
