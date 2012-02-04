class window.Kin.Profile.ProfileEditSide1View extends Kin.Profile.ProfileSide1View

  el: null

  tplUrl:
    daycare: '/templates/side1/day_care/edit.html'
    parent:  '/templates/side1/parent/edit.html'
    staff:  '/templates/side1/staff/edit.html'
    class:  '/templates/side1/class/edit.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@model.get("type")]
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @
