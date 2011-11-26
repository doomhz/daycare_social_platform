class window.Kin.DayCare.ProfileEditView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/edit.html'

  events:
    'submit #day-care-edit-form': 'saveDayCare'
    'change #licensed-options'  : 'toggleLicenseNumberField'

  addressAutocompleteEl: '#address-autocomplete'

  locationAutocompleteUrl: '/geolocation'

  maps: null

  addressMarker: null

  initialize: (options = {})->
    @model and @model.view = @
    @maps = options.maps
    @

  render: ()->
    that = @
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)->
        $el = $(that.el)
        $el.html(tpl({dayCare: that.model}))
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
    if @maps.isMapsAvailable()
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

  saveDayCare: (ev)->
    ev.preventDefault()
    hashedData = @$(ev.target).hashForm()
    hashedData.opened_since = "#{hashedData.opened_since.year}-#{hashedData.opened_since.month}-#{hashedData.opened_since.day}"
    that = @
    @model.save hashedData,
      success: ()->
        that.addFormMessage($(ev.target), 'success', 'Day care information is up to date.')
      error: ()->
        that.addFormMessage($(ev.target), 'error', 'Day care information could not be updated.')


    false

  addFormMessage: ($form, type = 'info', message)->
    $formMessages = $form.find('#form-messages')
    $formMessages.attr('class', '')
    $formMessages.addClass('form-msg-' + type)
    $formMessages.find('h3').text(message)
    $(window).scrollTop(0)
  
  toggleLicenseNumberField: (ev)->
    if $(ev.target).val() is "1"
      @$('#license-number-cnt').removeClass('hidden')
    else
      @$('#license-number-cnt').addClass('hidden')
