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
      'click .delete-pic-bt': 'deletePicture'
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
          return $el.html(tpl({
            picturesCollection: that.collection
          }));
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
    return PicturesListView;
  })();
}).call(this);
