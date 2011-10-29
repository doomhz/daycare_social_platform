DayCare = require('../models/day_care');

module.exports = (app)->

  app.get '/', (req, res)->
    res.render 'site/index', {title: "Kindzy.com"}

