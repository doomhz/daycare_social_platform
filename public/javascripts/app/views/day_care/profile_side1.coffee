class window.Kin.DayCare.ProfileSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/day_care/profile.html'
  
  selectedMenuItem: null

  initialize: ({@selectedMenuItem})->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model, selectedMenuItem: that.selectedMenuItem}))
    @

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @