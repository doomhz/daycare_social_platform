class window.Kin.DayCare.ProfileView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/profile.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @