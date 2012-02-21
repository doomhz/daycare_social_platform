(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.SectionModel = (function(_super) {

    __extends(SectionModel, _super);

    function SectionModel() {
      SectionModel.__super__.constructor.apply(this, arguments);
    }

    SectionModel.prototype.defaults = {
      type: "section"
    };

    SectionModel.prototype.uri = "/day-care/section/:section_name/:id";

    SectionModel.prototype.initialize = function(attributes, options) {};

    SectionModel.prototype.url = function() {
      return this.uri.replace(":section_name", this.get("name")).replace(":id", this.get("id"));
    };

    return SectionModel;

  })(Backbone.Model);

}).call(this);
