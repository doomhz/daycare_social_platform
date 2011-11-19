class window.Kin.DayCare.PictureSetView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/picture_set.html'

  uploader: null

  initialize: (options = {})->
    @model and @model.view = @
    @maps = options.maps
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({pictureSet: that.model}))
        that.uploader = new qq.FileUploader
          element: document.getElementById('picture-uploader')
          action: 'day-cares/upload'
          debug: false
          onSubmit: (id, fileName)->
            that.uploader.setParams
              setId: that.model.get('_id')
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @