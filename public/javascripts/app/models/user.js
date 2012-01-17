(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.UserModel = (function(_super) {

    __extends(UserModel, _super);

    function UserModel() {
      this.autoUpdateHandler = __bind(this.autoUpdateHandler, this);
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

    UserModel.prototype.url = '/profiles';

    UserModel.prototype.autoUpdate = false;

    UserModel.prototype.autoUpdateTime = 15000;

    UserModel.prototype.initialize = function(options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.autoUpdate = options.autoUpdate || this.autoUpdate;
      this.autoUpdateTime = options.autoUpdateTime || this.autoUpdateTime;
      if (this.autoUpdate) {
        return window.setInterval(this.autoUpdateHandler, this.autoUpdateTime);
      }
    };

    UserModel.prototype.autoUpdateHandler = function() {
      return this.fetch();
    };

    UserModel.prototype.canEditProfile = function(profileId) {
      return profileId === this.get('_id');
    };

    return UserModel;

  })(Backbone.Model);

}).call(this);
