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
      name: '',
      username: '',
      speaking_classes: [],
      address: '',
      location: {
        lat: 10,
        lng: 40
      },
      email: '',
      phone: '',
      fax: '',
      contact_person: '',
      licensed: false,
      license_number: '',
      type: 'daycare',
      opened_since: '',
      open_door_policy: false,
      serving_disabilities: false,
      picture_sets: []
    };
    UserModel.prototype.url = '/current-user';
    UserModel.prototype.canEditProfile = function(profileId) {
      return profileId === this.get('_id');
    };
    return UserModel;
  })();
}).call(this);
