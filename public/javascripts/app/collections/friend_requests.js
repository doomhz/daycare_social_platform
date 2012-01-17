(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Kin.FriendRequestsCollection = (function(_super) {

    __extends(FriendRequestsCollection, _super);

    function FriendRequestsCollection() {
      FriendRequestsCollection.__super__.constructor.apply(this, arguments);
    }

    FriendRequestsCollection.prototype.model = window.Kin.FriendRequestModel;

    FriendRequestsCollection.prototype.initialize = function(models, options) {
      this.url = options && options.url;
      return this;
    };

    return FriendRequestsCollection;

  })(Backbone.Collection);

}).call(this);
