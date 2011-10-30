class window.Kin.GoogleMapsView extends Backbone.View

  id: null

  mapsOptions:
    zoom: 6
    mapTypeId: 'google.maps.MapTypeId.ROADMAP'
    center: 'new google.maps.LatLng(-34.397, 150.644)'

  mapsScriptUrl: 'http://maps.googleapis.com/maps/api/js?sensor=false&callback={callback}'

  mapsCallback: null

  map: null

  initialize: (options = {})->
    @mapsOptions = options.mapsOptions or @mapsOptions
    @mapsCallback = options.mapsCallback
    @

  getMapsScriptUrl: ()->
    @mapsScriptUrl = @mapsScriptUrl.replace('{callback}', @mapsCallback)

  loadGoogleMapsScripts: ()->
    $('<script type="text/javascript" src="' + @getMapsScriptUrl() + '"></script>').insertAfter($(@id))
    @

  render: ()->
    domId = @id.replace('#', '')
    @mapsOptions.mapTypeId = eval(@mapsOptions.mapTypeId)
    @mapsOptions.center = eval(@mapsOptions.center)
    @map = new google.maps.Map(document.getElementById(domId), @mapsOptions)

  createCoordinate: (lat, lng)->
    coordinate = new google.maps.LatLng(lat, lng)

  addMarker: (lat, lng, title)->
    coords = @createCoordinate(lat, lng)
    marker = new google.maps.Marker
      position: coords
      title: title
      draggable: true
      raiseOnDrag: false
    marker.setMap(@map)
    marker

  updateMarker: (marker, lat, lng, title)->
    marker.setPosition(@createCoordinate(lat, lng))
    if title
      marker.setTitle(title)

  centerToCoords: (lat, lng)->
    coords =  @createCoordinate(lat, lng)
    @map.setCenter(coords)