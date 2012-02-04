class window.Kin.Profile.OurFamilyView extends Kin.Profile.ProfileView

  model: null

  el: null

  tplUrl: '/templates/main/profile/our_family.html'

  parentsList: null

  profileGeneralInfo: null

  currentUser: null

  router: null

  events:
    "keydown #parents-name-filter": "filterNamesHandler"
    "click #parents-name-filter-bt": "filterNamesHandler"

  initialize: (options)->
    @currentUser = options.currentUser
    @router = options.router

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl())
        canEdit = that.currentUser.canEditProfile(that.model.get('_id'))

        that.$('#profile-main-tabs').doomTabs
          firstSelectedTab: 1
          onSelect: ($selectedTab)->
            if $selectedTab.attr('id') is 'profile-view-on-map-tab' and not that.maps
              mapCenterLat = that.model.get('location').lat
              mapCenterLng = that.model.get('location').lng
              that.maps = new window.Kin.GoogleMapsView
                id: '#profile-address-maps'
                mapsOptions:
                  zoom: 16
                  mapTypeId: 'google.maps.MapTypeId.ROADMAP'
                  center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
              that.maps.render()
              that.addAddressMarker(mapCenterLat, mapCenterLng, that.model.get('name'))

        $parentsListGroup = $el.find("#parents-list-cnt")
        that.parentsList = new Kin.Profile.OurFamilyListView
          el: $parentsListGroup
          model: that.model
        that.parentsList.render()

        if not that.profileGeneralInfo
          that.profileGeneralInfo = new Kin.Profile.ProfileGeneralInfoView
            el: that.$('#profile-info-tab')
            model: that.model
            router: that.router
            currentUser: that.currentUser
            canEdit: canEdit
        that.profileGeneralInfo.render()

        that.$('#profile-gallery-tabs').doomTabs
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

  filterNamesHandler: (ev)->
    textToFind = $("#parents-name-filter").val().toLowerCase().trim()
    @parentsList.findByName(textToFind)

  remove: ()->
    $el = $(@el)
    @unbind()
    $el.unbind().empty()
    @