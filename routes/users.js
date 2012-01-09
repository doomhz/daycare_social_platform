(function() {
  var User;
  User = require('../models/user');
  module.exports = function(app) {
    return app.get('/users', function(req, res) {
      return User.find().asc('name', 'surname').run(function(err, users) {
        return res.json(users);
      });
    });
  };
}).call(this);
