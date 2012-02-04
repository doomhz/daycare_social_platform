(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.StaffCollection = (function(_super) {

    __extends(StaffCollection, _super);

    function StaffCollection() {
      StaffCollection.__super__.constructor.apply(this, arguments);
    }

    StaffCollection.prototype.model = window.Kin.StaffModel;

    StaffCollection.prototype.uri = "/staff/:userId";

    StaffCollection.userId = null;

    StaffCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.userId = options.userId || this.userId;
      return this;
    };

    StaffCollection.prototype.url = function() {
      return this.uri.replace(/:userId/g, this.userId);
    };

    return StaffCollection;

  })(Backbone.Collection);

}).call(this);
