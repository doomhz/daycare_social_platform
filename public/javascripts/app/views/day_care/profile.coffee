class window.Kin.DayCare.ProfileView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/profile.html'

  maps: null
  
  router: null
  
  profileGeneralInfo: null
  
  initialize: ({@router})->
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $(that.el).html(tpl({dayCare: that.model}))
        that.$('#profile-main-tabs').doomTabs
          firstSelectedTab: 1
          onSelect: ($selectedTab)->
            if $selectedTab.attr('id') is 'profile-view-on-map-tab' and not that.maps
              mapCenterLat = that.model.get('location').lat
              mapCenterLng = that.model.get('location').lng
              that.maps = new window.Kin.GoogleMapsView
                id: '#profile-address-maps'
                mapsOptions:
                  zoom: 15
                  mapTypeId: 'google.maps.MapTypeId.ROADMAP'
                  center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
              that.maps.render()
              that.addAddressMarker(mapCenterLat, mapCenterLng, that.model.get('name'))

        if not that.profileGeneralInfo
          that.profileGeneralInfo = new Kin.DayCare.ProfileGeneralInfoView
            el: that.$('#profile-info-tab')
            model: that.model
            router: that.router
        that.profileGeneralInfo.render()

        that.$('#daycare-gallery-tabs').doomTabs
          onSelect: ($selectedTab)->
        that.$('div.doom-carousel').doomCarousel
          autoSlide: false
          showCaption: false
          slideSpeed: 400
          showCounter: true
        that.$('a[rel^="prettyPhoto"]').prettyPhoto
          slideshow: false
          social_tools: false
          theme: 'light_rounded'
          deeplinking: false
          animation_speed: 0

    @

  remove: ()->
    if @maps
      @maps.remove()
    @unbind()
    $(@el).unbind().empty()
    @profileGeneralInfo.remove()
    @

  addAddressMarker: (lat, lng, name)->
    @addressMarker = @maps.addMarker(lat, lng, name, false)
    