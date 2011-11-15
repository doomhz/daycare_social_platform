(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ProfileEditView = (function() {
    __extends(ProfileEditView, Backbone.View);
    function ProfileEditView() {
      ProfileEditView.__super__.constructor.apply(this, arguments);
    }
    ProfileEditView.prototype.el = null;
    ProfileEditView.prototype.tplUrl = '/templates/main/day_care/edit.html';
    ProfileEditView.prototype.events = {
      'submit #day-care-edit-form': 'saveDayCare'
    };
    ProfileEditView.prototype.addressAutocompleteEl = '#address-autocomplete';
    ProfileEditView.prototype.locationAutocompleteUrl = '/geolocation';
    ProfileEditView.prototype.maps = null;
    ProfileEditView.prototype.addressMarker = null;
    ProfileEditView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.model && (this.model.view = this);
      this.maps = options.maps;
      return this;
    };
    ProfileEditView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          $el.html(tpl({
            dayCare: that.model
          }));
          that.setupLocationAutocompleteForAddress();
          return that.loadGoogleMaps();
        }
      });
      return this;
    };
    ProfileEditView.prototype.createAddressMarker = function() {
      var markerData, that;
      markerData = this.getProfileDataForMarker();
      that = this;
      this.addressMarker = this.maps.addMarker(markerData.lat, markerData.lng, markerData.name);
      return this.maps.addMarkerDragendEvent(this.addressMarker, function() {
        var coords;
        coords = this.getPosition();
        return that.updateLocationCoordsFields(coords.lat(), coords.lng());
      });
    };
    ProfileEditView.prototype.updateAddressMarker = function(lat, lng, title) {
      var markerData;
      markerData = this.getProfileDataForMarker(lat, lng, title);
      return this.maps.updateMarker(this.addressMarker, markerData.lat, markerData.lng, markerData.title);
    };
    ProfileEditView.prototype.getProfileDataForMarker = function(lat, lng, title) {
      var markerData;
      return markerData = {
        lat: lat || this.model.get('location').lat || 10,
        lng: lng || this.model.get('location').lng || 40,
        name: name || this.model.get('name')
      };
    };
    ProfileEditView.prototype.centerMap = function(lat, lng) {
      return this.maps.centerToCoords(lat, lng);
    };
    ProfileEditView.prototype.setupLocationAutocompleteForAddress = function($addressEl) {
      var that;
      that = this;
      $addressEl = that.$(this.addressAutocompleteEl);
      return $addressEl.autocomplete(this.locationAutocompleteUrl, {
        dataType: 'text',
        autoFill: false,
        selectFirst: true,
        formatResult: function(data, value) {
          return data[0];
        }
      }).result(function(event, data, formatted) {
        var lat, lng;
        lat = data[1];
        lng = data[2];
        that.updateLocationCoordsFields(lat, lng);
        that.updateAddressMarker(lat, lng, that.model.get('name'));
        return that.centerMap(lat, lng);
      });
    };
    ProfileEditView.prototype.updateLocationCoordsFields = function(lat, lng) {
      this.$('#location-lat').val(lat);
      return this.$('#location-lng').val(lng);
    };
    ProfileEditView.prototype.loadGoogleMaps = function() {
      if (this.maps.isMapsAvailable()) {
        this.maps.render();
        this.createAddressMarker();
        return this.updateAddressMarker();
      }
    };
    ProfileEditView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      $el.find(this.addressAutocompleteEl).unautocomplete();
      this.maps.remove();
      this.unbind();
      $el.unbind().empty();
      return this;
    };
    ProfileEditView.prototype.saveDayCare = function(ev) {
      var hashedData, that;
      ev.preventDefault();
      hashedData = this.$(ev.target).hashForm();
      hashedData.opened_since = "" + hashedData.opened_since.year + "-" + hashedData.opened_since.month + "-" + hashedData.opened_since.day;
      that = this;
      this.model.save(hashedData, {
        success: function() {
          return that.addFormMessage($(ev.target), 'success', 'Day care information is up to date.');
        },
        error: function() {
          return that.addFormMessage($(ev.target), 'error', 'Day care information could not be updated.');
        }
      });
      return false;
    };
    ProfileEditView.prototype.addFormMessage = function($form, type, message) {
      var $formMessages;
      if (type == null) {
        type = 'info';
      }
      $formMessages = $form.find('#form-messages');
      $formMessages.attr('class', '');
      $formMessages.addClass('form-msg-' + type);
      $formMessages.find('h3').text(message);
      return $(window).scrollTop(0);
    };
    return ProfileEditView;
  })();
}).call(this);
