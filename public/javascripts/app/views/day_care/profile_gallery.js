(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Kin.DayCare.ProfileGalleryView = (function() {
    __extends(ProfileGalleryView, Kin.DayCare.ProfileView);
    function ProfileGalleryView() {
      ProfileGalleryView.__super__.constructor.apply(this, arguments);
    }
    ProfileGalleryView.prototype.tplUrl = '/templates/main/day_care/profile_gallery.html';
    ProfileGalleryView.prototype.events = {
      'click #show-new-pic-set-form-bt': 'openNewPicSetForm',
      'click #cancel-new-pic-set-bt': 'closeNewPicSetForm',
      'submit #create-new-pic-cnt': 'submitCreateNewPicSetForm',
      'click .delete-pic-set-bt': 'deletePictureSet'
    };
    ProfileGalleryView.prototype.initialize = function(_arg) {
      this.router = _arg.router, this.currentUser = _arg.currentUser;
      return _.bindAll(this, 'render');
    };
    ProfileGalleryView.prototype.openNewPicSetForm = function(ev) {
      this.$('#show-new-pic-set-form-bt').addClass('hidden');
      return this.$('#create-new-pic-cnt').removeClass('hidden');
    };
    ProfileGalleryView.prototype.closeNewPicSetForm = function(ev) {
      this.$('#show-new-pic-set-form-bt').removeClass('hidden');
      return this.$('#create-new-pic-cnt').addClass('hidden');
    };
    ProfileGalleryView.prototype.submitCreateNewPicSetForm = function(ev) {
      var newPicSetName, newPicSetType, pictureSet, that;
      ev.preventDefault();
      newPicSetName = this.$(ev.target).find('input[name="new-pic-set-name"]').val();
      newPicSetType = this.$(ev.target).find('select[name="new-pic-set-type"]').val();
      pictureSet = new Kin.PictureSetModel({
        name: newPicSetName,
        type: newPicSetType
      });
      this.model.pictureSets.add(pictureSet);
      that = this;
      return this.model.save(null, {
        success: function(model, response) {
          return model.fetch({
            success: function(newModel) {
              model.setPictureSets();
              return that.render();
            }
          });
        }
      });
    };
    ProfileGalleryView.prototype.deletePictureSet = function(ev) {
      var $delBt, picSetId, pictureSet, that;
      ev.preventDefault();
      $delBt = this.$(ev.target);
      picSetId = $delBt.data('pic-set-id');
      pictureSet = this.model.pictureSets.find(function(model) {
        return model.get('_id') === picSetId;
      });
      that = this;
      return pictureSet.destroy({
        success: function() {
          return that.render();
        }
      });
    };
    return ProfileGalleryView;
  })();
}).call(this);
