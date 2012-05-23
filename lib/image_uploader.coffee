path = require "path"
im   = require "imagemagick"

class ImageUploader

  rootPath: "./public/users/"

  relativeRootPath: "/users/"

  baseName: null

  extName: null

  pictureSetId: null

  resizeFilters:
    tiny:
      width:  30
      height: 30
      method: "crop"
    mini:
      width:  50
      height: 50
      method: "crop"
    small:
      width:  110
      height: 85
      method: "crop"
    thumb:
      width:  140
      height: 140
      method: "crop"
    medium:
      width:  538
      height: 372
      method: "crop"
    big:
      width:  800
      height: 600
      method: "resize"

  getDirPath: (relative = false)->
    if relative
      return "#{@relativeRootPath}#{@pictureSetId}/"
    else
      return "#{@rootPath}#{@pictureSetId}/"

  getFilePath: (relativePath = false)->
    dirPath = @getDirPath(relativePath)
    "#{dirPath}#{@baseName}.#{@extName}"

  setExtensionFromFilename: (fileName)->
    @extName = path.extname(fileName).replace(/^\./, "")

  getFilePaths: (relativePath = false)->
    dirPath = @getDirPath(relativePath)
    pictureData =
      url:        "#{dirPath}#{@baseName}.#{@extName}"
    for name, options of @resizeFilters
      pictureData["#{name}_url"] = "#{dirPath}#{@baseName}_#{name}.#{@extName}"
    pictureData

  resizeAll: (onFinishCallback)->
    index        = 0
    filtersTotal = Object.keys(@resizeFilters).length
    for name, options of @resizeFilters
      index++
      callback = if index is filtersTotal then onFinishCallback else undefined
      @resize(name, options, callback)

  resize: (name, options, callback)->
    filePath  = @getFilePath()
    filePaths = @getFilePaths()
    im[options.method](
        srcPath: filePaths.url
        dstPath: filePaths["#{name}_url"]
        width:   options.width
        height:  options.height
        quality: 1
      , (err, stdout, stderr)->
        if err
          console.log err
        if stderr
          console.log stderr
        if typeof callback is "function"
          callback(err, stdout, stderr)
    )


exports = module.exports = ImageUploader
