class window.Kin.DayCare.InvitesSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/day_care/invites.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @
