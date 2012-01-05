DayCare = require('../models/day_care')
User    = require('../models/user')
Comment = require('../models/comment')
fs      = require('fs')

module.exports = (app)->

  app.get '/day-cares', (req, res)->
    DayCare.find({}).desc('created_at').run (err, dayCares) ->
      res.json dayCares

  app.get '/day-cares/:id', (req, res)->
    DayCare.findOne({_id: req.params.id}).run (err, dayCare) ->
      currentUser = if req.user then req.user else {}
      res.json dayCare.filterPrivateDataByUserId(currentUser._id)

  app.put '/day-cares/:id', (req, res)->
    user = if req.user then req.user else {}
    data = req.body
    delete data._id
    DayCare.update {_id: req.params.id, user_id: user._id}, data, {}, (err, dayCare) ->
      # TODO Delete pictures here
      if not err
        User.findOne({_id: user._id}).run (err, usr)->
          usr.daycare_name = data.name
          req.user.daycare_name = data.name
          usr.save()
          res.json {success: true}
      else
        res.json {success: false}

  app.get '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    currentUser = if req.user then req.user else {}
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictureSet = DayCare.filterPrivatePictureSetsByUserId(currentUser._id, dayCare.user_id, [pictureSet])[0]
      pictureSet.daycare_id = dayCare._id
      
      res.json pictureSet

  app.put '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId, user_id: req.user._id}).run (err, dayCare) ->
      if dayCare
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
      else
        res.json {success: false}

  app.del '/day-cares/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    DayCare.findOne({'picture_sets._id': pictureSetId, user_id: req.user._id}).run (err, dayCare) ->
      if dayCare
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
      else
        res.json {success: false}

  app.get '/day-cares/pictures/:pictureSetId', (req, res)->
    pictureSetId = req.params.pictureSetId
    currentUser = if req.user then req.user else {}
    DayCare.findOne({'picture_sets._id': pictureSetId}).run (err, dayCare) ->
      pictureSet = dayCare.picture_sets.id(pictureSetId)
      pictureSet = DayCare.filterPrivatePictureSetsByUserId(currentUser._id, dayCare.user_id, [pictureSet])[0] or {}
      pictures = pictureSet.pictures

      res.json pictures

  app.del '/day-cares/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    DayCare.findOne({'picture_sets.pictures._id': pictureId, user_id: req.user._id}).run (err, dayCare) ->
      if dayCare  
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
        
        pictureToRemove = dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo]

        filePath = './public/' + pictureToRemove.url
        try
          fs.unlinkSync(filePath)
        catch e
          console.error e

        thumbFilePath = './public/' + pictureToRemove.thumb_url
        try
          fs.unlinkSync(thumbFilePath)
        catch e
          console.error e

        mediumFilePath = './public/' + pictureToRemove.medium_url
        try
          fs.unlinkSync(mediumFilePath)
        catch e
          console.error e
      
        bigFilePath = './public/' + pictureToRemove.big_url
        try
          fs.unlinkSync(bigFilePath)
        catch e
          console.error e
      
        dayCare.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].remove()
        dayCare.save()
        
        Comment.findOne({"content.picture._id": pictureToRemove._id}).run (err, comment)->
          comment.remove()

        res.json {success: true}
      else
        res.json {success: false}

  app.put '/day-cares/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    DayCare.findOne({'picture_sets.pictures._id': pictureId, user_id: req.user._id}).run (err, dayCare) ->
      if dayCare
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
      else
        res.json {success: false}

  app.post '/day-cares/upload', (req, res)->
    user = if req.user then req.user else {}
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
        DayCare.findOne({'picture_sets._id': pictureSetId, user_id: req.user._id}).run (err, dayCare) ->
          if dayCare
            pictureSets = dayCare.picture_sets

            newPicturePosition = null
            pictureSetIndex = -1

            for pictureSet in pictureSets
              pictureSetIndex++
              if "" + pictureSet._id is "" + pictureSetId
                if not pictureSet.pictures.length
                  newPictureData.primary = true
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
                      
                        comment = new Comment
                          from_id: user._id
                          to_id: dayCare._id
                          wall_id: dayCare._id
                          type: "status"
                          content:
                            type: "new_picture"
                            picture_set_id: dayCare.picture_sets[pictureSetIndex]._id
                            picture_set_name: dayCare.picture_sets[pictureSetIndex].name
                            picture: newPicture
                        
                        comment.save()
                      
                        res.json newPicture
                    )
                )
            )
          else
            res.json {success: false}

    else
      res.json {success: false}

        
