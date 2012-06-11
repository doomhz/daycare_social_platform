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
      height: 110
      method: "crop"
    thumb:
      width:  150
      height: 150
      method: "crop"
    medium:
      width:  568
      height: 393
      method: "crop"
    big:
      width:  800
      height: 600
      method: "resize"

  itemProcessing: 0

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
    #index        = 0
    filtersTotal = Object.keys(@resizeFilters).length
    for name, options of @resizeFilters
      #index++
      #callback = if index is filtersTotal then onFinishCallback else undefined
      @resize(name, options, onFinishCallback)

  resize: (name, options, callback)->
    filePath  = @getFilePath()
    filePaths = @getFilePaths()
    @itemProcessing++
    im[options.method](
        srcPath: filePaths.url
        dstPath: filePaths["#{name}_url"]
        width:   options.width
        height:  options.height
        quality: 1
      , (err, stdout, stderr)=>
        if err
          console.log err
        if stderr
          console.log stderr
        @itemProcessing--
        if typeof callback is "function" and @itemProcessing <= 0
          callback(err, stdout, stderr)
    )


exports = module.exports = ImageUploader
