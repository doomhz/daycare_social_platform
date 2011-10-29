(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCareModel = (function() {
    __extends(DayCareModel, Backbone.Model);
    function DayCareModel() {
      DayCareModel.__super__.constructor.apply(this, arguments);
    }
    DayCareModel.prototype.defaults = {
      _id: null,
      name: '',
      speaking_classes: [],
      location: [],
      email: '',
      phone: '',
      contact_person: '',
      licensed: false,
      type: 'daycare',
      opened_since: '',
      open_door_policy: false,
      serving_disabilities: false
    };
    DayCareModel.prototype.uri = "/day-cares/load";
    DayCareModel.prototype.initialize = function(options, uri) {
      this.uri = uri || this.uri;
      this.id = this.get('_id') || this.id;
      return this;
    };
    DayCareModel.prototype.url = function() {
      return "" + this.uri + "/" + this.id;
    };
    return DayCareModel;
  })();
}).call(this);
