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
          return that.maps.loadGoogleMapsScripts();
        }
      });
      return this;
    };
    ProfileEditView.prototype.createAddressMarker = function() {
      return this.addressMarker = this.maps.addMarker(this.model.get('location').lat, this.model.get('location').lng, this.model.get('name'));
    };
    ProfileEditView.prototype.updateAddressMarker = function(lat, lng, title) {
      return this.maps.updateMarker(this.addressMarker, lat, lng, title);
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
        that.$('input[name="location[lat]"]').val(lat);
        that.$('input[name="location[lng]"]').val(lng);
        that.updateAddressMarker(lat, lng, that.model.get('name'));
        return that.centerMap(lat, lng);
      });
    };
    ProfileEditView.prototype.loadGoogleMaps = function() {
      this.maps.render();
      return this.createAddressMarker();
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
      var formData, key, value, _ref;
      ev.preventDefault();
      formData = {};
      _ref = this.model.defaults;
      for (key in _ref) {
        value = _ref[key];
        formData[key] = this.getFieldValue($(ev.target).find("select[name='" + key + "'],input[name='" + key + "']&&[type='text'],input[name='" + key + "']&&[type='radio']&&[checked=true]"));
      }
      this.model.set(formData);
      this.model.save({}, {
        success: function() {
          return $(ev.target).find('.form-messages').text('Day care information is up to date.');
        },
        error: function() {
          return $(ev.target).find('.form-messages').text('Day care information could not be updated.');
        }
      });
      return false;
    };
    ProfileEditView.prototype.getFieldValue = function($field) {
      var data;
      data = [];
      if ($field.length) {
        switch ($field[0].nodeName) {
          case 'SELECT':
            $field.find('option:selected').each(function(index, el) {
              return data[index] = $(el).val();
            });
            break;
          case 'INPUT':
            data = $field.val();
        }
      }
      return data;
    };
    return ProfileEditView;
  })();
}).call(this);
