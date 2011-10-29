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
    ProfileEditView.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };
    ProfileEditView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          return $(that.el).html(tpl({
            dayCare: that.model
          }));
        }
      });
      return this;
    };
    ProfileEditView.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
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
