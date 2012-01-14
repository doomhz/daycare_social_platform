class window.Kin.Profile.ListItemView extends Backbone.View

  tagName: 'li'

  tplUrl: '/templates/main/day_care/list_item.html'

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