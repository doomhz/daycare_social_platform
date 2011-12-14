class window.Kin.Messages.InboxSide1View extends Backbone.View

  el: null

  tplUrl: '/templates/side1/messages/inbox.html'

  selectedMenuItem: null
  
  initialize: ({@selectedMenuItem})->
    @model and @model.view = @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({selectedMenuItem: that.selectedMenuItem}))

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
