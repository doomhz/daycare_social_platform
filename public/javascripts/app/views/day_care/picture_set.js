(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.PictureSetView = (function() {
    __extends(PictureSetView, Backbone.View);
    function PictureSetView() {
      PictureSetView.__super__.constructor.apply(this, arguments);
    }
    PictureSetView.prototype.el = null;
    PictureSetView.prototype.tplUrl = '/templates/main/day_care/picture_set.html';
    PictureSetView.prototype.uploader = null;
    PictureSetView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.model && (this.model.view = this);
      this.maps = options.maps;
      return this;
    };
    PictureSetView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          $el.html(tpl({
            pictureSet: that.model
          }));
          that.uploader = new qq.FileUploader({
            element: document.getElementById('picture-uploader'),
            action: 'day-cares/upload',
            debug: false,
            onSubmit: function(id, fileName) {
              return that.uploader.setParams({
                setId: that.model.get('_id')
              });
            },
            onComplete: function(id, fileName, responseJSON) {
              return that.model.pictures.add(responseJSON);
            }
          });
          that.picturesListView = new Kin.DayCare.PicturesListView({
            el: that.$('#pictures-list'),
            collection: that.model.pictures
          });
          return that.picturesListView.render();
        }
      });
      return this;
    };
    PictureSetView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };
    return PictureSetView;
  })();
}).call(this);
