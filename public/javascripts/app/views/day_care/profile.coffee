class window.Kin.DayCare.ProfileView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/profile.html'

  maps: null

  initialize: ()->
    @model and @model.view = @
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model}))
        that.$('#profile-main-tabs').doomTabs
          onSelect: ($selectedTab)->
            if $selectedTab.attr('id') is 'profile-view-on-map-tab' and not that.maps
              mapCenterLat = that.model.get('location').lat
              mapCenterLng = that.model.get('location').lng
              that.maps = new window.Kin.GoogleMapsView
                id: '#profile-address-maps'
                mapsOptions:
                  zoom: 6
                  mapTypeId: 'google.maps.MapTypeId.ROADMAP'
                  center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
              that.maps.render()
              that.addAddressMarker(mapCenterLat, mapCenterLng, that.model.get('name'))
    @

  remove: ()->
    if @maps
      @maps.remove()
    @unbind()
    $(@el).unbind().empty()
    @

  addAddressMarker: (lat, lng, name)->
    @addressMarker = @maps.addMarker(lat, lng, name, false)
