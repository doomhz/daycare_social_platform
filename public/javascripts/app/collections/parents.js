(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.ParentsCollection = (function(_super) {

    __extends(ParentsCollection, _super);

    function ParentsCollection() {
      ParentsCollection.__super__.constructor.apply(this, arguments);
    }

    ParentsCollection.prototype.model = window.Kin.ParentModel;

    ParentsCollection.prototype.uri = "/parents/:userId";

    ParentsCollection.userId = null;

    ParentsCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.userId = options.userId || this.userId;
      return this;
    };

    ParentsCollection.prototype.url = function() {
      return this.uri.replace(/:userId/g, this.userId);
    };

    ParentsCollection.prototype.filterByChildId = function(childId) {
      return this.filter(function(parent) {
        return $.inArray(childId, parent.get("children_ids")) > -1;
      });
    };

    return ParentsCollection;

  })(Backbone.Collection);

}).call(this);
