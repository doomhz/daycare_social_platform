User    = require('../models/user')
Comment = require('../models/comment')
fs      = require('fs')

module.exports = (app)->

  app.get '/profiles', (req, res)->
    User.find().asc('name', 'surname').run (err, users)->
      # TODO Filter public data
      res.render 'profiles/profiles', {profiles: users, show_private: false, layout: false}

  app.get '/daycares', (req, res)->
    User.find({type: 'daycare'}).desc('created_at').run (err, daycares) ->
      res.render 'profiles/profiles', {profiles: daycares, show_private: false, layout: false}

  app.get '/profiles/:id', (req, res)->
    User.findOne({_id: req.params.id}).run (err, user) ->
      currentUser = if req.user then req.user else {}
      showPrivate = currentUser._id is user._id
      res.render 'profiles/profile', {profile: user, show_private: showPrivate, layout: false}

  app.put '/profiles/:id', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    delete data._id
    User.update {_id: currentUser._id}, data, {}, (err, user) ->
      # TODO Delete pictures here
      res.json {success: true}

  app.get '/profiles/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    currentUser = if req.user then req.user else {}
    User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
      pictureSet = user.picture_sets.id(pictureSetId)
      pictureSet.user_id = user._id
      showPrivate = currentUser._id is user._id
      res.render 'profiles/_picture_set', {picture_set: pictureSet, show_private: showPrivate, layout: false}

  app.put '/profiles/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    User.findOne({'picture_sets._id': pictureSetId, _id: req.user._id}).run (err, user) ->
      if user
        pictureSetIndexToEdit = -1

        for pictureSet in user.picture_sets
          pictureSetIndexToEdit++
          if pictureSet._id + "" is pictureSetId + ""
            break;

        delete req.body._id
        for key, value of req.body
          user.picture_sets[pictureSetIndexToEdit][key] = value
        user.save()

        res.json {success: true}
      else
        res.json {success: false}

  app.del '/profiles/picture-set/:id', (req, res)->
    pictureSetId = req.params.id
    User.findOne({'picture_sets._id': pictureSetId, _id: req.user._id}).run (err, user) ->
      if user
        pictureSet = user.picture_sets.id(pictureSetId)
        pictureSet.remove()
        user.save()

        for picture in pictureSet.pictures
          filePath = './public/' + picture.url
          try
            fs.unlinkSync(filePath)
          catch e
            console.error e

        filePath = './public/users/' + pictureSetId
        try
          fs.rmdirSync(filePath)
        catch e
          console.error e

        res.json {success: true}
      else
        res.json {success: false}

  app.get '/profiles/pictures/:pictureSetId', (req, res)->
    pictureSetId = req.params.pictureSetId
    currentUser = if req.user then req.user else {}
    User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
      pictureSet = user.picture_sets.id(pictureSetId)
      pictures = pictureSet.pictures
      showPrivate = currentUser._id is user._id
      res.render 'profiles/pictures', {pictures: pictures, show_private: showPrivate, layout: false}

  app.del '/profiles/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    User.findOne({'picture_sets.pictures._id': pictureId, _id: req.user._id}).run (err, user) ->
      if user
        pictureSetIndex = -1
        pictureIndex = -1
        pictureSetIndexToGo = -1
        pictureIndexToGo = -1

        for pictureSet in user.picture_sets
          pictureSetIndex++
          pictureIndex = -1
          for picture in pictureSet.pictures
            pictureIndex++
            if "#{picture._id}" is "#{pictureId}"
              pictureSetIndexToGo = pictureSetIndex
              pictureIndexToGo = pictureIndex
              break

        pictureToRemove = user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo]

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

        user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo].remove()
        user.save()

        Comment.findOne({"content.picture._id": pictureToRemove._id}).run (err, comment)->
          comment.remove()

        res.json {success: true}
      else
        res.json {success: false}

  app.put '/profiles/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    User.findOne({'picture_sets.pictures._id': pictureId, _id: req.user._id}).run (err, user) ->
      if user
        pictureSetIndex = -1
        pictureIndex = -1
        pictureSetIndexToGo = -1
        pictureIndexToGo = -1

        for pictureSet in user.picture_sets
          pictureSetIndex++
          pictureIndex = -1
          for picture in pictureSet.pictures
            pictureIndex++
            if "#{picture._id}" is "#{pictureId}"
              pictureSetIndexToGo = pictureSetIndex
              pictureIndexToGo = pictureIndex
              break

        for picture in user.picture_sets[pictureSetIndexToGo].pictures
          picture.primary = false

        delete req.body._id
        for key, value of req.body
          user.picture_sets[pictureSetIndexToGo].pictures[pictureIndexToGo][key] = value

        user.save()

        res.json {success: true}
      else
        res.json {success: false}

  app.post '/profiles/upload', (req, res)->
    currentUser = if req.user then req.user else {}
    pictureSetId = req.query.setId
    fileName = req.query.qqfile
    description = req.query.description

    fileExtension = fileName.substring(fileName.length - 3).toLowerCase()
    fileName = new Date().getTime()
    dirPath = './public/users/' + pictureSetId + '/'
    relativeDirPath = '/users/' + pictureSetId + '/'
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
        User.findOne({'picture_sets._id': pictureSetId, _id: req.user._id}).run (err, user) ->
          if user
            pictureSets = user.picture_sets

            newPicturePosition = null
            pictureSetIndex = -1

            for pictureSet in pictureSets
              pictureSetIndex++
              if "" + pictureSet._id is "" + pictureSetId
                if not pictureSet.pictures.length
                  newPictureData.primary = true
                newPicturePosition = pictureSet.pictures.push(newPictureData)
                break

            user.picture_sets = pictureSets

            user.save()

            newPicture = user.picture_sets[pictureSetIndex].pictures[newPicturePosition - 1]
            newPicture.success = true

            im = require 'imagemagick'
            im.crop(
                srcPath: filePath
                dstPath: thumbFilePath
                width: 110
                height: 85
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

                    im.resize(
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
                          from_id: currentUser._id
                          to_id: user._id
                          wall_id: user._id
                          type: "status"
                          content:
                            type: "new_picture"
                            picture_set_id: user.picture_sets[pictureSetIndex]._id
                            picture_set_name: user.picture_sets[pictureSetIndex].name
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


