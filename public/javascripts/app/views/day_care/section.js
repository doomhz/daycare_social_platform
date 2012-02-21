(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.DayCare.SectionView = (function(_super) {

    __extends(SectionView, _super);

    function SectionView() {
      SectionView.__super__.constructor.apply(this, arguments);
    }

    SectionView.prototype.el = null;

    SectionView.prototype.tplUrl = '/templates/main/day_care/{sectionName}.html';

    SectionView.prototype.model = null;

    SectionView.prototype.currentUser = null;

    SectionView.prototype.initialize = function(options) {
      return this.currentUser = options.currentUser;
    };

    SectionView.prototype.render = function() {
      var that, tplUrl;
      that = this;
      tplUrl = this.tplUrl.replace("{sectionName}", this.model.get("name")).replace(/-/g, "_");
      return $.tmpload({
        url: tplUrl,
        onLoad: function(tpl) {
          return that.model.fetch({
            success: function(model) {
              return $(that.el).html(tpl({
                section: model
              }));
            }
          });
        }
      });
    };

    SectionView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return SectionView;

  })(Backbone.View);

}).call(this);
