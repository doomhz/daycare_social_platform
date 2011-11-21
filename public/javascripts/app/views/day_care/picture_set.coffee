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
        $pictureDescription = that.$('#new-picture-description')
        that.uploader = new qq.FileUploader
          element: document.getElementById('picture-uploader')
          action: 'day-cares/upload'
          debug: false
          onSubmit: (id, fileName)->
            that.uploader.setParams
              setId: that.model.get('_id')
              description: $pictureDescription.val()
          onComplete: (id, fileName, responseJSON)->
            $pictureDescription.val('')
            that.model.pictures.add(responseJSON)

        that.picturesListView = new Kin.DayCare.PicturesListView
          el: that.$('#pictures-list')
          collection: that.model.pictures
        that.picturesListView.render()
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @