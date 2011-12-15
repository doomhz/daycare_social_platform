class window.Kin.Messages.ListItemView extends Backbone.View

  tagName: 'li'

  tplUrl: '/templates/main/messages/list_item.html'

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({message: that.model}))
    @