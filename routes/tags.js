(function() {
  var Tag;

  Tag = require('../models/tag');

  module.exports = function(app) {
    app.get('/tags/:type', function(req, res) {
      var type;
      type = req.params.type;
      return Tag.find({
        type: type
      }).run(function(err, tags) {
        return res.json(tags);
      });
    });
    return app.post('/tag', function(req, res) {
      var data, tag;
      data = req.body;
      tag = new Tag(data);
      return tag.save(function(err, savedTag) {
        return res.json(savedTag);
      });
    });
  };

}).call(this);
