(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.PicturesListView = (function() {
    __extends(PicturesListView, Backbone.View);
    function PicturesListView() {
      PicturesListView.__super__.constructor.apply(this, arguments);
    }
    PicturesListView.prototype.el = null;
    PicturesListView.prototype.tplUrl = '/templates/main/day_care/pictures_list.html';
    PicturesListView.prototype.events = {
      'click .delete-pic-bt': 'deletePicture',
      'click .primary-pic-bt': 'setAsPrimaryPicture'
    };
    PicturesListView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.bindAll(this, 'render');
      this.collection.bind('add', this.render);
      this.collection.bind('remove', this.render);
      return this;
    };
    PicturesListView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          $el.html(tpl({
            picturesCollection: that.collection
          }));
          that.$('a[rel^="prettyPhoto"]').prettyPhoto({
            slideshow: false,
            social_tools: false,
            theme: 'light_rounded',
            deeplinking: false,
            animation_speed: 0
          });
          return that.$('.picture-text-edit').doomEdit({
            ajaxSubmit: false,
            onStartEdit: function($form, $elem) {
              if ($elem.text() === 'Click here to add a description') {
                return $form.find('input').val('');
              }
            },
            afterFormSubmit: function(data, form, $elem) {
              return $elem.text(data);
            }
          });
        }
      });
      return this;
    };
    PicturesListView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };
    PicturesListView.prototype.deletePicture = function(ev) {
      var $delBt, picId, pictureModel;
      ev.preventDefault();
      $delBt = this.$(ev.target);
      picId = $delBt.data('pic-id');
      pictureModel = this.collection.find(function(picture) {
        return picture.get('_id') === picId;
      });
      return pictureModel.destroy();
    };
    PicturesListView.prototype.setAsPrimaryPicture = function(ev) {
      var $primaryBt, picId, pictureModel;
      ev.preventDefault();
      $primaryBt = this.$(ev.target);
      picId = $primaryBt.data('pic-id');
      pictureModel = this.collection.find(function(picture) {
        return picture.get('_id') === picId;
      });
      this.collection.unsetPrimaryPicture();
      pictureModel.set({
        primary: true
      });
      pictureModel.save();
      return this.render();
    };
    return PicturesListView;
  })();
}).call(this);
