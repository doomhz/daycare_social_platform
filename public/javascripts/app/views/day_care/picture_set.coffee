class window.Kin.DayCare.PictureSetView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/picture_set.html'

  uploader: null

  initialize: (options = {})->
    @model and @model.view = @
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
          uploadButtonText: 'add photos'
          onSubmit: (id, fileName)->
            that.uploader.setParams
              setId: that.model.get('_id')
          onComplete: (id, fileName, responseJSON)->
            that.model.pictures.add(responseJSON)

        if not that.picturesListView
          that.picturesListView = new Kin.DayCare.PicturesListView
            el: that.$('#pictures-list')
            collection: that.model.pictures
        that.picturesListView.render()
        
        that.$('#picture-set-text-edit').doomEdit
          ajaxSubmit: false
          afterFormSubmit: (data, form, $el)->
            $el.text(data)
            that.model.set({name: data}, {silent: true})
            that.model.save(null, {silent: true})
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    that.picturesListView.remove()
    @