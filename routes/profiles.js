(function() {
  var Child, Comment, User, fs, _,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  User = require('../models/user');

  Comment = require('../models/comment');

  Child = require('../models/child');

  fs = require('fs');

  _ = require('underscore');

  module.exports = function(app) {
    app.get('/profiles', function(req, res) {
      return User.find().asc('name', 'surname').run(function(err, users) {
        return res.render('profiles/profiles', {
          profiles: users,
          show_private: false,
          layout: false
        });
      });
    });
    app.get('/daycares', function(req, res) {
      return User.find({
        type: 'daycare'
      }).desc('created_at').run(function(err, daycares) {
        return res.render('profiles/profiles', {
          profiles: daycares,
          show_private: false,
          layout: false
        });
      });
    });
    app.get('/profiles/me', function(req, res) {
      var currentUser;
      currentUser = req.user ? req.user : {};
      return User.findOne({
        _id: currentUser._id
      }).run(function(err, user) {
        if (user) {
          return user.findDaycareFriends(function() {
            return res.render('profiles/_user', {
              profile: user,
              show_private: true,
              layout: false
            });
          });
        } else {
          res.statusCode = 401;
          return res.json({
            "error": true
          });
        }
      });
    });
    app.post('/profiles', function(req, res) {
      var currentUser, data, profilePicturesSet, user;
      currentUser = req.user ? req.user : {};
      data = req.body;
      user = new User(data);
      user.master_id = currentUser._id;
      user.friends.push(currentUser._id);
      if (!user.picture_sets.length) {
        profilePicturesSet = {
          type: 'profile',
          name: 'Profile pictures',
          description: 'Your profile pictures.',
          pictures: []
        };
        user.picture_sets.push(profilePicturesSet);
      }
      return user.save(function(err, savedUser) {
        currentUser.friends.push(savedUser._id);
        return currentUser.save(function() {
          return res.json({
            success: true,
            _id: savedUser._id
          });
        });
      });
    });
    app.get('/profiles/:id', function(req, res) {
      return User.findOne({
        _id: req.params.id
      }).run(function(err, user) {
        var currentUser, showPrivate;
        currentUser = req.user ? req.user : {};
        showPrivate = currentUser._id === user._id;
        return res.render('profiles/profile', {
          profile: user,
          show_private: showPrivate,
          layout: false
        });
      });
    });
    app.put('/profiles/:id', function(req, res) {
      var currentUser, data;
      currentUser = req.user ? req.user : {};
      data = req.body;
      delete data._id;
      return User.update({
        _id: currentUser._id
      }, data, {}, function(err, user) {
        return res.json({
          success: true
        });
      });
    });
    app.get('/profiles/picture-set/:id', function(req, res) {
      var currentUser, pictureSetId;
      pictureSetId = req.params.id;
      currentUser = req.user ? req.user : {};
      return User.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, user) {
        var pictureSet, showPrivate;
        pictureSet = user.picture_sets.id(pictureSetId);
        pictureSet.user_id = user._id;
        showPrivate = currentUser._id === user._id;
        return res.render('profiles/_picture_set', {
          picture_set: pictureSet,
          show_private: showPrivate,
          layout: false
        });
      });
    });
    app.put('/profiles/picture-set/:id', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.id;
      return User.findOne({
        'picture_sets._id': pictureSetId,
        _id: req.user._id
      }).run(function(err, user) {
        var key, pictureSet, pictureSetIndexToEdit, value, _i, _len, _ref, _ref2;
        if (user) {
          pictureSetIndexToEdit = -1;
          _ref = user.picture_sets;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pictureSet = _ref[_i];
            pictureSetIndexToEdit++;
            if (pictureSet._id + "" === pictureSetId + "") break;
          }
          delete req.body._id;
          _ref2 = req.body;
          for (key in _ref2) {
            value = _ref2[key];
            user.picture_sets[pictureSetIndexToEdit][key] = value;
          }
          user.save();
          return res.json({
            success: true
          });
        } else {
          return res.json({
            success: false
          });
        }
      });
    });
    app.del('/profiles/picture-set/:id', function(req, res) {
      var pictureSetId;
      pictureSetId = req.params.id;
      return User.findOne({
        'picture_sets._id': pictureSetId,
        _id: req.user._id
      }).run(function(err, user) {
        var filePath, picture, pictureSet, _i, _len, _ref;
        if (user) {
          pictureSet = user.picture_sets.id(pictureSetId);
          pictureSet.remove();
          user.save();
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
          filePath = './public/users/' + pictureSetId;
          try {
            fs.rmdirSync(filePath);
          } catch (e) {
            console.error(e);
          }
          return res.json({
            success: true
          });
        } else {
          return res.json({
            success: false
          });
        }
      });
    });
    app.get('/profiles/pictures/:pictureSetId', function(req, res) {
      var currentUser, pictureSetId;
      pictureSetId = req.params.pictureSetId;
      currentUser = req.user ? req.user : {};
      return User.findOne({
        'picture_sets._id': pictureSetId
      }).run(function(err, user) {
        var pictureSet, pictures, showPrivate;
        pictureSet = user.picture_sets.id(pictureSetId);
        pictures = pictureSet.pictures;
        showPrivate = currentUser._id === user._id;
        return res.render('profiles/pictures', {
          pictures: pictures,
          show_private: showPrivate,
          layout: false
        });
      });
    });
    app.del('/profiles/picture/:pictureId', function(req, res) {
      var pictureId;
      pictureId = req.params.pictureId;
      return User.findOne({
        'picture_sets.pictures._id': pictureId,
        _id: req.user._id
      }).run(function(err, user) {
        var bigFilePath, filePath, mediumFilePath, picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, pictureToRemove, thumbFilePath, _i, _j, _len, _len2, _ref, _ref2;
        if (user) {
          pictureSetIndex = -1;
          pictureIndex = -1;
          pictureSetIndexToGo = -1;
          pictureIndexToGo = -1;
          _ref = user.picture_sets;
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
          pictureToRemove = user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo];
          filePath = './public/' + pictureToRemove.url;
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(e);
          }
          thumbFilePath = './public/' + pictureToRemove.thumb_url;
          try {
            fs.unlinkSync(thumbFilePath);
          } catch (e) {
            console.error(e);
          }
          mediumFilePath = './public/' + pictureToRemove.medium_url;
          try {
            fs.unlinkSync(mediumFilePath);
          } catch (e) {
            console.error(e);
          }
          bigFilePath = './public/' + pictureToRemove.big_url;
          try {
            fs.unlinkSync(bigFilePath);
          } catch (e) {
            console.error(e);
          }
          user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].remove();
          user.save();
          Comment.findOne({
            "content.picture._id": pictureToRemove._id
          }).run(function(err, comment) {
            return comment.remove();
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
    });
    app.put('/profiles/picture/:pictureId', function(req, res) {
      var pictureId;
      pictureId = req.params.pictureId;
      return User.findOne({
        'picture_sets.pictures._id': pictureId,
        _id: req.user._id
      }).run(function(err, user) {
        var key, picture, pictureIndex, pictureIndexToGo, pictureSet, pictureSetIndex, pictureSetIndexToGo, value, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
        if (user) {
          pictureSetIndex = -1;
          pictureIndex = -1;
          pictureSetIndexToGo = -1;
          pictureIndexToGo = -1;
          _ref = user.picture_sets;
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
          _ref3 = user.picture_sets[pictureSetIndexToGo].pictures;
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            picture = _ref3[_k];
            picture.primary = false;
          }
          delete req.body._id;
          _ref4 = req.body;
          for (key in _ref4) {
            value = _ref4[key];
            user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo][key] = value;
          }
          user.save();
          return res.json({
            success: true
          });
        } else {
          return res.json({
            success: false
          });
        }
      });
    });
    app.post('/profiles/upload', function(req, res) {
      var bigFilePath, bigRelativeFilePath, currentUser, description, dirPath, fileExtension, fileName, filePath, mediumFilePath, mediumRelativeFilePath, newPicture, newPictureData, pictureSetId, relativeDirPath, relativeFilePath, thumbFilePath, thumbRelativeFilePath, ws;
      currentUser = req.user ? req.user : {};
      pictureSetId = req.query.setId;
      fileName = req.query.qqfile;
      description = req.query.description;
      fileExtension = fileName.substring(fileName.length - 3).toLowerCase();
      fileName = new Date().getTime();
      dirPath = './public/users/' + pictureSetId + '/';
      relativeDirPath = '/users/' + pictureSetId + '/';
      filePath = dirPath + fileName + '.' + fileExtension;
      thumbFilePath = dirPath + fileName + '_thumb.' + fileExtension;
      mediumFilePath = dirPath + fileName + '_medium.' + fileExtension;
      bigFilePath = dirPath + fileName + '_big.' + fileExtension;
      relativeFilePath = relativeDirPath + fileName + '.' + fileExtension;
      thumbRelativeFilePath = relativeDirPath + fileName + '_thumb.' + fileExtension;
      mediumRelativeFilePath = relativeDirPath + fileName + '_medium.' + fileExtension;
      bigRelativeFilePath = relativeDirPath + fileName + '_big.' + fileExtension;
      newPictureData = {
        url: relativeFilePath,
        thumb_url: thumbRelativeFilePath,
        medium_url: mediumRelativeFilePath,
        big_url: bigRelativeFilePath,
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
          return User.findOne({
            'picture_sets._id': pictureSetId,
            _id: req.user._id
          }).run(function(err, user) {
            var im, newPicturePosition, pictureSet, pictureSetIndex, pictureSets, _i, _len;
            if (user) {
              pictureSets = user.picture_sets;
              newPicturePosition = null;
              pictureSetIndex = -1;
              for (_i = 0, _len = pictureSets.length; _i < _len; _i++) {
                pictureSet = pictureSets[_i];
                pictureSetIndex++;
                if ("" + pictureSet._id === "" + pictureSetId) {
                  if (!pictureSet.pictures.length) newPictureData.primary = true;
                  newPicturePosition = pictureSet.pictures.push(newPictureData);
                  break;
                }
              }
              user.picture_sets = pictureSets;
              user.save();
              newPicture = user.picture_sets[pictureSetIndex].pictures[newPicturePosition - 1];
              newPicture.success = true;
              im = require('imagemagick');
              return im.crop({
                srcPath: filePath,
                dstPath: thumbFilePath,
                width: 110,
                height: 85,
                quality: 1
              }, function(err, stdout, stderr) {
                if (err) console.log(err);
                if (err) console.log(stderr);
                return im.crop({
                  srcPath: filePath,
                  dstPath: mediumFilePath,
                  width: 420,
                  height: 290,
                  quality: 1
                }, function(err, stdout, stderr) {
                  if (err) console.log(err);
                  if (err) console.log(stderr);
                  return im.resize({
                    srcPath: filePath,
                    dstPath: bigFilePath,
                    width: 800,
                    height: 600,
                    quality: 1
                  }, function(err, stdout, stderr) {
                    var comment;
                    if (err) console.log(err);
                    if (err) console.log(stderr);
                    comment = new Comment({
                      from_id: currentUser._id,
                      to_id: user._id,
                      wall_id: user._id,
                      type: "status",
                      content: {
                        type: "new_picture",
                        picture_set_id: user.picture_sets[pictureSetIndex]._id,
                        picture_set_name: user.picture_sets[pictureSetIndex].name,
                        picture: newPicture
                      }
                    });
                    comment.save();
                    return res.json(newPicture);
                  });
                });
              });
            } else {
              return res.json({
                success: false
              });
            }
          });
        });
      } else {
        return res.json({
          success: false
        });
      }
    });
    app.get('/children/:user_id', function(req, res) {
      var userId;
      userId = req.params.user_id;
      return User.findOne({
        _id: userId
      }).run(function(err, user) {
        if (user.type === "class") {
          return Child.find({
            user_id: userId
          }).run(function(err, children) {
            return res.render('children/children', {
              children: children,
              layout: false
            });
          });
        } else {
          return User.find({
            master_id: userId
          }).run(function(err, classes) {
            var classesIds, daycareClass, _i, _len;
            classesIds = [];
            for (_i = 0, _len = classes.length; _i < _len; _i++) {
              daycareClass = classes[_i];
              classesIds.push(daycareClass._id);
            }
            return Child.find().where("user_id")["in"](classesIds).run(function(err, children) {
              return res.render('children/children', {
                children: children,
                layout: false
              });
            });
          });
        }
      });
    });
    app.post('/child', function(req, res) {
      var child, currentUser, data;
      currentUser = req.user ? req.user : {};
      data = req.body;
      child = new Child(data);
      return child.save(function() {
        return res.json({
          success: true
        });
      });
    });
    app.put('/child/:id', function(req, res) {
      var childId, currentUser, data;
      childId = req.params.id;
      currentUser = req.user ? req.user : {};
      data = req.body;
      delete data._id;
      return Child.update({
        _id: childId
      }, data, {}, function(err, child) {
        return res.json({
          success: true
        });
      });
    });
    app.del('/child/:id', function(req, res) {
      var childId, currentUser;
      childId = req.params.id;
      currentUser = req.user ? req.user : {};
      return Child.remove({
        _id: childId
      }, function(err) {
        return res.json({
          success: true
        });
      });
    });
    app.get('/classes/:master_id', function(req, res) {
      var masterId;
      masterId = req.params.master_id;
      return User.find({
        master_id: masterId
      }).run(function(err, classes) {
        if (classes == null) classes = [];
        return res.render('profiles/profiles', {
          profiles: classes,
          layout: false
        });
      });
    });
    app.get('/parents/:daycare_id', function(req, res) {
      var daycareId;
      daycareId = req.params.daycare_id;
      return User.findOne({
        _id: daycareId
      }).run(function(err, dayCare) {
        return User.find({
          type: "parent"
        }).where("_id")["in"](dayCare.friends).run(function(err, parents) {
          var parent, parentIds, _i, _len;
          parentIds = [];
          for (_i = 0, _len = parents.length; _i < _len; _i++) {
            parent = parents[_i];
            parentIds = _.union(parentIds, parent.children_ids);
          }
          return Child.find().where("_id")["in"](parentIds).run(function(err, children) {
            var child, parent, _j, _k, _len2, _len3, _ref;
            for (_j = 0, _len2 = parents.length; _j < _len2; _j++) {
              parent = parents[_j];
              for (_k = 0, _len3 = children.length; _k < _len3; _k++) {
                child = children[_k];
                if (_ref = child._id, __indexOf.call(parent.children_ids, _ref) >= 0) {
                  parent.children.push(child);
                }
              }
            }
            return res.render('profiles/profiles', {
              profiles: parents,
              layout: false
            });
          });
        });
      });
    });
    return app.get('/staff/:daycare_id', function(req, res) {
      var daycareId;
      daycareId = req.params.daycare_id;
      return User.findOne({
        _id: daycareId
      }).run(function(err, dayCare) {
        return User.find({
          type: "staff"
        }).where("_id")["in"](dayCare.friends).run(function(err, staff) {
          return res.render('profiles/profiles', {
            profiles: staff,
            layout: false
          });
        });
      });
    });
  };

}).call(this);
