class window.Kin.DayCare.PicturesListView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/pictures_list.html'

  events:
    'click .delete-pic-bt': 'deletePicture'
    'click .primary-pic-bt': 'setAsPrimaryPicture'

  initialize: (options = {})->
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
        $el.html(tpl({picturesCollection: that.collection}))
        that.$('a[rel^="prettyPhoto"]').prettyPhoto
          slideshow: false
          social_tools: false
          theme: 'light_rounded'
          deeplinking: false
          animation_speed: 0
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @

  deletePicture: (ev)->
    ev.preventDefault()
    $delBt = @$(ev.target)
    picId = $delBt.data('pic-id')
    pictureModel = @collection.find (picture)->
      picture.get('_id') is picId
    pictureModel.destroy()

  setAsPrimaryPicture: (ev)->
    ev.preventDefault()
    $primaryBt = @$(ev.target)
    picId = $primaryBt.data('pic-id')
    pictureModel = @collection.find (picture)->
      picture.get('_id') is picId
    @collection.unsetPrimaryPicture()
    pictureModel.set({primary: true})
    pictureModel.save()
    @render()

