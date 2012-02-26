(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.ChildrenCollection = (function(_super) {

    __extends(ChildrenCollection, _super);

    function ChildrenCollection() {
      ChildrenCollection.__super__.constructor.apply(this, arguments);
    }

    ChildrenCollection.prototype.model = window.Kin.ChildModel;

    ChildrenCollection.prototype.uri = "/children/:userId";

    ChildrenCollection.prototype.userId = null;

    ChildrenCollection.prototype.initialize = function(models, options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.userId = options.userId || this.userId;
      return this;
    };

    ChildrenCollection.prototype.url = function() {
      return this.uri.replace(/:userId/g, this.userId);
    };

    ChildrenCollection.prototype.filterByClassId = function(classId) {
      return this.filter(function(child) {
        return child.get("user_id") === classId;
      });
    };

    return ChildrenCollection;

  })(Backbone.Collection);

}).call(this);
