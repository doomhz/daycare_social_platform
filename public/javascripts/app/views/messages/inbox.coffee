class Kin.Messages.InboxView extends Backbone.View
  
  el: null

  tplUrl: '/templates/main/messages/inbox.html'

  initialize: ()->

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
