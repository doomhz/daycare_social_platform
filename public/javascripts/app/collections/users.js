(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.UsersCollection = (function() {
    __extends(UsersCollection, Backbone.Collection);
    function UsersCollection() {
      UsersCollection.__super__.constructor.apply(this, arguments);
    }
    UsersCollection.prototype.model = window.Kin.UserModel;
    UsersCollection.prototype.url = "/users";
    UsersCollection.prototype.initialize = function(models, options) {};
    return UsersCollection;
  })();
}).call(this);
