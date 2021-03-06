User          = require('../models/user')
Comment       = require('../models/comment')
Child         = require('../models/child')
InfoSection   = require('../models/info_section')
ImageUploader = require('../lib/image_uploader')
fs            = require('fs')
_             = require('underscore')
_s            = require('underscore.string')

module.exports = (app)->

  app.get '/profiles', (req, res)->
    currentUser = if req.user then req.user else {}
    User.find().where("_id").in(currentUser.friends).asc('name', 'surname').run (err, users)->
      res.render 'profiles/profiles', {profiles: users, show_private: false, layout: false}

  app.get '/profiles/quick-search', (req, res)->
    currentUser = if req.user then req.user else {}
    q = req.query.q
    limit = req.query.limit
    searchSlug = new RegExp("^#{q}.*$", "i")
    User.find().or([{name: searchSlug}, {surname: searchSlug}]).where("type").in(["daycare", "parent", "staff"]).limit(limit).asc('name', 'surname').run (err, users)->
      res.render 'profiles/quick_search', {layout: false, profiles: users, _: _}

  app.get '/daycares', (req, res)->
    addressComponents = req.query.address_components or {}
    city = addressComponents.city or false
    stateCode = addressComponents.state_code or false
    zipCode = addressComponents.zip_code or false
    query = User.find({type: 'daycare'}).desc('name')
    if city and stateCode
      city = _s.titleize city
      stateCode = stateCode.toUpperCase()
      query
      .where("location_components.city", city)
      .where("location_components.state_code", stateCode)
    if zipCode
      query
      .where("location_components.zip_code", zipCode)
    query.run (err, daycares = []) ->
      res.render 'profiles/profiles', {profiles: daycares, show_private: false, layout: false}

  app.get '/day-care/section/:section_name/:daycare_id', (req, res)->
    daycareId   = req.params.daycare_id
    sectionName = req.params.section_name.replace(/-/g, "_")

    InfoSection.findOne({user_id: daycareId}).run (err, infoSection)->
      if infoSection
        res.json infoSection[sectionName]
      else
        res.json {}

  app.put '/day-care/section/:section_name/:daycare_id', (req, res)->
    daycareId   = req.params.daycare_id
    sectionName = req.params.section_name.replace(/-/g, "_")
    data = {}
    data[sectionName] = req.body

    InfoSection.findOne({user_id: daycareId}).run (err, infoSection)->
      if infoSection
        infoSection.set(data)
      else
        infoSection = new InfoSection(data)
        infoSection.user_id = daycareId
      infoSection.save()

    res.json {success: true}

  app.get '/profiles/me', (req, res)->
    currentUser = if req.user then req.user else {}
    User.findOne({_id: currentUser._id}).run (err, user)->
      if user
        user.findDaycareFriends ()->
          res.render 'profiles/_user', {profile: user, show_private: true, layout: false}
      else
        res.statusCode = 401
        res.json {"error": true}

  app.post '/profiles', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    user = new User(data)
    user.master_id = currentUser._id
    user.friends.push(currentUser._id)
    if not user.picture_sets.length
      profilePicturesSet =
        type: 'profile'
        name: 'Profile pictures'
        description: 'Your profile pictures.'
        pictures: []
      user.picture_sets.push(profilePicturesSet)
    user.save (err, savedUser)->
      currentUser.friends.push(savedUser._id)
      currentUser.save ()->
        res.json({success: true, _id: savedUser._id})

  app.get '/profiles/:id', (req, res)->
    User.findOne({_id: req.params.id}).run (err, user) ->
      currentUser = if req.user then req.user else {}
      showPrivate = currentUser._id is user._id
      res.render 'profiles/profile', {profile: user, show_private: showPrivate, layout: false}

  app.put '/profiles/:id', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body
    delete data._id
    User.update {_id: currentUser._id}, data, {}, (err, user)->
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
    User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
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
    User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
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

    User.findOne({'picture_sets.pictures._id': pictureId}).run (err, user) ->
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

        tinyFilePath = './public/' + pictureToRemove.tiny_url
        try
          fs.unlinkSync(tinyFilePath)
        catch e
          console.error e

        miniFilePath = './public/' + pictureToRemove.mini_url
        try
          fs.unlinkSync(miniFilePath)
        catch e
          console.error e

        smallFilePath = './public/' + pictureToRemove.small_url
        try
          fs.unlinkSync(smallFilePath)
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

        Comment.find({"content.type": "new_picture", "content.picture_set_id": user.picture_sets[pictureSetIndexToGo]._id}).run (err, comments = [])->
          if comments.length
            for comment in comments
              pictures = _.filter comment.content.pictures, (picture)->
                "#{picture._id}" isnt "#{pictureId}"
              if pictures.length
                Comment.update({_id: comment._id}, {"content.pictures": pictures}).run ()->
              else
                comment.remove()

        res.json {success: true}
      else
        res.json {success: false}

  app.put '/profiles/picture/:pictureId', (req, res)->
    pictureId = req.params.pictureId

    User.findOne({'picture_sets.pictures._id': pictureId}).run (err, user) ->
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

    imageUploader              = new ImageUploader
    imageUploader.pictureSetId = pictureSetId
    imageUploader.baseName     = new Date().getTime()
    imageUploader.setExtensionFromFilename(fileName)
    dirPath                    = imageUploader.getDirPath()
    filePath                   = imageUploader.getFilePath()
    filePaths                  = imageUploader.getFilePaths()
    relativeFilePaths          = imageUploader.getFilePaths(true)

    newPictureData             = relativeFilePaths
    newPictureData.description = description

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
        User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
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

            imageUploader.resizeAll ()->
                commentData =
                  from_id: currentUser._id
                  to_id: user._id
                  wall_id: user._id
                Comment.addNewPictureStatus(commentData, user.picture_sets[pictureSetIndex], newPicture)

                res.json newPicture
          else
            res.json {success: false}

    else

      if req.files and req.files.qqfile
        try
          fs.statSync(dirPath)
        catch e
          fs.mkdirSync(dirPath, 0777)

        try
          #fs.renameSync(req.files.qqfile.path, filePath)
          fs.writeFileSync(filePath, fs.readFileSync(req.files.qqfile.path))
        catch e
          console.log e

        try
          fs.chmodSync(filePath, 777)
        catch e

        User.findOne({'picture_sets._id': pictureSetId}).run (err, user) ->
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

            imageUploader.resizeAll ()->
                commentData =
                  from_id: currentUser._id
                  to_id: user._id
                  wall_id: user._id
                Comment.addNewPictureStatus(commentData, user.picture_sets[pictureSetIndex], newPicture)

                res.send JSON.stringify(newPicture)
          else
            res.send '{"success": false}'
      else
        res.send '{"success": false}'

  app.get '/children/:user_id', (req, res)->
    userId = req.params.user_id
    User.findOne({_id: userId}).run (err, user)->
      if user.type is "class"
        Child.find({user_id: userId}).run (err, children)->
          res.render 'children/children', {children: children, layout: false}
      else if user.type is "parent"
        Child.find().where("_id").in(user.children_ids).run (err, children)->
          res.render 'children/children', {children: children, layout: false}
      else
        User.find({master_id: userId}).run (err, classes)->
          classesIds = []
          for daycareClass in classes
            classesIds.push(daycareClass._id)
          Child.find().where("user_id").in(classesIds).run (err, children)->
            res.render 'children/children', {children: children, layout: false}

  app.post '/child', (req, res)->
    currentUser = if req.user then req.user else {}
    data = req.body

    child = new Child(data)
    child.save ()->
      User.findOne({_id: child.user_id}).run (err, daycareClass)->
        daycareClass.children_ids.push(child._id)
        daycareClass.children_ids = _.uniq(daycareClass.children_ids)
        daycareClass.save ()->
          res.json {success: true}

  app.put '/child/:id', (req, res)->
    childId = req.params.id
    currentUser = if req.user then req.user else {}
    data = req.body
    delete data._id

    Child.update {_id: childId}, data, {}, (err, child) ->
      res.json {success: true}

  app.del '/child/:id', (req, res)->
    childId = req.params.id
    currentUser = if req.user then req.user else {}

    Child.findOne({_id: childId}).run (err, child)->
      User.findOne({_id: child.user_id}).run (err, daycareClass)->
        daycareClass.children_ids = _.filter daycareClass.children_ids, (id)->
          id isnt childId
        daycareClass.save ()->
          child.remove (err)->
            res.json {success: true}

  app.get '/classes/:master_id', (req, res)->
    masterId = req.params.master_id
    User.find({master_id: masterId}).run (err, classes = [])->
      res.render 'profiles/profiles', {profiles: classes, layout: false}

  app.get '/parents/:daycare_id', (req, res)->
    daycareId = req.params.daycare_id
    currentUser = if req.user then req.user else {}
    if "#{daycareId}" is "#{currentUser._id}" or daycareId in currentUser.friends
      User.findOne({_id: daycareId}).run (err, dayCare)->
        User.find({type: "parent"}).where("_id").in(dayCare.friends).run (err, parents)->
          parentIds = []
          for parent in parents
            parentIds = _.union(parentIds, parent.children_ids)
          Child.find().where("_id").in(parentIds).run (err, children)->
            for parent in parents
              for child in children
                if child._id in parent.children_ids
                  parent.children.push(child)

            res.render 'profiles/profiles', {profiles: parents, layout: false}
    else
      res.render 'profiles/profiles', {profiles: [], layout: false}

  app.get '/staff/:daycare_id', (req, res)->
    daycareId = req.params.daycare_id
    User.findOne({_id: daycareId}).run (err, dayCare)->
      User.find({type: "staff"}).where("_id").in(dayCare.friends).run (err, staff)->
        res.render 'profiles/profiles', {profiles: staff, layout: false}

  app.put '/staff/:id', (req, res)->
    currentUser = if req.user then req.user else {}
    id = req.params.id
    data = req.body
    delete data._id
    delete data.email
    if (id in currentUser.friends and currentUser.type is "daycare") or (id is currentUser._id)
      User.update {_id: id}, data, {}, (err, user)->
        # TODO Delete pictures here
      res.json {success: true}
