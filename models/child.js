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
    }
  });

  Child = mongoose.model("Child", ChildSchema);

  exports = module.exports = Child;

}).call(this);
