class window.Kin.DayCare.PicturesListView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/pictures_list.html'

  events:
    'click .delete-pic-bt': 'deletePicture'
    'click .primary-pic-bt': 'setAsPrimaryPicture'

  canEdit: null

  initialize: ({@canEdit})->
    _.bindAll(@, 'render')
    @collection.bind('add', @render)
    @collection.bind('remove', @render)
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        canEdit = that.canEdit
        $el.html(tpl({picturesCollection: that.collection, canEdit: canEdit}))
        
        that.$('a[rel^="prettyPhoto"]').prettyPhoto
          slideshow: false
          social_tools: false
          theme: 'light_rounded'
          deeplinking: false
          animation_speed: 0
        
        if canEdit
          that.$('.picture-text-edit').doomEdit
            ajaxSubmit: false
            submitOnBlur: true
            submitBtn: false
            cancelBtn: false
            afterFormSubmit: (data, form, $elem)->
              $elem.text(data)
              picCid = $elem.data('pic-cid')
              pictureModel = that.collection.getByCid(picCid)
              pictureModel.save({description: data}, {silent: true})
            
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @

  deletePicture: (ev)->
    ev.preventDefault()
    $delBt = @$(ev.target)
    picCid = $delBt.data('pic-cid')
    pictureModel = @collection.getByCid(picCid)
    pictureModel.destroy()

  setAsPrimaryPicture: (ev)->
    ev.preventDefault()
    $primaryBt = @$(ev.target)
    picCid = $primaryBt.data('pic-cid')
    pictureModel = @collection.getByCid(picCid)
    @collection.unsetPrimaryPicture()
    pictureModel.save({primary: true})
    @render()

