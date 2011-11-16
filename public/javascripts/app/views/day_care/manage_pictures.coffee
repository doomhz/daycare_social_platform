class window.Kin.DayCare.ManagePicturesView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/manage_pictures.html'

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
        $el.html(tpl({dayCare: that.model}))
        that.uploader = new qq.FileUploader
          element: document.getElementById('picture-uploader')
          action: 'day-cares/upload'
          debug: false
          onSubmit: (id, fileName)->
            that.uploader.setParams
              dayCareId: that.model.get('_id')
              setId: that.$('#picture-set-list option:selected').val()
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @