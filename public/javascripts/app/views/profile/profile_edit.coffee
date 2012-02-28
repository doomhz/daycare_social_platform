class window.Kin.Profile.ProfileEditView extends Backbone.View

  el: null

  tplUrl:
    daycare: '/templates/main/day_care/edit.html'
    parent:  '/templates/main/parent/edit.html'
    staff:  '/templates/main/staff/edit.html'
    class:  '/templates/main/class/edit.html'

  events:
    'submit #profile-edit-form': 'saveProfile'
    'change #licensed-options'  : 'toggleLicenseNumberField'
    'change #homebased-options'  : 'toggleReligiousAffiliationField'

  addressAutocompleteEl: '#address-autocomplete'

  locationAutocompleteUrl: '/geolocation'

  maps: null

  addressMarker: null

  router: null

  initialize: (options = {})->
    @model and @model.view = @
    @maps = options.maps
    @router = options.router

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl[@model.get("type")]
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({profile: that.model}))
        that.setupLocationAutocompleteForAddress()
        that.loadGoogleMaps()

        that.$(".chzn-select").chosen()
    @

  createAddressMarker: ()->
    markerData = @getProfileDataForMarker()
    that = @
    @addressMarker = @maps.addMarker(markerData.lat, markerData.lng, markerData.name)
    @maps.addMarkerDragendEvent @addressMarker,
      ()->
        coords = this.getPosition()
        that.updateLocationCoordsFields(coords.lat(), coords.lng())

  updateAddressMarker: (lat, lng, title)->
    markerData = @getProfileDataForMarker(lat, lng, title)
    @maps.updateMarker(@addressMarker, markerData.lat, markerData.lng, markerData.title)

  getProfileDataForMarker: (lat, lng, title)->
    markerData =
      lat: lat or @model.get('location').lat or 10
      lng: lng or @model.get('location').lng or 40
      name: name or @model.get('name')

  centerMap: (lat, lng)->
    @maps.centerToCoords(lat, lng)

  setupLocationAutocompleteForAddress: ($addressEl)->
    that = @
    $addressEl = that.$(@addressAutocompleteEl)
    if $addressEl.length
      $addressEl.autocomplete @locationAutocompleteUrl,
        dataType: 'text'
        autoFill: false
        selectFirst: true
        formatResult: (data, value)->
          data[0]
      .result (event, data, formatted)->
        lat = data[1]
        lng = data[2]
        that.updateLocationCoordsFields(lat, lng)
        that.updateAddressMarker(lat, lng, that.model.get('name'))
        that.centerMap(lat, lng)

  updateLocationCoordsFields: (lat, lng)->
    @$('#location-lat').val(lat)
    @$('#location-lng').val(lng)

  loadGoogleMaps: ()->
    if @$(@maps.id).length and @maps.isMapsAvailable()
      @maps.render()
      @createAddressMarker()
      @updateAddressMarker()

  remove: ()->
    $el = $(@el)
    $el.find(@addressAutocompleteEl).unautocomplete()
    @maps.remove()
    @unbind()
    $el.unbind().empty()
    @

  saveProfile: (ev)->
    ev.preventDefault()
    hashedData = @$(ev.target).hashForm()
    if hashedData.opened_since
      hashedData.opened_since = "#{hashedData.opened_since.year}-#{hashedData.opened_since.month}-#{hashedData.opened_since.day}"
    that = @
    @model.save hashedData,
      success: ()->
        that.addFormMessage($(ev.target), 'success', 'Profile information was saved.')
        that.router.navigate("profiles/view/#{that.model.get("_id")}", true)
      error: ()->
        that.addFormMessage($(ev.target), 'error', 'Profile information could not be updated.')
    false

  addFormMessage: ($form, type = 'info', message)->
    $.jGrowl(message)
    $(window).scrollTop(0)

  toggleLicenseNumberField: (ev)->
    if $(ev.target).val() is "1"
      @$('#license-number-cnt').removeClass('hidden')
    else
      @$('#license-number-cnt').addClass('hidden')

  toggleReligiousAffiliationField: (ev)->
    if $(ev.target).val() is "1"
      @$('#religious-affiliation-cnt').addClass('hidden')
    else
      @$('#religious-affiliation-cnt').removeClass('hidden')
