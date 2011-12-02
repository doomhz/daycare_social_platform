(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.UserModel = (function() {
    __extends(UserModel, Backbone.Model);
    function UserModel() {
      UserModel.__super__.constructor.apply(this, arguments);
    }
    UserModel.prototype.defaults = {
      _id: null,
      type: null,
      email: null,
      daycare_id: null
    };
    UserModel.prototype.url = '/current-user';
    return UserModel;
  })();
}).call(this);
