(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.MessageModel = (function() {
    __extends(MessageModel, Backbone.Model);
    function MessageModel() {
      MessageModel.__super__.constructor.apply(this, arguments);
    }
    MessageModel.prototype.defaults = {
      from_id: null,
      to_id: null,
      type: "default",
      content: "",
      created_at: null,
      updated_at: null,
      from_user: null
    };
    MessageModel.prototype.urlRoot = "/messages";
    return MessageModel;
  })();
}).call(this);
