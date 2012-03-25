describe "ImageUploader", ()->
  ImageUploader    = require "../../../models/image_uploader"

  imageUploader    = undefined
  rootPath         = "./public/users/"
  relativeRootPath = "/users/"

  beforeEach ()->
    imageUploader = new ImageUploader
    imageUploader.pictureSetId = "id"
    imageUploader.baseName     = "base_name"
    imageUploader.extName      = "ext_name"

  it "has a root path", ()->
    expect(imageUploader.rootPath).toEqual(rootPath)

  it "has a relative root path", ()->
    expect(imageUploader.relativeRootPath).toEqual(relativeRootPath)

  describe "getDirPath", ()->
    it "returns the image dir path", ()->
      expect(imageUploader.getDirPath()).toEqual("#{rootPath}id/")

    it "returns the relative image dir path when true given", ()->
      expect(imageUploader.getDirPath(true)).toEqual("#{relativeRootPath}id/")

  describe "getFilePath", ()->
    it "returns the file path", ()->
      expect(imageUploader.getFilePath()).toEqual("#{rootPath}id/base_name.ext_name")

    it "returns the relative file path when true given", ()->
      expect(imageUploader.getFilePath(true)).toEqual("#{relativeRootPath}id/base_name.ext_name")

  describe "setExtensionFromFilename", ()->
    it "sets the extension from the given file name", ()->
      imageUploader.setExtensionFromFilename("file_name.ext")
      expect(imageUploader.extName).toEqual("ext")

  describe "getFilePaths", ()->
    pictureData = undefined

    beforeEach ()->
      pictureData =
        url:        "#{rootPath}id/base_name.ext_name"
        tiny_url:   "#{rootPath}id/base_name_tiny.ext_name"
        mini_url:   "#{rootPath}id/base_name_mini.ext_name"
        small_url:  "#{rootPath}id/base_name_small.ext_name"
        thumb_url:  "#{rootPath}id/base_name_thumb.ext_name"
        medium_url: "#{rootPath}id/base_name_medium.ext_name"
        big_url:    "#{rootPath}id/base_name_big.ext_name"

    it "returns the picture data", ()->
      expect(imageUploader.getFilePaths()).toEqual(pictureData)

  describe "resizeAll", ()->
    onFinishCallback = undefined

    beforeEach ()->
      onFinishCallback = createSpy("onFinishCallback")
      spyOn(imageUploader, "resize")

    it "resizes the pictures for each filter", ()->
      imageUploader.resizeAll(onFinishCallback)
      index = 0
      for name, options of imageUploader.resizeFilters
        index++
        if index is Object.keys(imageUploader.resizeFilters).length
          expect(imageUploader.resize).toHaveBeenCalledWith(name, options, onFinishCallback)
        else
          expect(imageUploader.resize).toHaveBeenCalledWith(name, options, undefined)



