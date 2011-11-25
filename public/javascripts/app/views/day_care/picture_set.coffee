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
            that.model.save({name: data}, {silent: true})
        
        that.$('#picture-set-type-select').doomEdit
          ajaxSubmit: false
          autoDisableBt: false
          editField: '<select name="setTypeSelect"><option value="daycare">Public</option><option value="default">Private</option></select>'
          onStartEdit: ($form, $elem)->
            $form.find('select').val($elem.data('type'))
          afterFormSubmit: (data, $form, $el)->
            $el.text($form.find('select >option:selected').text())
            $el.data('type', data)
            that.model.save({type: data}, {silent: true})
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @picturesListView.remove()
    @