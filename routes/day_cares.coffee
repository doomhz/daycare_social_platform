DayCare = require('../models/day_care');
fs = require('fs')

module.exports = (app)->

  app.get '/day-cares', (req, res)->
    DayCare.find({}).desc('created_at').run (err, dayCares) ->
      res.json dayCares

  ###
  app.param 'id', (req, res, next, id)->
    DayCare.findOne({ _id : req.params.id }, (err, dayCare)->
      if (err) return next(err);
      if (!dayCare) return next(new Error('Failed to load article ' + id));
      req.dayCare = dayCare
      next()
  ###

  app.get '/day-cares/load/:id', (req, res)->
    DayCare.findOne({_id: req.params.id}).run (err, dayCare) ->
      res.json dayCare

  app.put '/day-cares/load/:id', (req, res)->
    data = req.body
    delete data._id
    DayCare.update {_id: req.params.id}, data, {}, (err, dayCare) ->
      res.json {success: true}

  app.get '/day-cares/view/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictureSet.daycare_id = dayCare._id

      res.json pictureSet

  app.post '/day-cares/upload', (req, res)->
    pictureSetId = req.query.setId
    fileName = req.query.qqfile

    fileExtension = fileName.substring(fileName.length - 3)
    fileName = new Date().getTime()
    dirPath = './public/daycares/' + pictureSetId + '/'
    relativeDirPath = '/daycares/' + pictureSetId + '/'
    filePath = dirPath + fileName + '.' + fileExtension
    relativeFilePath = relativeDirPath + fileName + '.' + fileExtension

    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSets = dayCare.picture_sets

      for pictureSet in pictureSets
        if "" + pictureSet._id is "" + pictureSetId
          pictureSet.pictures.push({url: relativeFilePath})

      dayCare.picture_sets = pictureSets

      dayCare.save()

    if req.xhr

        try
          fs.statSync(dirPath)
        catch e
          fs.mkdirSync(dirPath, 0777)

        ws = fs.createWriteStream(filePath)

        try
          fs.chmodSync(filePath, 777)
        catch e
          

        req.on 'data', (data)->
          ws.write(data)

        res.json {success: true}
    else
      res.json {success: false}
