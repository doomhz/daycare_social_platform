(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.PictureSetSide1View = (function() {
    __extends(PictureSetSide1View, Backbone.View);
    function PictureSetSide1View() {
      PictureSetSide1View.__super__.constructor.apply(this, arguments);
    }
    PictureSetSide1View.prototype.el = null;
    PictureSetSide1View.prototype.tplUrl = '/templates/side1/day_care/profile.html';
    PictureSetSide1View.prototype.selectedMenuItem = null;
    PictureSetSide1View.prototype.initialize = function(_arg) {
      this.selectedMenuItem = _arg.selectedMenuItem;
      this.model && (this.model.view = this);
      return this;
    };
    PictureSetSide1View.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var dayCareModel;
          dayCareModel = new Kin.DayCareModel({
            _id: that.model.get('daycare_id')
          });
          return dayCareModel.fetch({
            success: function(dayCare) {
              return $(that.el).html(tpl({
                pictureSet: that.model,
                dayCare: dayCare,
                selectedMenuItem: that.selectedMenuItem
              }));
            }
          });
        }
      });
      return this;
    };
    PictureSetSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return PictureSetSide1View;
  })();
}).call(this);
