(function() {
  var DayCare, Picture, PictureSet, exports;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  Picture = new Schema({
    primary: {
      type: Boolean,
      "default": false
    },
    description: {
      type: String
    },
    url: {
      type: String
    },
    thumb_url: {
      type: String
    },
    medium_url: {
      type: String
    },
    big_url: {
      type: String
    },
    success: Boolean
  });
  PictureSet = new Schema({
    daycare_id: {
      type: String
    },
    name: {
      type: String,
      index: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      "enum": ['default', 'daycare', 'profile'],
      "default": 'default'
    },
    pictures: [Picture]
  });
  DayCare = new Schema({
    user_id: {
      type: String
    },
    name: {
      type: String,
      index: true
    },
    speaking_classes: [Number],
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    email: String,
    phone: String,
    fax: String,
    contact_person: String,
    licensed: {
      type: Boolean
    },
    license_number: String,
    type: {
      type: String,
      "enum": ['daycare', 'kindergarten', 'preschool'],
      "default": 'daycare'
    },
    opened_since: {
      type: Date
    },
    open_door_policy: {
      type: Boolean
    },
    serving_disabilities: {
      type: Boolean
    },
    picture_sets: {
      type: [PictureSet]
    }
  });
  DayCare.methods.filterPrivateDataByUserId = function(user_id) {
    var dayCare, dayCares, _i, _len;
    if (this.constructor === Array) {
      dayCares = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        dayCare = this[_i];
        if (("" + user_id) === ("" + dayCare.user_id)) {
          dayCares.push(dayCare);
        } else {
          dayCares.push(DayCare.statics.getPublicData(dayCare));
        }
      }
      return dayCares;
    } else {
      if (("" + user_id) === ("" + this.user_id)) {
        return this;
      } else {
        return DayCare.statics.getPublicData(this);
      }
    }
  };
  DayCare.statics.filterPrivatePictureSetsByUserId = function(user_id, dayCareUserId, pictureSets) {
    var pictureSet, publicPictureSetTypes, publicPictureSets, _i, _len, _ref;
    if (("" + user_id) === ("" + dayCareUserId)) {
      return pictureSets;
    } else {
      publicPictureSetTypes = ["profile", "daycare"];
      publicPictureSets = [];
      for (_i = 0, _len = pictureSets.length; _i < _len; _i++) {
        pictureSet = pictureSets[_i];
        if (_ref = pictureSet.type, __indexOf.call(publicPictureSetTypes, _ref) >= 0) {
          publicPictureSets.push(pictureSet);
        }
      }
      return publicPictureSets;
    }
  };
  DayCare.statics.getPublicData = function(dayCare) {
    var data, key, pictureSet, publicPictureSetTypes, publicRows, val, _i, _len, _ref, _ref2;
    data = {};
    publicRows = {
      "user_id": true,
      "name": true,
      "speaking_classes": true,
      "address": true,
      "location": true,
      "email": true,
      "phone": true,
      "fax": true,
      "contact_person": true,
      "licensed": true,
      "license_number": true,
      "type": true,
      "opened_since": true,
      "open_door_policy": true,
      "serving_disabilities": true
    };
    for (key in dayCare) {
      val = dayCare[key];
      if (publicRows[key]) {
        data[key] = val;
      }
    }
    data.picture_sets = [];
    publicPictureSetTypes = ["profile", "daycare"];
    _ref = dayCare.picture_sets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pictureSet = _ref[_i];
      if (_ref2 = pictureSet.type, __indexOf.call(publicPictureSetTypes, _ref2) >= 0) {
        data.picture_sets.push(pictureSet);
      }
    }
    return data;
  };
  exports = module.exports = mongoose.model('DayCare', DayCare);
}).call(this);
