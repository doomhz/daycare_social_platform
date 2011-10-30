class window.Kin.DayCare.ProfileEditView extends Backbone.View

  el: null

  tplUrl: '/templates/main/day_care/edit.html'

  events:
    'submit #day-care-edit-form': 'saveDayCare'

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
        that.maps.loadGoogleMapsScripts()
    @

  createAddressMarker: ()->
    @addressMarker = @maps.addMarker(@model.get('location').lat, @model.get('location').lng, @model.get('name'))

  updateAddressMarker: (lat, lng, title)->
    @maps.updateMarker(@addressMarker, lat, lng, title)

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
      that.$('input[name="location[lat]"]').val(lat)
      that.$('input[name="location[lng]"]').val(lng)
      that.updateAddressMarker(lat, lng, that.model.get('name'))
      that.centerMap(lat, lng)

  loadGoogleMaps: ()->
    @maps.render()
    @createAddressMarker()

  remove: ()->
    $el = $(@el)
    $el.find(@addressAutocompleteEl).unautocomplete()
    @maps.remove()
    @unbind()
    $el.unbind().empty()
    @

  saveDayCare: (ev)->
    ev.preventDefault()
    formData = {}
    (formData[key] = @getFieldValue($(ev.target).find("select[name='#{key}'],input[name='#{key}']&&[type='text'],input[name='#{key}']&&[type='radio']&&[checked=true]"))) for key, value of @model.defaults

    @model.set(formData)
    @model.save {},
      success: ()->
        $(ev.target).find('.form-messages').text('Day care information is up to date.')
      error: ()->
        $(ev.target).find('.form-messages').text('Day care information could not be updated.')

    false

  getFieldValue: ($field)->
    data = []
    if $field.length
      switch $field[0].nodeName
        when 'SELECT' then $field.find('option:selected').each((index, el)-> data[index] = $(el).val())
        when 'INPUT' then data = $field.val()
    data
