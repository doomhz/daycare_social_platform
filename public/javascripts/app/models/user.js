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

    UserModel.prototype.delegates = [];

    UserModel.prototype.initialize = function(options) {
      if (options == null) options = {};
      this.url = options.url || this.url;
      this.autoUpdate = options.autoUpdate || this.autoUpdate;
      this.autoUpdateTime = options.autoUpdateTime || this.autoUpdateTime;
      if (this.autoUpdate) {
        window.setInterval(this.autoUpdateHandler, this.autoUpdateTime);
      }
      return this.bind("change", this.dataUpdateHandler);
    };

    UserModel.prototype.autoUpdateHandler = function() {
      return this.fetch();
    };

    UserModel.prototype.canEditProfile = function(profileId) {
      return profileId === this.get('_id');
    };

    UserModel.prototype.getProfilePicture = function() {
      var profilePicture, profilePictureSet;
      profilePictureSet = this.getProfilePictureSet(this.get('picture_sets'));
      return profilePicture = this.getPrimaryPictureFromSet(profilePictureSet);
    };

    UserModel.prototype.getProfilePictureSet = function(pictureSets) {
      if (pictureSets == null) pictureSets = this.get('picture_sets');
      return this.getSetsByType(pictureSets, 'profile')[0];
    };

    UserModel.prototype.getPrimaryPictureFromSet = function(set) {
      if (set == null) {
        set = {
          pictures: []
        };
      }
      return $.grep(set.pictures, function(picture) {
        return picture.primary === true;
      })[0];
    };

    UserModel.prototype.getPublicSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'public');
    };

    UserModel.prototype.getDefaultSets = function() {
      var sets;
      return sets = this.getSetsByType(this.get('picture_sets'), 'default');
    };

    UserModel.prototype.getSetsByType = function(pictureSets, type) {
      if (type == null) type = 'default';
      return $.grep(pictureSets, function(set) {
        return set.type === type;
      });
    };

    UserModel.prototype.addDelegate = function(delegate) {
      if (!this.delegates[delegate]) return this.delegates.push(delegate);
    };

    UserModel.prototype.removeDelegate = function(delegateToRemove) {
      return this.delegates = _.filter(this.delegates, function(delegate) {
        return delegate !== delegateToRemove;
      });
    };

    UserModel.prototype.dataUpdateHandler = function() {
      var attribute, changedAttributes, _results;
      changedAttributes = this.changedAttributes();
      _results = [];
      for (attribute in changedAttributes) {
        _results.push(this.triggerChangeEventOnDelegates(attribute));
      }
      return _results;
    };

    UserModel.prototype.triggerChangeEventOnDelegates = function(changedAttribute) {
      var changedAttributeValue, delegate, _i, _len, _ref, _results;
      changedAttributeValue = this.get(changedAttribute);
      _ref = this.delegates;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        delegate = _ref[_i];
        _results.push(delegate.trigger("change", changedAttribute, changedAttributeValue));
      }
      return _results;
    };

    return UserModel;

  })(Backbone.Model);

}).call(this);
