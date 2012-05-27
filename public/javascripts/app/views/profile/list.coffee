class Kin.Profile.ListView extends Backbone.View

  el: null

  collection: null

  profileModelView: window.Kin.Profile.ListItemView

  tplUrl: '/templates/main/day_care/list.html'

  lisItemTplUrl: '/templates/main/day_care/list_item.html'

  events:
    "submit #daycares-filter-form": "searchSubmitHandler"

  initialize: ()->
    if @collection
      @collection.bind('add', @addProfileListItem)
      @collection.bind('reset', @addProfileListItems)
    @getCurrentLocation()

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl())
        $.tmpload
          url: that.lisItemTplUrl
          onLoad: ()->
            that.collection.fetch
              add: true

  addProfileListItem: (profileModel)=>
    profileView = new @profileModelView({model: profileModel})
    $list = $(@el).find('ol:first')
    $list.append(profileView.el)
    profileView.render()

  addProfileListItems: (models)=>
    $(@el).find('ol:first').empty()
    @collection.each (model)=>
      @addProfileListItem(model)

  getCurrentLocation: ()->
    navigator.geolocation.getCurrentPosition(@onPositionSuccess)

  onPositionSuccess: (geoposition)=>
    latitude = geoposition.coords.latitude
    longitude = geoposition.coords.longitude
    @$("input[name='clpos[lat]']").val(latitude)
    @$("input[name='clpos[lng]']").val(longitude)

  searchSubmitHandler: (ev)->
    ev.preventDefault()
    $form = $(ev.target)
    @collection.fetch
      data: $form.serialize()

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
