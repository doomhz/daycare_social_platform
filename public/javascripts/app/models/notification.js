(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.NotificationModel = (function(_super) {

    __extends(NotificationModel, _super);

    function NotificationModel() {
      NotificationModel.__super__.constructor.apply(this, arguments);
    }

    NotificationModel.prototype.urlRoot = "/notification";

    NotificationModel.prototype.initialize = function(attributes, options) {
      return this.id = this.get("_id");
    };

    return NotificationModel;

  })(Backbone.Model);

}).call(this);
