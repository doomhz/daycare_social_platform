class window.Kin.DayCare.ManagePicturesView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/manage_pictures.html'

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
    @

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @