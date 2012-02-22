(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.DayCare.EditSectionView = (function(_super) {

    __extends(EditSectionView, _super);

    function EditSectionView() {
      EditSectionView.__super__.constructor.apply(this, arguments);
    }

    EditSectionView.prototype.el = null;

    EditSectionView.prototype.tplUrl = '/templates/main/day_care/edit_{sectionName}.html';

    EditSectionView.prototype.model = null;

    EditSectionView.prototype.initialize = function(options) {};

    EditSectionView.prototype.render = function() {
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

    EditSectionView.prototype.remove = function() {
      this.unbind();
      return $(this.el).unbind().empty();
    };

    return EditSectionView;

  })(Backbone.View);

}).call(this);
