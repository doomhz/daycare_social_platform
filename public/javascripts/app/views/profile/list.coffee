class window.Kin.Profile.ListView extends Backbone.View

  el: null

  collection: null

  profileModelView: window.Kin.Profile.ListItemView

  tplUrl: '/templates/main/day_care/list.html'

  lisItemTplUrl: '/templates/main/day_care/list_item.html'

  initialize: ()->
    _.bindAll(@, 'render', 'addProfileListItem')
    if @collection
      @collection.bind('add', @addProfileListItem)
      @collection.bind('fetch', @addProfileListItem)
    @

  render: (afterLoad)->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())

        $.tmpload
          url: that.lisItemTplUrl
          onLoad: ()->
            that.collection.fetch({add: true})
    @

  addProfileListItem: (profileModel)->
    profileView = new @profileModelView({model: profileModel})
    $list = $(@el).find('ol:first')
    $list.append(profileView.el)
    profileView.render()
    @


  remove: ()->
    @unbind()
    $(@el).unbind().empty()
    @