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
    PicturesListView.prototype.canEdit = null;
    PicturesListView.prototype.initialize = function(_arg) {
      this.canEdit = _arg.canEdit;
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
          var $el, canEdit;
          $el = $(that.el);
          canEdit = that.canEdit;
          $el.html(tpl({
            picturesCollection: that.collection,
            canEdit: canEdit
          }));
          that.$('a[rel^="prettyPhoto"]').prettyPhoto({
            slideshow: false,
            social_tools: false,
            theme: 'light_rounded',
            deeplinking: false,
            animation_speed: 0
          });
          if (canEdit) {
            return that.$('.picture-text-edit').doomEdit({
              ajaxSubmit: false,
              submitOnBlur: true,
              submitBtn: false,
              cancelBtn: false,
              afterFormSubmit: function(data, form, $elem) {
                var picCid, pictureModel;
                $elem.text(data);
                picCid = $elem.data('pic-cid');
                pictureModel = that.collection.getByCid(picCid);
                return pictureModel.save({
                  description: data
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
    PicturesListView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };
    PicturesListView.prototype.deletePicture = function(ev) {
      var $delBt, picCid, pictureModel;
      ev.preventDefault();
      $delBt = this.$(ev.target);
      picCid = $delBt.data('pic-cid');
      pictureModel = this.collection.getByCid(picCid);
      return pictureModel.destroy();
    };
    PicturesListView.prototype.setAsPrimaryPicture = function(ev) {
      var $primaryBt, picCid, pictureModel;
      ev.preventDefault();
      $primaryBt = this.$(ev.target);
      picCid = $primaryBt.data('pic-cid');
      pictureModel = this.collection.getByCid(picCid);
      this.collection.unsetPrimaryPicture();
      pictureModel.save({
        primary: true
      });
      return this.render();
    };
    return PicturesListView;
  })();
}).call(this);
