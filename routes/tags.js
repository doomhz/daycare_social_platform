(function() {
  var Tag;

  Tag = require('../models/tag');

  module.exports = function(app) {
    return app.get('/tags/:type', function(req, res) {
      var type;
      type = req.params.type;
      return Tag.find({
        type: type
      }).run(function(err, tags) {
        return res.json(tags);
      });
    });
  };

}).call(this);
