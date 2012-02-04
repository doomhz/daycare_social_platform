class window.Kin.Staff.InvitesSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/staff/invites.html'

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
