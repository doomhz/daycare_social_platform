class Kin.DayCare.SearchItemView extends Backbone.View

  tagName: 'li'

  tplUrl: '/templates/main/day_care/search_item.html'

  initialize: ()->
    @model and @model.view = @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({profile: that.model}))
