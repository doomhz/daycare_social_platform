(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.FriendRequestModel = (function(_super) {

    __extends(FriendRequestModel, _super);

    function FriendRequestModel() {
      FriendRequestModel.__super__.constructor.apply(this, arguments);
    }

    FriendRequestModel.prototype.defaults = {
      user_id: null,
      from_id: null,
      email: null,
      name: null,
      children_ids: [],
      surname: null,
      status: null,
      created_at: null
    };

    FriendRequestModel.prototype.urlRoot = "/friend-requests";

    FriendRequestModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    FriendRequestModel.prototype.url = function() {
      var id;
      id = this.get("_id") ? "/" + (this.get("_id")) : "";
      return "" + this.urlRoot + id;
    };

    return FriendRequestModel;

  })(Backbone.Model);

}).call(this);
