class window.Kin.DayCare.PicturesListView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/pictures_list.html'

  events:
    'click .delete-pic-bt': 'deletePicture'

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