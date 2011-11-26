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

  app.get '/day-cares/:id', (req, res)->
    DayCare.findOne({_id: req.params.id}).run (err, dayCare) ->
      res.json dayCare

  app.put '/day-cares/:id', (req, res)->
    data = req.body
    delete data._id
    DayCare.update {_id: req.params.id}, data, {}, (err, dayCare) ->
      # TODO Delete pictures here
      res.json {success: true}

  app.get '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictureSet.daycare_id = dayCare._id

      res.json pictureSet

  app.put '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSetIndexToEdit = -1
      
      for pictureSet in dayCare.picture_sets
        pictureSetIndexToEdit++
        if pictureSet._id + "" is pictureSetId + ""
          break;

      delete req.body._id
      for key, value of req.body
        dayCare.picture_sets[pictureSetIndexToEdit][key] = value
      dayCare.save()

      res.json {success: true}

  app.del '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictureSet.remove()
      dayCare.save()

      for picture in pictureSet.pictures
        filePath = './public/' + picture.url
        try
          fs.unlinkSync(filePath)
        catch e
          console.error e
      
      filePath = './public/daycares/' + pictureSetId
      try
        fs.rmdirSync(filePath)
      catch e
        console.error e

      res.json {success: true}

  app.get '/day-cares/pictures/:pictureSetId', (req, res)->
    pictureSetId = req.params.pictureSetId
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictures = pictureSet.pictures

      res.json pictures

  app.del '/day-cares/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    DayCare.findOne({'picture_sets.pictures._id': pictureId}).run (err, dayCare) ->
      pictureSetIndex = -1
      pictureIndex = -1
      pictureSetIndexToGo = -1
      pictureIndexToGo = -1

      for pictureSet in dayCare.picture_sets
        pictureSetIndex++
        pictureIndex = -1
        for picture in pictureSet.pictures
          pictureIndex++
          if "#{picture._id}" is "#{pictureId}"
            pictureSetIndexToGo = pictureSetIndex
            pictureIndexToGo = pictureIndex
            break

      filePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].url
      try
        fs.unlinkSync(filePath)
      catch e
        console.error e

      thumbFilePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].thumb_url
      try
        fs.unlinkSync(thumbFilePath)
      catch e
        console.error e

      mediumFilePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].medium_url
      try
        fs.unlinkSync(mediumFilePath)
      catch e
        console.error e
      
      bigFilePath = './public/' + dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].big_url
      try
        fs.unlinkSync(bigFilePath)
      catch e
        console.error e
      
      dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].remove()
      dayCare.save()

      res.json {success: true}

  app.put '/day-cares/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    DayCare.findOne({'picture_sets.pictures._id': pictureId}).run (err, dayCare) ->
      pictureSetIndex = -1
      pictureIndex = -1
      pictureSetIndexToGo = -1
      pictureIndexToGo = -1

      for pictureSet in dayCare.picture_sets
        pictureSetIndex++
        pictureIndex = -1
        for picture in pictureSet.pictures
          pictureIndex++
          if "#{picture._id}" is "#{pictureId}"
            pictureSetIndexToGo = pictureSetIndex
            pictureIndexToGo = pictureIndex
            break

      for picture in dayCare.picture_sets[pictureSetIndexToGo].pictures
        picture.primary = false

      delete req.body._id
      for key, value of req.body
        dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo][key] = value
      
      dayCare.save()

      res.json {success: true}

  app.post '/day-cares/upload', (req, res)->
    pictureSetId = req.query.setId
    fileName = req.query.qqfile
    description = req.query.description

    fileExtension = fileName.substring(fileName.length - 3).toLowerCase()
    fileName = new Date().getTime()
    dirPath = './public/daycares/' + pictureSetId + '/'
    relativeDirPath = '/daycares/' + pictureSetId + '/'
    filePath = dirPath + fileName + '.' + fileExtension
    thumbFilePath = dirPath + fileName + '_thumb.' + fileExtension
    mediumFilePath = dirPath + fileName + '_medium.' + fileExtension
    bigFilePath = dirPath + fileName + '_big.' + fileExtension
    relativeFilePath = relativeDirPath + fileName + '.' + fileExtension
    thumbRelativeFilePath = relativeDirPath + fileName + '_thumb.' + fileExtension
    mediumRelativeFilePath = relativeDirPath + fileName + '_medium.' + fileExtension
    bigRelativeFilePath = relativeDirPath + fileName + '_big.' + fileExtension
    
    newPictureData =
      url: relativeFilePath
      thumb_url: thumbRelativeFilePath
      medium_url: mediumRelativeFilePath
      big_url: bigRelativeFilePath
      description: description

    newPicture = null

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

      req.on 'end', ()->
        DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
          pictureSets = dayCare.picture_sets

          newPicturePosition = null
          pictureSetIndex = -1

          for pictureSet in pictureSets
            pictureSetIndex++
            if "" + pictureSet._id is "" + pictureSetId
              newPicturePosition = pictureSet.pictures.push(newPictureData)
              break

          dayCare.picture_sets = pictureSets

          dayCare.save()

          newPicture = dayCare.picture_sets[pictureSetIndex].pictures[newPicturePosition - 1]
          newPicture.success = true

          im = require 'imagemagick'
          im.crop(
              srcPath: filePath
              dstPath: thumbFilePath
              width: 160
              height: 130
              quality: 1
            , (err, stdout, stderr)->
              if err
                console.log err
              if err
                console.log stderr
              
              im.crop(
                  srcPath: filePath
                  dstPath: mediumFilePath
                  width: 420
                  height: 290
                  quality: 1
                , (err, stdout, stderr)->
                  if err
                    console.log err
                  if err
                    console.log stderr
                  
                  im.crop(
                      srcPath: filePath
                      dstPath: bigFilePath
                      width: 800
                      height: 600
                      quality: 1
                    , (err, stdout, stderr)->
                      if err
                        console.log err
                      if err
                        console.log stderr
                      
                      res.json newPicture
                  )
              )
          )
          
          

    else
      res.json {success: false}
