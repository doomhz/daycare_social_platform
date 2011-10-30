(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.GoogleMapsView = (function() {
    __extends(GoogleMapsView, Backbone.View);
    function GoogleMapsView() {
      GoogleMapsView.__super__.constructor.apply(this, arguments);
    }
    GoogleMapsView.prototype.id = null;
    GoogleMapsView.prototype.mapsOptions = {
      zoom: 6,
      mapTypeId: 'google.maps.MapTypeId.ROADMAP',
      center: 'new google.maps.LatLng(-34.397, 150.644)'
    };
    GoogleMapsView.prototype.mapsScriptUrl = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback={callback}';
    GoogleMapsView.prototype.mapsCallback = null;
    GoogleMapsView.prototype.map = null;
    GoogleMapsView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.mapsOptions = options.mapsOptions || this.mapsOptions;
      this.mapsCallback = options.mapsCallback;
      return this;
    };
    GoogleMapsView.prototype.getMapsScriptUrl = function() {
      return this.mapsScriptUrl = this.mapsScriptUrl.replace('{callback}', this.mapsCallback);
    };
    GoogleMapsView.prototype.loadGoogleMapsScripts = function() {
      $('<script type="text/javascript" src="' + this.getMapsScriptUrl() + '"></script>').insertAfter($(this.id));
      return this;
    };
    GoogleMapsView.prototype.render = function() {
      var domId;
      domId = this.id.replace('#', '');
      this.mapsOptions.mapTypeId = eval(this.mapsOptions.mapTypeId);
      this.mapsOptions.center = eval(this.mapsOptions.center);
      return this.map = new google.maps.Map(document.getElementById(domId), this.mapsOptions);
    };
    GoogleMapsView.prototype.createCoordinate = function(lat, lng) {
      var coordinate;
      return coordinate = new google.maps.LatLng(lat, lng);
    };
    GoogleMapsView.prototype.addMarker = function(lat, lng, title) {
      var coords, marker;
      coords = this.createCoordinate(lat, lng);
      marker = new google.maps.Marker({
        position: coords,
        title: title,
        draggable: true,
        raiseOnDrag: false
      });
      marker.setMap(this.map);
      return marker;
    };
    GoogleMapsView.prototype.updateMarker = function(marker, lat, lng, title) {
      marker.setPosition(this.createCoordinate(lat, lng));
      if (title) {
        return marker.setTitle(title);
      }
    };
    GoogleMapsView.prototype.centerToCoords = function(lat, lng) {
      var coords;
      coords = this.createCoordinate(lat, lng);
      return this.map.setCenter(coords);
    };
    return GoogleMapsView;
  })();
}).call(this);
