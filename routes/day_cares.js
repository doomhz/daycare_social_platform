(function() {
  var DayCare, fs;
  DayCare = require('../models/day_care');
  fs = require('fs');
  module.exports = function(app) {
    app.get('/day-cares', function(req, res) {
      return DayCare.find({}).desc('created_at').run(function(err, dayCares) {
        return res.json(dayCares);
      });
    });
    /*
      app.param 'id', (req, res, next, id)->
        DayCare.findOne({ _id : req.params.id }, (err, dayCare)->
          if (err) return next(err);
          if (!dayCare) return next(new Error('Failed to load article ' + id));
          req.dayCare = dayCare
          next()
      */
    app.get('/day-cares/load/:id', function(req, res) {
      return DayCare.findOne({
        _id: req.params.id
      }).run(function(err, dayCare) {
        return res.json(dayCare);
      });
    });
    app.put('/day-cares/load/:id', function(req, res) {
      var data;
      data = req.body;
      delete data._id;
      return DayCare.update({
        _id: req.params.id
      }, data, {}, function(err, dayCare) {
        return res.json({
          success: true
        });
      });
    });
    return app.post('/day-cares/upload', function(req, res) {
      var dayCareId, dirPath, fileExtension, fileName, filePath, pictureSetId, relativeDirPath, relativeFilePath, ws;
      dayCareId = req.query.dayCareId;
      pictureSetId = req.query.setId;
      fileName = req.query.qqfile;
      fileExtension = fileName.substring(fileName.length - 3);
      fileName = new Date().getTime();
      dirPath = './public/daycares/' + dayCareId + '/';
      relativeDirPath = '/daycares/' + dayCareId + '/';
      filePath = dirPath + fileName + '.' + fileExtension;
      relativeFilePath = relativeDirPath + fileName + '.' + fileExtension;
      DayCare.findOne({
        _id: dayCareId
      }).run(function(err, dayCare) {
        var pictureSet, pictureSets, _i, _len;
        pictureSets = dayCare.picture_sets;
        for (_i = 0, _len = pictureSets.length; _i < _len; _i++) {
          pictureSet = pictureSets[_i];
          if ("" + pictureSet._id === "" + pictureSetId) {
            pictureSet.pictures.push({
              url: relativeFilePath
            });
          }
        }
        dayCare.picture_sets = pictureSets;
        return dayCare.save();
      });
      if (req.xhr) {
        try {
          fs.statSync(dirPath);
        } catch (e) {
          fs.mkdirSync(dirPath, 0777);
        }
        ws = fs.createWriteStream(filePath);
        try {
          fs.chmodSync(filePath, 777);
        } catch (e) {

        }
        req.on('data', function(data) {
          return ws.write(data);
        });
        return res.json({
          success: true
        });
      } else {
        return res.json({
          success: false
        });
      }
    });
  };
}).call(this);
