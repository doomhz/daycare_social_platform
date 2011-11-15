(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ManagePicturesSide1View = (function() {
    __extends(ManagePicturesSide1View, Backbone.View);
    function ManagePicturesSide1View() {
      ManagePicturesSide1View.__super__.constructor.apply(this, arguments);
    }
    ManagePicturesSide1View.prototype.el = null;
    ManagePicturesSide1View.prototype.tplUrl = '/templates/side1/day_care/manage_pictures.html';
    ManagePicturesSide1View.prototype.initialize = function() {
      this.model && (this.model.view = this);
      return this;
    };
    ManagePicturesSide1View.prototype.render = function() {
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
    ManagePicturesSide1View.prototype.remove = function() {
      this.unbind();
      $(this.el).unbind().empty();
      return this;
    };
    return ManagePicturesSide1View;
  })();
}).call(this);
