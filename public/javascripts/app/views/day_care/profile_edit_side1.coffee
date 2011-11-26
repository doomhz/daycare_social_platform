class window.Kin.DayCare.ProfileEditSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/day_care/edit.html'
  
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