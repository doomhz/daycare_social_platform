(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.Profile.PictureSetView = (function() {
    __extends(PictureSetView, Backbone.View);
    function PictureSetView() {
      PictureSetView.__super__.constructor.apply(this, arguments);
    }
    PictureSetView.prototype.el = null;
    PictureSetView.prototype.tplUrl = '/templates/main/profile/picture_set.html';
    PictureSetView.prototype.uploader = null;
    PictureSetView.prototype.currentUser = null;
    PictureSetView.prototype.initialize = function(_arg) {
      this.currentUser = _arg.currentUser;
      this.model && (this.model.view = this);
      return this;
    };
    PictureSetView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el, canEdit;
          $el = $(that.el);
          canEdit = that.currentUser.canEditProfile(that.model.get('user_id'));
          $el.html(tpl({
            pictureSet: that.model,
            canEdit: canEdit
          }));
          if (!that.picturesListView) {
            that.picturesListView = new Kin.Profile.PicturesListView({
              el: that.$('#pictures-list'),
              collection: that.model.pictures,
              currentUser: that.currentUser,
              canEdit: canEdit
            });
          }
          that.picturesListView.render();
          if (canEdit) {
            that.uploader = new qq.FileUploader({
              element: document.getElementById('picture-uploader'),
              action: '/profiles/upload',
              debug: false,
              uploadButtonText: that.model.get('type') === 'profile' ? 'add profile picture' : 'add photos',
              template: '<div class="qq-uploader">' + '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' + '<div class="qq-upload-button primary btn">{uploadButtonText}</div>' + '<ul class="qq-upload-list"></ul>' + '</div>',
              onSubmit: function(id, fileName) {
                return that.uploader.setParams({
                  setId: that.model.get('_id')
                });
              },
              onComplete: function(id, fileName, responseJSON) {
                return that.model.pictures.add(responseJSON);
              }
            });
            that.$('#picture-set-text-edit').doomEdit({
              ajaxSubmit: false,
              submitOnBlur: true,
              submitBtn: false,
              cancelBtn: false,
              afterFormSubmit: function(data, form, $el) {
                $el.text(data);
                return that.model.save({
                  name: data
                }, {
                  silent: true
                });
              }
            });
            return that.$('#picture-set-type-select').doomEdit({
              ajaxSubmit: false,
              autoDisableBt: false,
              submitOnBlur: true,
              submitBtn: false,
              cancelBtn: false,
              editField: '<select name="setTypeSelect"><option value="public">Public</option><option value="default">Private</option></select>',
              onStartEdit: function($form, $elem) {
                return $form.find('select').val($elem.data('type'));
              },
              afterFormSubmit: function(data, $form, $el) {
                $el.text($form.find('select >option:selected').text());
                $el.data('type', data);
                return that.model.save({
                  type: data
                }, {
                  silent: true
                });
              }
            });
          }
        }
      });
      return this;
    };
    PictureSetView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      this.picturesListView.remove();
      return this;
    };
    return PictureSetView;
  })();
}).call(this);
