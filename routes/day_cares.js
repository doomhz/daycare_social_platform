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
    app.get('/day-cares/:id', function(req, res) {
      return DayCare.findOne({
        _id: req.params.id
      }).run(function(err, dayCare) {
        return res.json(dayCare);
      });
    });
    app.put('/day-cares/:id', function(req, res) {
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
    app.get('/day-cares/picture-set/:id', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.id;
      return DayCare.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, dayCare) {
        var pictureSet;
        pictureSet = dayCare.picture_sets.id(pictureSetId);
        pictureSet.daycare_id = dayCare._id;
        return res.json(pictureSet);
      });
    });
    app.del('/day-cares/picture-set/:id', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.id;
      return DayCare.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, dayCare) {
        var filePath, picture, pictureSet, _i, _len, _ref;
        pictureSet = dayCare.picture_sets.id(pictureSetId);
        pictureSet.remove();
        dayCare.save();
        _ref = pictureSet.pictures;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picture = _ref[_i];
          filePath = './public/' + picture.url;
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(e);
          }
        }
        filePath = './public/daycares/' + pictureSetId;
        try {
          fs.rmdirSync(filePath);
        } catch (e) {
          console.error(e);
        }
        return res.json({
          success: true
        });
      });
    });
    app.get('/day-cares/pictures/:pictureSetId', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.pictureSetId;
      return DayCare.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, dayCare) {
        var pictureSet, pictures;
        pictureSet = dayCare.picture_sets.id(pictureSetId);
        pictures = pictureSet.pictures;
        return res.json(pictures);
      });
    });
    app.del('/day-cares/picture/:pictureId', function(req, res) {
      var pictureId;
      pictureId = req.params.pictureId;
      return DayCare.findOne({
        'picture_sets.pictures._id': pictureId
      }).run(function(err, dayCare) {
        var filePath, picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, _i, _j, _len, _len2, _ref, _ref2;
        pictureSetIndex = -1;
        pictureIndex = -1;
        pictureSetIndexToGo = -1;
        pictureIndexToGo = -1;
        _ref = dayCare.picture_sets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pictureSet = _ref[_i];
          pictureSetIndex++;
          pictureIndex = -1;
          _ref2 = pictureSet.pictures;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            picture = _ref2[_j];
            pictureIndex++;
            if (("" + picture._id) === ("" + pictureId)) {
              pictureSetIndexToGo = pictureSetIndex;
              pictureIndexToGo = pictureIndex;
              break;
            }
          }
        }
        filePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].url;
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error(e);
        }
        dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].remove();
        dayCare.save();
        return res.json({
          success: true
        });
      });
    });
    app.put('/day-cares/picture/:pictureId', function(req, res) {
      var pictureId;
      pictureId = req.params.pictureId;
      return DayCare.findOne({
        'picture_sets.pictures._id': pictureId
      }).run(function(err, dayCare) {
        var picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
        pictureSetIndex = -1;
        pictureIndex = -1;
        pictureSetIndexToGo = -1;
        pictureIndexToGo = -1;
        _ref = dayCare.picture_sets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pictureSet = _ref[_i];
          pictureSetIndex++;
          pictureIndex = -1;
          _ref2 = pictureSet.pictures;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            picture = _ref2[_j];
            pictureIndex++;
            if (("" + picture._id) === ("" + pictureId)) {
              pictureSetIndexToGo = pictureSetIndex;
              pictureIndexToGo = pictureIndex;
              break;
            }
          }
        }
        _ref3 = dayCare.picture_sets[pictureSetIndexToGo].pictures;
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          picture = _ref3[_k];
          picture.primary = false;
        }
        dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].primary = true;
        dayCare.save();
        return res.json({
          success: true
        });
      });
    });
    return app.post('/day-cares/upload', function(req, res) {
      var dirPath, fileExtension, fileName, filePath, newPicture, newPictureData, pictureSetId, relativeDirPath, relativeFilePath, ws;
      pictureSetId = req.query.setId;
      fileName = req.query.qqfile;
      fileExtension = fileName.substring(fileName.length - 3);
      fileName = new Date().getTime();
      dirPath = './public/daycares/' + pictureSetId + '/';
      relativeDirPath = '/daycares/' + pictureSetId + '/';
      filePath = dirPath + fileName + '.' + fileExtension;
      relativeFilePath = relativeDirPath + fileName + '.' + fileExtension;
      newPictureData = {
        url: relativeFilePath
      };
      newPicture = null;
      DayCare.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, dayCare) {
        var newPicturePosition, pictureSet, pictureSetIndex, pictureSets, _i, _len;
        pictureSets = dayCare.picture_sets;
        newPicturePosition = null;
        pictureSetIndex = -1;
        for (_i = 0, _len = pictureSets.length; _i < _len; _i++) {
          pictureSet = pictureSets[_i];
          pictureSetIndex++;
          if ("" + pictureSet._id === "" + pictureSetId) {
            newPicturePosition = pictureSet.pictures.push(newPictureData);
            break;
          }
        }
        dayCare.picture_sets = pictureSets;
        dayCare.save();
        newPicture = dayCare.picture_sets[pictureSetIndex].pictures[newPicturePosition - 1];
        newPicture.success = true;
        return res.json(newPicture);
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
        return req.on('data', function(data) {
          return ws.write(data);
        });
      } else {
        return res.json({
          success: false
        });
      }
    });
  };
}).call(this);
