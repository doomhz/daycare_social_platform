(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.ClassModel = (function(_super) {

    __extends(ClassModel, _super);

    function ClassModel() {
      ClassModel.__super__.constructor.apply(this, arguments);
    }

    ClassModel.prototype.urlRoot = "/profile";

    ClassModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    ClassModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return ClassModel;

  })(Kin.UserModel);

}).call(this);
