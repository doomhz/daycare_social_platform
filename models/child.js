(function() {
  var Child, ChildSchema, exports;

  ChildSchema = new Schema({
    user_id: {
      type: String
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    gender: {
      type: String,
      "enum": ['female', 'male'],
      "default": 'female'
    },
    birthday: {
      type: String
    },
    special_needs: {
      type: String
    },
    physician_name: {
      type: String
    },
    phone_physician: {
      type: String
    },
    authorized_person_1: {
      type: {},
      "default": {}
    },
    authorized_person_2: {
      type: {},
      "default": {}
    }
  });

  Child = mongoose.model("Child", ChildSchema);

  exports = module.exports = Child;

}).call(this);
