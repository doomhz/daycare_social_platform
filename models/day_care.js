(function() {
  var DayCare, exports;
  require('./db_connect');
  DayCare = new Schema({
    name: {
      type: String,
      index: true
    },
    speaking_classes: [Number],
    location: [Number],
    email: String,
    phone: String,
    contact_person: String,
    licensed: {
      type: Boolean
    },
    type: {
      type: [String],
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
    }
  });
  exports = module.exports = mongoose.model('DayCare', DayCare);
}).call(this);
