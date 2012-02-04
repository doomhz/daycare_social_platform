(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.StaffModel = (function(_super) {

    __extends(StaffModel, _super);

    function StaffModel() {
      StaffModel.__super__.constructor.apply(this, arguments);
    }

    StaffModel.prototype.defaults = {
      name: void 0,
      surname: void 0
    };

    StaffModel.prototype.urlRoot = "/staff";

    StaffModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    StaffModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return StaffModel;

  })(Backbone.Model);

}).call(this);
