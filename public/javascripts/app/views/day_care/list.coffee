class window.Kin.DayCare.ListView extends Backbone.View

  el: null

  collection: null

  dayCareModelView: window.Kin.DayCare.ListItemView

  tplUrl: '/templates/main/day_care/list.html'

  initialize: ()->
    _.bindAll(@, 'render', 'addDayCareListItem')
    if @collection
      @collection.bind('add', @addDayCareListItem)
      @collection.bind('fetch', @addDayCareListItem)
    @

  render: (afterLoad)->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())
        that.collection.fetch({add: true})
    @

  addDayCareListItem: (dayCareModel)->
    dayCareView = new @dayCareModelView({model: dayCareModel})
    $list = $(@el).find('ol:first')
    $list.append(dayCareView.el)
    dayCareView.render()
    @


  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @