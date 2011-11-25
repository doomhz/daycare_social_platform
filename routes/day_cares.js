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
    app.put('/day-cares/picture-set/:id', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.id;
      return DayCare.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, dayCare) {
        var key, pictureSet, pictureSetIndexToEdit, value, _i, _len, _ref, _ref2;
        pictureSetIndexToEdit = -1;
        _ref = dayCare.picture_sets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pictureSet = _ref[_i];
          pictureSetIndexToEdit++;
          if (pictureSet._id + "" === pictureSetId + "") {
            break;
          }
        }
        delete req.body._id;
        _ref2 = req.body;
        for (key in _ref2) {
          value = _ref2[key];
          dayCare.picture_sets[pictureSetIndexToEdit][key] = value;
        }
        dayCare.save();
        return res.json({
          success: true
        });
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
        var filePath, mediumFilePath, picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, thumbFilePath, _i, _j, _len, _len2, _ref, _ref2;
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
        thumbFilePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].thumb_url;
        try {
          fs.unlinkSync(thumbFilePath);
        } catch (e) {
          console.error(e);
        }
        mediumFilePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].medium_url;
        try {
          fs.unlinkSync(mediumFilePath);
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
        var key, picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, value, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
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
        delete req.body._id;
        _ref4 = req.body;
        for (key in _ref4) {
          value = _ref4[key];
          dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo][key] = value;
        }
        dayCare.save();
        return res.json({
          success: true
        });
      });
    });
    return app.post('/day-cares/upload', function(req, res) {
      var description, dirPath, fileExtension, fileName, filePath, mediumFilePath, mediumRelativeFilePath, newPicture, newPictureData, pictureSetId, relativeDirPath, relativeFilePath, thumbFilePath, thumbRelativeFilePath, ws;
      pictureSetId = req.query.setId;
      fileName = req.query.qqfile;
      description = req.query.description;
      fileExtension = fileName.substring(fileName.length - 3).toLowerCase();
      fileName = new Date().getTime();
      dirPath = './public/daycares/' + pictureSetId + '/';
      relativeDirPath = '/daycares/' + pictureSetId + '/';
      filePath = dirPath + fileName + '.' + fileExtension;
      thumbFilePath = dirPath + fileName + '_thumb.' + fileExtension;
      mediumFilePath = dirPath + fileName + '_medium.' + fileExtension;
      relativeFilePath = relativeDirPath + fileName + '.' + fileExtension;
      thumbRelativeFilePath = relativeDirPath + fileName + '_thumb.' + fileExtension;
      mediumRelativeFilePath = relativeDirPath + fileName + '_medium.' + fileExtension;
      newPictureData = {
        url: relativeFilePath,
        thumb_url: thumbRelativeFilePath,
        medium_url: mediumRelativeFilePath,
        description: description
      };
      newPicture = null;
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
        return req.on('end', function() {
          return DayCare.findOne({
            'picture_sets._id': pictureSetId
          }).run(function(err, dayCare) {
            var im, newPicturePosition, pictureSet, pictureSetIndex, pictureSets, _i, _len;
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
            im = require('imagemagick');
            im.crop({
              srcPath: filePath,
              dstPath: thumbFilePath,
              width: 170,
              height: 130,
              quality: 1
            }, function(err, stdout, stderr) {
              if (err) {
                console.log(err);
              }
              if (err) {
                console.log(stderr);
              }
              return res.json(newPicture);
            });
            return im.crop({
              srcPath: filePath,
              dstPath: mediumFilePath,
              width: 430,
              height: 300,
              quality: 1
            }, function(err, stdout, stderr) {
              if (err) {
                console.log(err);
              }
              if (err) {
                return console.log(stderr);
              }
            });
          });
        });
      } else {
        return res.json({
          success: false
        });
      }
    });
  };
}).call(this);
