class Kin.DayCare.SearchView extends Backbone.View

  el: null

  collection: null

  daycareModelView: window.Kin.DayCare.SearchItemView

  tplUrl: '/templates/main/day_care/search.html'

  lisItemTplUrl: '/templates/main/day_care/search_item.html'

  events:
    "submit #daycares-filter-form": "searchSubmitHandler"

  initialize: ()->
    if @collection
      @collection.bind('add', @addProfileListItem)
      @collection.bind('reset', @addProfileListItems)
    #@getCurrentLocation()

  render: ()->
    $.tmpload
      url: @tplUrl
      onLoad: (tpl)=>
        $(@el).html(tpl())
        @autocompleteCities()
        $.tmpload
          url: @lisItemTplUrl
          onLoad: ()=>
            @collection.fetch
              add: true

  addProfileListItem: (profileModel)=>
    profileView = new @daycareModelView({model: profileModel})
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
    @populateCityAndState()
    @populateZipCode()
    $form = $(ev.target)
    @collection.fetch
      data: $form.serialize()

  populateCityAndState: ()->
    $location = @$("input[name='location']")
    location = @parseCityAndState($location.val())
    $city = @$("input[name='address_components[city]']")
    $stateCode = @$("input[name='address_components[state_code]']")
    if location.city and location.state_code
      city = location.city
      stateCode = location.state_code
    else
      city = stateCode = ""
    $city.val(city)
    $stateCode.val(stateCode)

  parseCityAndState: (location)->
    cityAndStateCode = location.split(",")
    parsedLocation =
      city: _.str.trim cityAndStateCode[0]
      state_code: _.str.trim cityAndStateCode[1]

  populateZipCode: ()->
    $location = @$("input[name='location']")
    zipCode = @parseZipCode($location.val())
    $zipCode = @$("input[name='address_components[zip_code]']")
    zipCode = if _.isNumber zipCode then zipCode else ""
    $zipCode.val(zipCode)

  parseZipCode: (location)->
    parseInt _.str.trim location

  autocompleteCities: ()->
    $.ajax
      url: "/cities"
      dataType: "json"
      success: (cities)=>
        $location = @$("input[name='location']")
        $location.autocomplete cities,
          autoFill: false
          selectFirst: true

  remove: ()->
    @unbind()
    $(@el).unbind().empty()
